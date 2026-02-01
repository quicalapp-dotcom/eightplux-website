'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        // Generate random order number
        setOrderNumber(`8P-${Math.floor(Math.random() * 1000000)}`);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-black dark:text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="font-display text-4xl mb-4">Order Confirmed</h1>
                <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
                <p className="text-sm font-bold tracking-widest uppercase mb-8">Order # {orderNumber}</p>

                <div className="bg-gray-50 dark:bg-[#141414] p-8 rounded mb-8 text-left border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        We have received your order and are getting it ready to be shipped. We will notify you when it has been sent.
                    </p>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="text-gray-500">Estimated Delivery</span>
                            <span className="font-medium">3-7 Business Days</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/shop"
                        className="bg-black dark:bg-white text-white dark:text-black py-4 px-8 uppercase text-xs font-bold tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/account" className="text-xs uppercase tracking-widest hover:text-red-600 transition-colors">
                        View Order Status
                    </Link>
                </div>
            </div>
        </div>
    );
}
