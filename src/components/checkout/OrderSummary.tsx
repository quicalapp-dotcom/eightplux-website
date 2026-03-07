'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, X, Loader2, Tag } from 'lucide-react';

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
  onDiscountChange?: (discountData: {
    code: string;
    discountAmount: number;
    finalTotal: number;
    discountId: string;
  } | null) => void;
  userEmail?: string;
}

export default function OrderSummary({
  items,
  formatPrice,
  currency,
  subtotal,
  shippingCostUSD,
  total,
  onDiscountChange,
  userEmail,
}: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discountAmount: number;
    finalTotal: number;
    discountId: string;
    description?: string;
  } | null>(null);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          email: userEmail || '',
          total: subtotal + shippingCostUSD,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply discount');
      }

      setAppliedDiscount({
        code: data.code,
        discountAmount: data.discountAmount,
        finalTotal: data.finalTotal,
        discountId: data.discountId,
        description: data.description,
      });

      onDiscountChange?.({
        code: data.code,
        discountAmount: data.discountAmount,
        finalTotal: data.finalTotal,
        discountId: data.discountId,
      });

      setDiscountCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid discount code');
      setAppliedDiscount(null);
      onDiscountChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setError('');
    onDiscountChange?.(null);
  };

  const displayTotal = appliedDiscount ? appliedDiscount.finalTotal : total;
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0;

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

          {/* Discount Code Input */}
          <div className="pt-4 border-t border-gray-200/50">
            {appliedDiscount ? (
              <div className="bg-green-50 border border-green-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-green-700">
                      {appliedDiscount.code}
                    </p>
                    <p className="text-[8px] text-green-600 mt-0.5">
                      -{formatPrice(discountAmount)} applied
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveDiscount}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyDiscount} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setError('');
                      }}
                      placeholder="DISCOUNT CODE"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 text-[9px] uppercase tracking-widest font-bold border border-gray-200 focus:border-black focus:outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !discountCode}
                    className="px-4 py-2 bg-black text-white text-[9px] uppercase tracking-widest font-bold hover:bg-[#C72f32] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {error && (
                  <p className="text-[8px] uppercase tracking-wider text-red-600 font-bold flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Discount Line Item */}
          {appliedDiscount && (
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-green-600 font-bold">
              <span>discount ({appliedDiscount.code})</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div className="pt-8 border-t border-gray-200 mt-8 flex justify-between items-end">
            <span className="text-xs uppercase font-black tracking-[0.3em]">total</span>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 mr-2 uppercase font-bold tracking-widest">{currency}</span>
              <span className="text-4xl font-tt tracking-tighter leading-none">{formatPrice(displayTotal)}</span>
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
