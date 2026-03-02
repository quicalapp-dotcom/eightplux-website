'use client';

import React from 'react';

export default function NewsletterSection() {
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
          <form className="relative flex items-end w-full group">
            <input
              type="email"
              placeholder="Enter your Email Address"
              className="w-full bg-transparent border-b border-gray-600 py-4 text-base md:text-lg focus:outline-none focus:border-white transition-all duration-300 placeholder:text-gray-500 pb-3 pr-20 font-light"
              required
            />
            <button
              type="submit"
              className="absolute right-0 bottom-3 text-base md:text-lg font-bold uppercase tracking-[0.2em] hover:text-[#C72f32] transition-colors pb-1"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
