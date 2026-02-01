'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Mail, ShoppingBag, ArrowUpRight, TrendingUp } from 'lucide-react';
import { subscribeToCustomers } from '@/lib/firebase/admin';
import { UserProfile } from '@/types';
import { format } from 'date-fns';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToCustomers((data) => {
            setCustomers(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        (customer.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 bg-white text-black">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Customers</h1>
                    <p className="text-sm text-gray-600">View and manage your registered client base.</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Total Customers</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-black">{customers.length}</p>
                        <div className="flex items-center text-xs text-green-500 font-bold mb-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12%
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Active Shoppers</p>
                    <p className="text-3xl font-bold text-black">{Math.floor(customers.length * 0.7)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Subscriber Rate</p>
                    <p className="text-3xl font-bold text-black">94%</p>
                </div>
            </div>

            {/* Table/List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-black">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                        />
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-black">
                        <Filter className="w-4 h-4" />
                        Sort by: Newest
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Total Spend</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading customers...</td>
                                </tr>
                            ) : filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-black">
                                                {customer.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">{customer.name || 'Anonymous User'}</p>
                                                <p className="text-[11px] text-gray-500">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700">
                                            Verified
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600">
                                        {customer.createdAt ? format(new Date(customer.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-black">
                                        ₦0.00
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`mailto:${customer.email}`}
                                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                                title="Email Customer"
                                            >
                                                <Mail className="w-4 h-4 text-gray-400" />
                                            </Link>
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No customers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
