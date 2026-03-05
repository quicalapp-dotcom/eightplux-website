'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutIdentificationProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleGuestCheckout: () => void;
  loginLoading: boolean;
  authError: string;
}

export default function CheckoutIdentification({
  formData,
  handleInputChange,
  handleLogin,
  handleGuestCheckout,
  loginLoading,
  authError,
}: CheckoutIdentificationProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-6">
        <h2 className="font-tt text-2xl lowercase">identification</h2>
        <p className="text-gray-500 text-xs font-light">sign in to your account for a faster checkout, or proceed as a guest.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <input 
              type="email" 
              name="email"
              placeholder="email address"
              className="w-full border-b border-gray-100 py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <input 
              type="password" 
              name="password"
              placeholder="password"
              className="w-full border-b border-gray-100 py-4 text-sm focus:border-black outline-none transition-colors bg-transparent"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {authError && <p className="text-[#C72f32] text-[10px] uppercase font-bold tracking-widest">{authError}</p>}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit"
              disabled={loginLoading}
              className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'sign in'}
            </button>
            <button 
              type="button"
              onClick={handleGuestCheckout}
              className="border border-gray-100 text-black px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black transition-colors"
            >
              guest checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
