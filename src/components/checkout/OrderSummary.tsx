'use client';

import React from 'react';
import Image from 'next/image';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  formatPrice: (price: number) => string;
  currency: string;
  subtotal: number;
  shippingCostUSD: number;
  total: number;
}

export default function OrderSummary({
  items,
  formatPrice,
  currency,
  subtotal,
  shippingCostUSD,
  total,
}: OrderSummaryProps) {
  return (
    <div className="w-full lg:w-[400px] xl:w-[500px] bg-gray-50/30 px-6 py-10 lg:px-12 lg:py-20 animate-in fade-in duration-1000">
      <div className="sticky top-20">
        <h2 className="font-tt text-xl lowercase mb-12 border-b border-gray-100 pb-4 tracking-tight">your selection</h2>
        
        <div className="space-y-8 max-h-[45vh] overflow-y-auto pr-4 scrollbar-hide">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-6 group">
              <div className="relative w-24 h-32 bg-white border border-gray-100/50 overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-lg">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-black/80">{item.name}</h3>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">{item.size} / {item.color}</p>
                <p className="text-[10px] font-black mt-4 tracking-widest">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-12 border-t border-gray-200/50 space-y-5">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span>subtotal</span>
            <span className="text-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span>shipping</span>
            <span className="text-black font-tt tracking-normal lowercase">{shippingCostUSD === 0 ? 'free' : formatPrice(shippingCostUSD)}</span>
          </div>
          <div className="pt-8 border-t border-gray-200 mt-8 flex justify-between items-end">
            <span className="text-xs uppercase font-black tracking-[0.3em]">total</span>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 mr-2 uppercase font-bold tracking-widest">{currency}</span>
              <span className="text-4xl font-tt tracking-tighter leading-none">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border border-dashed border-gray-200 bg-white/50">
           <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed font-medium">
             orders are processed within 24-48 hours. delivery times vary by location. for support, contact hello@eightplux.com
           </p>
        </div>
      </div>
    </div>
  );
}
