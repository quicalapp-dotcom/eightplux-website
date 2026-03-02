'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function CartNotification() {
    const { isNotificationOpen, lastAddedItem, hideNotification } = useCartStore();

    useEffect(() => {
        if (isNotificationOpen) {
            const timer = setTimeout(() => {
                hideNotification();
            }, 5000); // Auto hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isNotificationOpen, hideNotification]);

    return (
        <AnimatePresence>
            {isNotificationOpen && lastAddedItem && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 pointer-events-none"
                >
                    <div className="bg-[#e6fcf5] border border-[#c3fae8] px-6 py-4 shadow-xl flex items-center justify-between gap-4 pointer-events-auto min-w-[320px] md:min-w-[450px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#20c997] p-1">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-[#0ca678]">
                                You added product <span className="underline italic">_{lastAddedItem.name}_</span> to your shopping Bag
                            </span>
                        </div>
                        <button 
                            onClick={hideNotification}
                            className="text-[#0ca678] hover:text-[#087f5b] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
