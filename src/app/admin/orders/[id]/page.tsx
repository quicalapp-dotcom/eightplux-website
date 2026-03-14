'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order } from '@/types';
import { updateOrderStatus } from '@/lib/firebase/orders';
import { updateDoc } from 'firebase/firestore';
import { ArrowLeft, MapPin, CreditCard, Box, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import OrderStepper from '@/components/ui/OrderStepper';

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id || Array.isArray(id)) return;
            const docRef = doc(db, 'orders', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

     const handleStatusUpdate = async (newStatus: Order['orderStatus']) => {
        if (!order) return;
        setUpdating(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            // Update the local state to reflect the change immediately
            setOrder(prevOrder => prevOrder ? { ...prevOrder, orderStatus: newStatus, updatedAt: new Date() } : null);

            // Send order status email via API route
            try {
                await fetch(`/api/orders/${order.id}/notify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        trackingNumber: order.trackingNumber
                    }),
                });
            } catch (emailError) {
                console.error('Failed to send order status email:', emailError);
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleTrackingUpdate = async (trackingNumber: string) => {
        if (!order) return;
        try {
            await updateDoc(doc(db, 'orders', order.id), {
                trackingNumber,
                updatedAt: serverTimestamp()
            });

            // Update the local state to reflect the change immediately
            setOrder(prevOrder => prevOrder ? { ...prevOrder, trackingNumber, updatedAt: new Date() } : null);
        } catch (error) {
            console.error('Failed to update tracking', error);
        }
    };

    if (loading) {
        return <div className="p-12 text-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-12 text-center">Order not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 dark:hover:bg-grey-200 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-mono">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-sm text-gray-500">Placed on {
                            order.createdAt instanceof Timestamp
                                ? order.createdAt.toDate().toLocaleDateString()
                                : new Date(order.createdAt).toLocaleDateString()
                        }</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Tracking Number</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Enter tracking #"
                                value={order.trackingNumber || ''}
                                onChange={(e) => setOrder({ ...order, trackingNumber: e.target.value })}
                                onBlur={(e) => handleTrackingUpdate(e.target.value)}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-grey-200 border border-gray-200 dark:border-gray-800 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 w-40"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase font-bold text-gray-500">Update Status:</span>
                        <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusUpdate(e.target.value as Order['orderStatus'])}
                            disabled={updating}
                            className="px-4 py-2 bg-white dark:bg-grey-200 border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            <option value="pending">Pending Review</option>
                            <option value="confirmed">Confirmed (Paid)</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Visual Tracking Stepper */}
            <div className="bg-white dark:bg-grey-200 p-8 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400">Order Journey</h2>
                    <span className="text-[10px] uppercase font-bold px-3 py-1 bg-gray-50 dark:bg-grey-400 rounded-full border border-gray-100 dark:border-gray-800">
                        Live Tracking
                    </span>
                </div>
                <OrderStepper 
                    currentStatus={order.orderStatus} 
                    isCancelled={order.orderStatus === 'cancelled'} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="md:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-grey-200 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <Box className="w-4 h-4 text-gray-500" />
                            <h2 className="font-bold text-sm uppercase tracking-wide">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-20 bg-gray-100 dark:bg-grey-400 rounded-md overflow-hidden relative flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">
                                            {order.currency === 'USD' ? '$' : '₦'}{item.price.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-grey-400 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{order.currency === 'USD' ? '$' : '₦'}{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span>{order.currency === 'USD' ? '$' : '₦'}{order.shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-800">
                                <span>Total</span>
                                <span>{order.currency === 'USD' ? '$' : '₦'}{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white dark:bg-grey-200 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <h2 className="font-bold text-sm uppercase tracking-wide">Payment Information</h2>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Payment Method</p>
                                <p className="font-medium capitalize flex items-center gap-2">
                                    {order.paymentMethod.replace('_', ' ')}
                                    {order.paymentMethod.includes('crypto') && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">Blockchain</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.paymentStatus === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.cryptoTransactionHash && (
                                <div className="col-span-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md border border-blue-100 dark:border-blue-900/30">
                                    <p className="text-xs uppercase font-bold text-blue-700 dark:text-blue-400 mb-2">Blockchain Transaction</p>
                                    <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-300">
                                        {order.cryptoTransactionHash}
                                    </p>
                                    <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">View on Explorer</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Actions */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white dark:bg-grey-200 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <h2 className="font-bold text-sm uppercase tracking-wide">Customer & Delivery</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</h3>
                                <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-300">
                                <p>{order.shippingAddress.address1}</p>
                                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fraud Check (Mock) */}
                    <div className="bg-white dark:bg-grey-200 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-gray-500" />
                            <h2 className="font-bold text-sm uppercase tracking-wide">Risk Analysis</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Fraud Score</span>
                                <span className="text-green-600 font-bold">Low Risk</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 w-[10%] h-full"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                IP Address location matches billing address country.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
