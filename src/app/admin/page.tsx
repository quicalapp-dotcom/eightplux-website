'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    Clock,
    DollarSign,
    Package
} from 'lucide-react';
import Link from 'next/link';
import { subscribeToDashboardStats } from '@/lib/firebase/admin';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToDashboardStats((data) => {
            setStats(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const metrics = [
        {
            label: 'Total Revenue',
            value: stats ? `₦${stats.totalRevenue.toLocaleString()}` : '₦0',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-500'
        },
        {
            label: 'Total Orders',
            value: stats?.totalOrders || 0,
            change: '+5.2%',
            trend: 'up',
            icon: ShoppingBag,
            color: 'text-blue-500'
        },
        {
            label: 'Total Customers',
            value: stats?.customersCount || 0,
            change: '+2.1%',
            trend: 'up',
            icon: Users,
            color: 'text-purple-500'
        },
        {
            label: 'Products',
            value: stats?.productsCount || 0,
            change: '0%',
            trend: 'neutral',
            icon: Package,
            color: 'text-gray-500'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 bg-white text-black">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">Enterprise Overview</h1>
                    <p className="text-sm text-gray-600">Real-time performance metrics and ecosystem status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Live Ecosystem
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {metrics.map((metric) => (
                    <div key={metric.label} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group text-black">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-red-600 transition-colors`}>
                                <metric.icon className={`w-5 h-5 ${metric.color} group-hover:text-white`} />
                            </div>
                            {metric.trend === 'up' ? (
                                <span className="flex items-center text-xs font-bold text-green-500">
                                    <ArrowUpRight className="w-3 h-3 mr-1" /> {metric.change}
                                </span>
                            ) : (
                                <span className="flex items-center text-xs font-bold text-gray-400">
                                    {metric.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.1em] text-gray-500 font-bold mb-1">{metric.label}</p>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">{metric.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Recent Orders List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500">Latest Transactions</h3>
                        <Link href="/admin/orders" className="text-xs font-bold text-red-600 hover:underline self-start sm:self-auto">View Ledger</Link>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                        {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order: any) => (
                            <div key={order.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-500 group-hover:text-red-600 group-hover:border-red-100 transition-colors">
                                        <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-black">Order #{order.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">{order.items?.[0]?.name || 'Internal Transaction'}</p>
                                    </div>
                                </div>
                                <div className="sm:text-right">
                                    <p className="font-bold text-sm tracking-tight text-black">₦{order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium">
                                        {order.createdAt ? format(order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt), 'hh:mm a') : 'Now'}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 sm:p-12 text-center text-gray-500 text-xs font-medium">No recent orders found.</div>
                        )}
                    </div>
                </div>

                {/* Growth Chart / Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between text-black">
                        <div>
                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4 sm:mb-8">Stock Logistics</h3>
                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Depleted Inventory</span>
                                    <span className="text-sm font-bold text-red-600">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Refill Critical</span>
                                    <span className="text-sm font-bold text-orange-500">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Global Skus</span>
                                    <span className="text-sm font-bold text-black">{stats?.productsCount || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 sm:pt-6 border-t border-gray-100 mt-4 sm:mt-8">
                            <Link
                                href="/admin/products"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-black transition-colors"
                            >
                                Logistics Hub
                                <Package className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Additional info panel could go here if needed */}
                </div>
            </div>
        </div>
    );
}
