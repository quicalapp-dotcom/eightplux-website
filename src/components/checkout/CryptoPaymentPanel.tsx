'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import PayCryptoButton from './PayCryptoButton';

interface CryptoPaymentPanelProps {
  total: number;
  currency: string;
  onConfirm: (txHash: string, coin: string) => void;
  loading: boolean;
}

export default function CryptoPaymentPanel({ total, currency, onConfirm, loading }: CryptoPaymentPanelProps) {
  const [error, setError] = useState('');

  const handleSuccess = (paymentId: string, orderId: string) => {
    console.log('Payment initiated:', { paymentId, orderId });
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Secure payment info */}
      <div className="flex flex-col items-center gap-4 p-6 border border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-2 text-green-600">
          <Shield className="w-5 h-5" />
          <p className="text-[9px] uppercase font-bold tracking-widest">Secured by NOWPayments</p>
        </div>
        
        <div className="w-full bg-black text-white p-4 flex justify-between items-center">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Amount due</p>
          <p className="font-black text-sm tracking-widest">{currency === 'NGN' ? '₦' : '$'}{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2 border-l-2 border-gray-100 pl-4">
        <p className="text-[10px] uppercase font-black tracking-widest text-gray-700">How it works</p>
        <ol className="space-y-1.5">
          {[
            'Click "Pay with Crypto" to generate invoice',
            'Choose from 300+ cryptocurrencies (BTC, ETH, USDT, etc.)',
            'Complete payment on secure NOWPayments checkout',
            'We will receive instant confirmation via webhook',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-[9px] uppercase tracking-wider text-gray-500 font-bold leading-relaxed">
              <span className="flex-shrink-0 w-4 h-4 border border-gray-200 rounded-full flex items-center justify-center text-[8px] font-black mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[9px] uppercase font-bold tracking-wider text-red-600">{error}</p>
        </div>
      )}

      {/* NOWPayments Button */}
      <PayCryptoButton
        amount={total}
        currency="usd"
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
        You will be redirected to NOWPayments secure checkout
      </p>
    </div>
  );
}
