'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  trackingNumber?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function OrderDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && id) {
      fetchOrder();
    }
  }, [user, loading, id, router]);

  const fetchOrder = async () => {
    if (!user || !id) return;
    
    try {
      const orderDoc = await getDoc(doc(db, 'orders', id));
      if (orderDoc.exists()) {
        const data = orderDoc.data();
        // Verify that this order belongs to the current user
        if (data.userId !== user.uid) {
          router.push('/account');
          return;
        }
        
        setOrder({
          id: orderDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        } as Order);
      } else {
        router.push('/account');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/account');
    } finally {
      setLoadingOrder(false);
    }
  };

  if (loading || loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user || !order) {
    return null; // Redirect handled by useEffect
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' };
      case 'shipped':
        return { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'processing':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100' };
      case 'cancelled':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' };
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' };
    }
  };

  const StatusIcon = getStatusInfo(order.orderStatus).icon;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
            <h1 className="font-display text-4xl md:text-5xl">Order Details</h1>
          </div>
          <Link href="/account/orders" className="mt-6 md:mt-0 text-sm font-bold text-red-600 hover:text-red-500 transition-colors">
            ← Back to Orders
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <nav className="flex flex-col gap-1">
              <Link href="/account/orders" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#141414] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span>Orders</span>
                </div>
              </Link>
              <Link href="/account/addresses" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span>Addresses</span>
                </div>
              </Link>
              <Link href="/account/payment-methods" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span>Payment Methods</span>
                </div>
              </Link>
              <Link href="/account/profile" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile Details</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Order Summary */}
            <section className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-50 dark:bg-[#111] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Order # {order.id.slice(0, 8).toUpperCase()}</h3>
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
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-lg">{order.currency}{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="w-20 h-20 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.size}, {item.color}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.currency}{item.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Order Status Timeline */}
            <section>
              <h2 className="font-display text-2xl mb-6">Order Status</h2>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${getStatusInfo(order.orderStatus).bg} ${getStatusInfo(order.orderStatus).border} border`}>
                    <StatusIcon className={`w-6 h-6 ${getStatusInfo(order.orderStatus).color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg capitalize">{order.orderStatus}</h3>
                    <p className="text-sm text-gray-500">
                      {order.orderStatus === 'pending' && 'Your order is being processed'}
                      {order.orderStatus === 'confirmed' && 'Your order has been confirmed'}
                      {order.orderStatus === 'processing' && 'Your order is being prepared for shipment'}
                      {order.orderStatus === 'shipped' && 'Your order has been shipped'}
                      {order.orderStatus === 'delivered' && 'Your order has been delivered'}
                      {order.orderStatus === 'cancelled' && 'Your order has been cancelled'}
                    </p>
                  </div>
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-2">Tracking Information</h4>
                    <p className="text-sm">Tracking Number: {order.trackingNumber}</p>
                    <button className="mt-2 text-sm font-bold text-red-600 hover:text-red-500">Track Package</button>
                  </div>
                )}
              </div>
            </section>

            {/* Order Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Shipping Address</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address1}<br />
                  {order.shippingAddress.address2 && `${order.shippingAddress.address2}<br />`}
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}<br />
                  {order.shippingAddress.phone}
                </p>
              </div>

              {/* Payment Information */}
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Payment Information</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm font-bold">{order.currency}{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-sm font-bold">{order.currency}{order.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-sm font-bold">{order.currency}{order.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-sm font-bold">{order.currency}{order.total.toLocaleString()}</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">Payment Status: <span className="capitalize">{order.paymentStatus}</span></p>
                    {order.paymentReference && (
                      <p className="text-sm text-gray-500">Reference: {order.paymentReference}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}