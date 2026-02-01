'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export default function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
    const subtotal = getSubtotal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0F0F0F] z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-lg font-display uppercase tracking-widest">
                                Your Bag ({items.length})
                            </h2>
                            <button onClick={closeCart} className="hover:opacity-70">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="text-gray-500 mb-6">Your bag is empty</p>
                                    <Link
                                        href="/shop"
                                        onClick={closeCart}
                                        className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-xs uppercase tracking-widest font-bold"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                                            <div className="w-24 h-32 bg-gray-100 relative overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-display text-sm mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {item.size} / {item.color}
                                                </p>
                                                <p className="text-sm font-medium">${item.price.toLocaleString()}</p>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-200 dark:border-gray-700">
                                                        <button
                                                            onClick={() => updateQuantity(
                                                                item.productId,
                                                                item.size,
                                                                item.color,
                                                                item.quantity - 1
                                                            )}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-4 text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(
                                                                item.productId,
                                                                item.size,
                                                                item.color,
                                                                item.quantity + 1
                                                            )}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.productId, item.size, item.color)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm uppercase tracking-widest">Subtotal</span>
                                    <span className="text-lg font-display">${subtotal.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center mb-4">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full bg-black text-white dark:bg-white dark:text-black py-4 text-center text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                                >
                                    Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
