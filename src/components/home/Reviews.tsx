'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    text: "I didn't realise how much comfort affected my day until I started wearing these pieces. Everything moves easily, sits well, and just feels right — like it was designed for real life, not just for photos.",
    author: 'Julius Nnamdi',
    flag: '🇳🇬',
    rating: 5,
  },
  {
    text: "The quality is unlike anything I've worn at this price point. I've washed it a dozen times and it still looks brand new. Eightplux really thought about longevity.",
    author: 'Amara Osei',
    flag: '🇬🇭',
    rating: 5,
  },
  {
    text: "Finally a brand that gets it. The fit is perfect, the fabric breathes well, and I get compliments every time I step out. This is my go-to now.",
    author: 'Tunde Adeyemi',
    flag: '🇳🇬',
    rating: 5,
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  const review = reviews[current];

  return (
    <section
      className="relative w-full py-24 px-6 md:px-16 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0d0d0d', minHeight: '340px' }}
    >
      {/* Decorative background stripes */}
      <div className="absolute inset-0 flex gap-[2px] opacity-10 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 bg-white/20" style={{ transform: 'skewX(-12deg)' }} />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-10 z-20 text-white/60 hover:text-white transition-colors"
        aria-label="Previous review"
      >
        <ChevronLeft size={32} strokeWidth={1.5} />
      </button>

      {/* Review Content */}
      <div className="max-w-3xl mx-auto text-center z-10 px-8">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-8">
          {Array.from({ length: review.rating }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-2xl">★</span>
          ))}
        </div>

        {/* Quote */}
        <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-10">
          {review.text}
        </p>

        {/* Author */}
        <p className="text-white/60 text-sm font-medium tracking-widest">
          {review.author} {review.flag}
        </p>
      </div>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-4 md:right-10 z-20 text-white/60 hover:text-white transition-colors"
        aria-label="Next review"
      >
        <ChevronRight size={32} strokeWidth={1.5} />
      </button>
    </section>
  );
}
