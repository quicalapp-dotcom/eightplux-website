'use client';

import HeroImages from './HeroImages';

export default function HeroSection() {
  return (
    <section className="w-full pt-48 pb-0 flex flex-col items-center overflow-hidden" style={{ backgroundColor: '#d4d4d4' }}>
      {/* Headline */}
      <div className="w-full max-w-5xl mx-auto px-6 text-center">
        <h1
          className="font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', lineHeight: 1.08, color: '#0d0d0d' }}
        >
          EXPLORE CLOTHING THAT<br />
          ACTIVATES FREEDOM,<br />
          NOT JUST STYLE.
        </h1>
        <p className="mt-6 mb-10 text-sm md:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
          We create clothing for people choosing growth over fear, expression over conformity, and motion over waiting.
        </p>
      </div>

      {/* Animated 3-Column Image Grid */}
      <HeroImages />
    </section>
  );
}
