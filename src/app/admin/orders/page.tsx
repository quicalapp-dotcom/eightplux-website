'use client';

import { useEffect, useState } from 'react';
import { Eye, Filter, Search, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { subscribeToOrders, updateOrderStatus } from '@/lib/firebase/orders';
import { Order } from '@/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        // Check filtering safely (order.id might be undefined in some edge cases if data is corrupt)
        const matchesSearch = (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.shippingAddress?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">Orders</h1>
                    <p className="text-sm text-gray-600">Manage customer orders and shipments.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm text-black">
                        Export Ledger
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm text-black">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-black"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none font-medium text-black"
                >
                    <option value="all">All Ecosystem Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">In Transit</option>
                    <option value="delivered">Fulfilled</option>
                    <option value="cancelled">Voided</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Order Ledger</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Customer Entity</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Timestamp</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Status</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Payment Method</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-right">Settlement</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold font-mono text-[10px] sm:text-xs text-gray-500">
                                        #{order.id.slice(0, 10).toUpperCase()}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-black">
                                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium">{order.shippingAddress.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 font-medium text-xs">
                                        {order.createdAt ? format(
                                            order.createdAt instanceof Timestamp
                                                ? order.createdAt.toDate()
                                                : typeof order.createdAt === 'string'
                                                    ? new Date(order.createdAt)
                                                    : order.createdAt instanceof Date
                                                        ? order.createdAt
                                                        : new Date(),
                                            'MMM dd, yyyy'
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    order.orderStatus === 'processing' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-100'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-600">{order.paymentMethod.replace('_', ' ')}</span>
                                            {order.paymentMethod.includes('crypto') && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-black">
                                        {order.currency === 'USD' ? '$' : '₦'}{order.total.toLocaleString()}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-block"
                                        >
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
