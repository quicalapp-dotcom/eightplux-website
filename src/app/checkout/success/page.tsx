'use client';

import Link from 'next/link';
import { Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function OrderSuccessPage() {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            // Check for orderId in URL params (from NOWPayments redirect or manual success)
            const params = new URLSearchParams(window.location.search);
            let orderId = params.get('orderId');

            // Fallback to sessionStorage if no orderId in URL
            if (!orderId) {
                orderId = sessionStorage.getItem('pendingOrderId');
                if (orderId) {
                    // Clear it and redirect to URL with orderId
                    sessionStorage.removeItem('pendingOrderId');
                    window.history.replaceState({}, '', `/checkout/success?orderId=${orderId}`);
                }
            }

            if (!orderId) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            try {
                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);

                if (orderSnap.exists()) {
                    setOrder(orderSnap.data());
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                <p className="text-[10px] uppercase tracking-widest font-bold">Loading order...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="font-tt text-4xl mb-4 lowercase">Order Not Found</h1>
                <p className="text-gray-500 mb-8 text-center">We could not find your order. Please contact support if you made a payment.</p>
                <Link
                    href="/shop"
                    className="bg-black text-white py-4 px-8 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#C72f32] transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const orderNumber = order?.orderId || `8P-${Math.floor(Math.random() * 1000000)}`;
    const isPaid = order?.paymentStatus === 'paid';
    const isProcessing = order?.paymentStatus === 'processing';

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg text-center animate-fade-in-up">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${
                    isPaid ? 'bg-green-100' : isProcessing ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                    <Check className={`w-10 h-10 ${isPaid ? 'text-green-600' : isProcessing ? 'text-yellow-600' : 'text-gray-600'}`} />
                </div>

                <h1 className="font-tt text-4xl mb-4 lowercase">
                    {isPaid ? 'Payment Confirmed!' : isProcessing ? 'Payment Processing' : 'Order Received'}
                </h1>
                <p className="text-gray-500 mb-2">
                    {isPaid 
                        ? 'Thank you for your payment. Your order is confirmed.' 
                        : isProcessing 
                        ? 'We have detected your payment and are waiting for blockchain confirmation.'
                        : 'Thank you for your order. We are awaiting payment confirmation.'}
                </p>
                <p className="text-sm font-bold tracking-widest uppercase mb-8">Order # {orderNumber}</p>

                <div className="bg-gray-50 p-8 rounded mb-8 text-left border border-gray-100">
                    <p className="text-sm text-gray-600 mb-4">
                        {isPaid 
                            ? 'We have received your payment and are getting your order ready to be shipped. We will notify you when it has been sent.'
                            : 'We will notify you once your payment is confirmed on the blockchain.'}
                    </p>
                    {order && (
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium">{order.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-500">Total</span>
                                <span className="font-medium">${order.total?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-medium uppercase ${
                                    isPaid ? 'text-green-600' : isProcessing ? 'text-yellow-600' : 'text-gray-600'
                                }`}>{order.orderStatus}</span>
                            </div>
                            {order.cryptoTransactionHash && (
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Transaction Hash</span>
                                    <span className="font-medium font-mono text-xs truncate max-w-[200px]">
                                        {order.cryptoTransactionHash}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/shop"
                        className="bg-black text-white py-4 px-8 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#C72f32] transition-all flex items-center justify-center gap-2"
                    >
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/account" className="text-[10px] uppercase tracking-[0.2em] hover:text-[#C72f32] transition-colors font-bold">
                        View Order Status
                    </Link>
                </div>
            </div>
        </div>
    );
}
