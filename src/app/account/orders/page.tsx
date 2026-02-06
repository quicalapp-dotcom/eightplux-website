'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, Search, Filter, Eye, ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  currency: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const ordersData: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order);
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-600 border border-green-100';
      case 'shipped':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'processing':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-200 text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
            <h1 className="font-display text-red-600 md:text-5xl">Order History</h1>
          </div>
          <Link href="/account" className="mt-6 md:mt-0 text-sm font-bold text-red-600 hover:text-red-500 transition-colors">
            ← Back to Account
          </Link>
        </div>

         <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <nav className="flex flex-col gap-1">
              <Link href="/account/orders" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-red-600">Orders</span>
                </div>
              </Link>
              <Link href="/account/addresses" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="text-red-600">Addresses</span>
                </div>
              </Link>
              <Link href="/account/payment-methods" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-red-600">Payment Methods</span>
                </div>
              </Link>
              <Link href="/account/profile" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-white dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-red-600">Profile Details</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-200 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-200 border border-gray-100 dark:border-gray-800 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
              <button className="px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-lg text-black font-medium hover:bg-gray-50 dark:hover:bg-[#1a1a1a] flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-red-600 font-medium mb-2">No orders yet</h3>
                <p className="text-sm text-gray-500 mb-6">When you place an order, it will appear here.</p>
                <Link href="/shop" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-6 bg-gray-50 dark:bg-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className="font-bold text-sm uppercase tracking-widest text-black">Order # {order.id.slice(0, 8).toUpperCase()}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm text-black mt-1">
                          Placed on {order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-black">Total</p>
                          <p className="font-bold text-black">{order.currency}{order.total.toLocaleString()}</p>
                        </div>
                        <Link href={`/account/orders/${order.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                          <Eye className="w-5 h-5 text-black" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-black">Items</h4>
                        <span className="text-sm text-black">{order.items.length} items</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-black">{item.name}</p>
                              <p className="text-sm text-black">Qty: {item.quantity}</p>
                              <p className="font-bold text-black">{order.currency}{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center gap-4 text-sm text-black">
                            + {order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}