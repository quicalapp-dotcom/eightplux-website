'use client';

import React from 'react';
import { Bitcoin, Loader2 } from 'lucide-react';
import CryptoPaymentPanel from './CryptoPaymentPanel';

interface CheckoutPaymentProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrentStep: (step: number) => void;
  handlePlaceOrder: () => void;
  handleCryptoConfirm: (txHash: string, coin: string) => void;
  loading: boolean;
  total: number;
  currency: string;
}

export default function CheckoutPayment({
  formData,
  handleInputChange,
  setCurrentStep,
  handlePlaceOrder,
  handleCryptoConfirm,
  loading,
  total,
  currency,
}: CheckoutPaymentProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-8">
        <h2 className="font-tt text-2xl lowercase">payment</h2>

        {/* Payment method selector — Paystack commented out */}
        <div className="space-y-3">
          {[
            // { id: 'paystack_card', label: 'credit / debit card (coming soon)', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'crypto', label: 'crypto (usdt / btc / eth)', icon: <Bitcoin className="w-4 h-4 text-[#f7931a]" /> },
          ].map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-6 border transition-all cursor-pointer ${
                formData.paymentMethod === method.id
                  ? 'border-black scale-[1.01] bg-gray-50/30'
                  : 'border-gray-50 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{method.label}</span>
              </div>
              {method.icon}
            </label>
          ))}
        </div>

        {/* Security note */}
        <div className="bg-gray-50 p-8 border border-gray-100/50">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed font-bold">
            all transactions are verified on-chain. send the exact amount to the provided address and share your transaction hash.
          </p>
        </div>
      </div>

      {/* Crypto panel renders inline when crypto is selected */}
      {formData.paymentMethod === 'crypto' && (
        <CryptoPaymentPanel
          total={total}
          currency={currency}
          onConfirm={handleCryptoConfirm}
          loading={loading}
        />
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
