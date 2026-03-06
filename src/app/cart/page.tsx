'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
    const { formatPrice } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();

    const sections = (
        <>
            <WorldSection image="/community.gif" />
            <NewsletterSection />
        </>
    );

    if (items.length === 0) {
        return (
            <>
                <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
                    <h1 className="text-2xl font-display uppercase tracking-[0.3em] mb-8">Shopping Cart</h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-12">Your bag is currently empty.</p>
                    <Link 
                        href="/shop"
                        className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
                {sections}
            </>
        );
    }

    return (
        <>
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto selection:bg-black selection:text-white">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-10 justify-center">
                <Link href="/" className="hover:text-black lowercase transition-colors">homepage</Link>
                <span className="text-gray-400">/</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.5em] text-center mb-16 md:mb-32 mt-4 text-black">Order Summary</h1>

            {/* Desktop View (md and up) */}
            <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[950px] px-8">
                    {/* Cart Table Header */}
                    <div className="flex items-center pb-8 text-[9px] uppercase font-bold tracking-[0.4em] text-gray-500 border-b border-gray-100 mb-2">
                        <div className="flex-[4] pl-4">Product</div>
                        <div className="flex-[1] text-center">Colour</div>
                        <div className="flex-[1] text-center">Size</div>
                        <div className="flex-[1] text-center">Units</div>
                        <div className="flex-[1.5] text-right pr-6">Amount</div>
                    </div>

                    {/* Cart Items */}
                    <div className="mb-32">
                        {items.map((item) => (
                            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center py-12 border-b border-gray-50 last:border-0 group transition-all duration-300">
                                {/* Product Info */}
                                <div className="flex-[4] flex gap-12 items-center pl-4">
                                    <div className="relative w-36 h-52 bg-gray-50 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[240px] text-black">
                                            {item.name}
                                        </h3>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                                            REF. {Math.floor(Math.random() * 90000) + 10000}
                                        </p>
                                    </div>
                                </div>

                                {/* Colour */}
                                <div className="flex-[1] text-center text-[10px] uppercase font-bold tracking-[0.15em] text-[#222]">
                                    {item.color}
                                </div>

                                {/* Size */}
                                <div className="flex-[1] text-center text-[10px] uppercase font-bold tracking-[0.15em] text-[#222]">
                                    {item.size}
                                </div>

                                    {/* Units (Quantity) */}
                                <div className="flex-[1] text-center flex items-center justify-center gap-6">
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                        className="text-gray-300 hover:text-black transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#222] min-w-[20px]">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                        className="text-gray-300 hover:text-black transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Amount */}
                                <div className="flex-[1.5] text-right pr-6 flex items-center justify-end gap-10">
                                    <div className="flex flex-col items-end">
                                        {item.price === 20 && item.name.toLowerCase().includes('shirt') ? (
                                            <>
                                                <span className="text-[10px] text-gray-400 line-through tracking-[0.15em] mb-1">{formatPrice(20)}</span>
                                                <span className="text-[11px] font-bold tracking-[0.15em] text-black">{formatPrice(16)}</span>
                                            </>
                                        ) : (
                                            <span className="text-[11px] font-bold tracking-[0.15em] text-black">{formatPrice(item.price * item.quantity)}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.productId, item.size, item.color)}
                                        className="text-gray-200 hover:text-black transition-colors p-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile View (sm and below) */}
            <div className="md:hidden space-y-12 mb-20 px-2">
                {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="space-y-8 pb-12 border-b border-gray-100 last:border-0">
                        {/* Product Basic Info */}
                        <div className="flex gap-8 items-start">
                            <div className="relative w-28 h-40 bg-gray-50 overflow-hidden flex-shrink-0 shadow-sm">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-4 pt-2">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed text-black">
                                    {item.name}
                                </h3>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                                    REF. {Math.floor(Math.random() * 90000) + 10000}
                                </p>
                                <button 
                                    onClick={() => removeItem(item.productId, item.size, item.color)}
                                    className="text-[10px] uppercase font-bold tracking-widest text-[#C72f32] mt-4"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-6 pt-2 border-t border-gray-50">
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-2">Colour</p>
                                <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#222]">{item.color}</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-2">Size</p>
                                <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#222]">{item.size}</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-2">Units</p>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                        className="text-gray-300 hover:text-black transition-colors"
                                    >
                                        <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#222] min-w-[20px] text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                        className="text-gray-300 hover:text-black transition-colors"
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-2">Amount</p>
                                <div className="flex flex-col items-end">
                                    {item.price === 20 && item.name.toLowerCase().includes('shirt') ? (
                                        <>
                                            <span className="text-[10px] text-gray-400 line-through tracking-[0.15em] mb-1">{formatPrice(20)}</span>
                                            <span className="text-[11px] font-bold tracking-[0.15em] text-black">{formatPrice(16)}</span>
                                        </>
                                    ) : (
                                        <span className="text-[11px] font-bold tracking-[0.15em] text-black">{formatPrice(item.price * item.quantity)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Footer */}
            <div className="flex flex-col items-center space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-[0.3em]">
                        Total: {formatPrice(subtotal)}
                    </h2>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <Link 
                        href="/checkout"
                        className="bg-[#333] text-white w-full py-4 text-[10px] uppercase font-bold tracking-[0.3em] flex justify-center items-center gap-4 hover:bg-black transition-all group"
                    >
                        Checkout now
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="text-center">
                        <h3 className="text-2xl font-bold uppercase tracking-[0.3em]">ORDER: #WJAON45</h3>
                    </div>
                </div>
            </div>
        </div>
        {sections}
        </>
    );
}
