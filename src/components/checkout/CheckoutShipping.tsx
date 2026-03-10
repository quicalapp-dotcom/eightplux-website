'use client';

import React from 'react';

interface CheckoutShippingProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setCurrentStep: (step: number) => void;
  formatPrice: (price: number) => string;
  handleNextStep: (e: React.FormEvent) => void;
}

export default function CheckoutShipping({
  formData,
  handleInputChange,
  setCurrentStep,
  formatPrice,
  handleNextStep,
}: CheckoutShippingProps) {
  return (
    <form onSubmit={handleNextStep} className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-8">
        <div className="flex justify-between items-baseline">
          <h2 className="font-tt text-2xl lowercase">shipping</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <input 
            type="text" name="firstName" placeholder="first name" required
            className="w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.firstName} onChange={handleInputChange}
          />
          <input 
            type="text" name="lastName" placeholder="last name" required
            className="w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.lastName} onChange={handleInputChange}
          />
          <input 
            type="text" name="address" placeholder="address" required
            className="col-span-2 w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.address} onChange={handleInputChange}
          />
          <input 
            type="text" name="city" placeholder="city" required
            className="w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.city} onChange={handleInputChange}
          />
          <input 
            type="text" name="postalCode" placeholder="postal code" required
            className="w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.postalCode} onChange={handleInputChange}
          />
          <select 
            name="country" className="col-span-2 border-b border-gray-100 py-4 text-sm outline-none bg-white font-light"
            value={formData.country} onChange={handleInputChange}
          >
            <option value="Nigeria">Nigeria</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
          <input 
            type="tel" name="phone" placeholder="phone (optional)"
            className="col-span-2 w-full border-b border-gray-100 py-3 text-sm focus:border-black outline-none transition-colors bg-white font-light"
            value={formData.phone} onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">shipping method</h3>
        <div className="space-y-3">
          <label className={`flex items-center justify-between p-5 border transition-all cursor-pointer ${formData.shippingMethod === 'standard' ? 'border-black' : 'border-gray-50 opacity-40 hover:opacity-100'}`}>
            <div className="flex items-center gap-4">
              <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={handleInputChange}/>
              <span className="text-[10px] uppercase tracking-[0.1em] font-bold">standard shipping</span>
            </div>

          </label>
        </div>
      </div>

      <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-colors">
        continue to payment
      </button>
    </form>
  );
}
