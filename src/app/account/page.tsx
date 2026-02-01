'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Package, User, LogOut, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
                        <h1 className="font-display text-4xl md:text-5xl">Welcome, {user.displayName || 'Member'}</h1>
                        <p className="text-sm text-gray-500 mt-2">{user.email}</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="mt-6 md:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-1">
                        <nav className="flex flex-col gap-1">
                            <button className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#141414] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <Package className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <span>Orders</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <span>Addresses</span>
                                </div>
                            </button>
                            <button className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <span>Payment Methods</span>
                                </div>
                            </button>
                            <button className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    <span>Profile Details</span>
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* Recent Orders */}
                        <section>
                            <h2 className="font-display text-2xl mb-6">Recent Orders</h2>

                            {/* Empty State / Mock Data */}
                            <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
                                <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                                <p className="text-sm text-gray-500 mb-6">When you place an order, it will appear here.</p>
                                <Link href="/shop" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Start Shopping
                                </Link>
                            </div>
                        </section>

                        {/* Account Overview Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-sm uppercase tracking-widest">Default Address</h3>
                                    <button className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white underline">Edit</button>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {user.displayName}<br />
                                    No address saved yet.<br />
                                    Add an address to speed up checkout.
                                </p>
                                <button className="mt-4 text-xs font-bold text-red-600 hover:text-red-500">Add Address</button>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-sm uppercase tracking-widest">Newsletter</h3>
                                    <button className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white underline">Edit</button>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    You are currently subscribed to our newsletter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
