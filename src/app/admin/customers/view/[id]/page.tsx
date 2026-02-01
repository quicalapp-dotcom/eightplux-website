'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Mail, ShoppingBag, Calendar, MapPin, DollarSign, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

export default function CustomerDetailPage() {
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Fetch User Profile
                const userDoc = await getDoc(doc(db, 'users', id));
                if (userDoc.exists()) {
                    setCustomer(userDoc.data());
                }

                // Fetch User Orders
                const q = query(collection(db, 'orders'), where('userId', '==', id), orderBy('createdAt', 'desc'));
                const orderSnap = await getDocs(q);
                setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (!customer) return <div className="text-center py-20"><p>Customer not found.</p></div>;

    const totalSpent = orders.reduce((acc, order) => acc + (order.totalAmount || order.total || 0), 0);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Customer Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#111] p-8 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-gray-400">{customer.name?.[0] || 'U'}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
                        <p className="text-sm text-gray-500 mb-6">{customer.email}</p>

                        <div className="flex justify-center gap-3">
                            <a href={`mailto:${customer.email}`} className="p-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Joined</p>
                                    <p className="text-sm">{customer.createdAt ? format(customer.createdAt.toDate ? customer.createdAt.toDate() : new Date(customer.createdAt), 'MMMM dd, yyyy') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Primary Location</p>
                                    <p className="text-sm">{customer.addresses?.[0]?.city || 'No address on file'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lifetime Value</span>
                            </div>
                            <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                                <ShoppingBag className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Orders</span>
                            </div>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                                <Package className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Items Purchased</span>
                            </div>
                            <p className="text-2xl font-bold">{orders.reduce((acc, order) => acc + (order.items?.length || 0), 0)}</p>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Order History</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.length > 0 ? orders.map((order) => (
                                <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-6 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500">{format(order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">₦{order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</p>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${order.orderStatus === 'delivered' ? 'text-green-500' : 'text-blue-500'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-12 text-center text-gray-500 text-sm">No orders made yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
