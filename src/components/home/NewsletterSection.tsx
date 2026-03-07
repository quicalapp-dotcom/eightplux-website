'use client';

import React, { useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setDiscountCode(data.discountCode);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#1C1C1C] text-white py-24 px-6 md:px-20 lg:px-32 font-metropolis">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16">
        {/* Left Side: Content */}
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Join Our Community
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
            Get 10% off your first order and be the first to get the latest updates on our promotion campaigns, products and services.
          </p>
        </div>

        {/* Right Side: Input */}
        <div className="w-full lg:w-[40%] flex-grow max-w-lg">
          {success ? (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 text-green-400">
                <Check className="w-6 h-6" />
                <span className="font-bold uppercase tracking-widest text-sm">You're In!</span>
              </div>
              <p className="text-gray-300 text-sm">
                Welcome to Eightplux! Here's your exclusive discount code:
              </p>
              <div className="bg-white/10 border border-dashed border-green-500 p-4 text-center">
                <p className="text-green-400 text-xs uppercase tracking-widest mb-1">Your 10% Off Code</p>
                <p className="text-2xl font-bold tracking-[0.2em] text-white">{discountCode}</p>
              </div>
              <p className="text-gray-400 text-xs">
                Check your email for the code. Valid for 30 days on your first order.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex items-end w-full group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email Address"
                disabled={loading}
                className="w-full bg-transparent border-b border-gray-600 py-4 text-base md:text-lg focus:outline-none focus:border-white transition-all duration-300 placeholder:text-gray-500 pb-3 pr-20 font-light disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-0 bottom-3 text-base md:text-lg font-bold uppercase tracking-[0.2em] hover:text-[#C72f32] transition-colors pb-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
              </button>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
