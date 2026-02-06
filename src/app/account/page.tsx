'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, User, LogOut, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's addresses
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAddresses(userData.addresses || []);
      }

      // Fetch recent orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData: Order[] = [];

      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order);
      });

      // Sort by date and take the 5 most recent
      const sortedOrders = ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

  return (
    <div className="bg-gray-200 dark:bg-gray-200 text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
            <h1 className="font-display text-red-600 md:text-5xl">Welcome, {user.displayName || 'Member'}</h1>
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
            {/* Recent Orders */}
            <section>
              <h2 className="font-display text-red-600 mb-6">Recent Orders</h2>

              {recentOrders.length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-sm text-gray-500 mb-6">When you place an order, it will appear here.</p>
                  <Link href="/shop" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentOrders.map((order) => (
                    <Link key={order.id} href={`/account/orders/${order.id}`} className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Order # {order.id.slice(0, 8).toUpperCase()}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                          order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          order.orderStatus === 'processing' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                          order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-black">{order.currency}{order.total.toLocaleString()}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{order.items.length} items</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Account Overview Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-black uppercase tracking-widest">Default Address</h3>
                  <Link href="/account/addresses" className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white underline">Edit</Link>
                </div>
                {defaultAddress ? (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {defaultAddress.firstName} {defaultAddress.lastName}<br />
                    {defaultAddress.address1}<br />
                    {defaultAddress.address2 && `${defaultAddress.address2}<br />`}
                    {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}<br />
                    {defaultAddress.country}<br />
                    {defaultAddress.phone}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {user.displayName}<br />
                    No address saved yet.<br />
                    Add an address to speed up checkout.
                  </p>
                )}
                <Link href="/account/addresses" className="mt-4 text-xs font-bold text-red-600 hover:text-red-500">Add Address</Link>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-black uppercase tracking-widest">Newsletter</h3>
                  <Link href="/account/profile" className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white underline">Edit</Link>
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