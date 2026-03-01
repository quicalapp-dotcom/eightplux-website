'use client';

import { useState, useEffect, useCallback } from 'react';

const SLIDE_INTERVAL_MS = 10_000;

interface Slide {
  src: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center pt-[60px]">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            alt={`Hero slide ${i + 1}`}
            className="w-full h-full object-cover object-top brightness-[0.7]"
            src={slide.src}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto mt-32">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-light text-white leading-tight tracking-tight mb-8">
          yOu've been <span className="text-[#FF0000] font-bold">grounded</span><br />
          long enough
        </h1>
        <div className="relative mb-16">
          <h2 className="font-[Dancing_Script] text-6xl md:text-8xl text-[#FF0000] transform -rotate-6 opacity-90 inline-block drop-shadow-lg">
            Let it Fly
          </h2>
        </div>
        <button className="bg-white text-black px-14 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 min-w-[180px]">
          Shop Now
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 h-[5px] ${
              i === current
                ? 'w-6 bg-white'
                : 'w-4 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
