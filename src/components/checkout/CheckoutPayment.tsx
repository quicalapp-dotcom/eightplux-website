'use client';

import React from 'react';
import { Bitcoin, Loader2, CreditCard } from 'lucide-react';

import { useCurrencyStore } from '@/stores/currencyStore';
import PaystackButton from './PaystackButton';

interface CheckoutPaymentProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrentStep: (step: number) => void;
  handlePlaceOrder: () => void;
  handleCryptoConfirm: (txHash: string, coin: string) => void;
  handleNowPaymentsOrder: () => void;
  loading: boolean;
  total: number;
  currency: string;
  email: string;
  orderId: string;
}

export default function CheckoutPayment({
  formData,
  handleInputChange,
  setCurrentStep,
  handleNowPaymentsOrder,
  loading,
  total,
  email,
  orderId,
}: CheckoutPaymentProps) {
  const { formatPrice } = useCurrencyStore();
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-8">
        <h2 className="font-tt text-2xl lowercase">payment</h2>

        {/* Payment method selector */}
        <div className="space-y-3">
          <label
            className={`flex items-center justify-between p-6 border transition-all cursor-pointer ${
              formData.paymentMethod === 'crypto'
                ? 'border-black scale-[1.01] bg-gray-50/30'
                : 'border-gray-50 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="crypto"
                checked={formData.paymentMethod === 'crypto'}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">crypto (300+ coins)</span>
            </div>
            <Bitcoin className="w-4 h-4 text-[#f7931a]" />
          </label>

          <label
            className={`flex items-center justify-between p-6 border transition-all cursor-pointer ${
              formData.paymentMethod === 'paystack'
                ? 'border-black scale-[1.01] bg-gray-50/30'
                : 'border-gray-50 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="paystack"
                checked={formData.paymentMethod === 'paystack'}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">paystack (cards & transfers)</span>
            </div>
            <CreditCard className="w-4 h-4 text-[#003377]" />
          </label>
        </div>

        {/* Security note */}
        <div className="bg-gray-50 p-8 border border-gray-100/50">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed font-bold">
            all transactions are secured via NOWPayments. you will be redirected to their checkout to complete payment.
          </p>
        </div>
      </div>

      {/* NOWPayments panel */}
      {formData.paymentMethod === 'crypto' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-black text-white p-6 flex justify-between items-center">
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Amount due</p>
            <p className="font-black text-sm tracking-widest">{formatPrice(total)}</p>
          </div>
          
          <button
            type="button"
            onClick={handleNowPaymentsOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-green-700 transition-all disabled:opacity-40 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Invoice...</span>
              </>
            ) : (
              <>
                <span>Proceed to Crypto Payment</span>
              </>
            )}
          </button>
          
          <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
            You will be redirected to NOWPayments secure checkout
          </p>
        </div>
      )}

      {/* Paystack panel */}
      {formData.paymentMethod === 'paystack' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-black text-white p-6 flex justify-between items-center">
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Amount due</p>
            <p className="font-black text-sm tracking-widest">{formatPrice(total)}</p>
          </div>
          
          <PaystackButton
            email={email}
            amount={total}
            orderId={orderId}
          />
          
          <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
            You will be redirected to Paystack secure checkout
          </p>
        </div>
      )}

      {/* Return to shipping */}
      <button
        type="button"
        onClick={() => setCurrentStep(1)}
        className="text-[10px] uppercase text-gray-300 hover:text-black tracking-[0.3em] font-bold text-center py-2 transition-colors w-full"
      >
        return to shipping
      </button>
    </div>
  );
}
