'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { 
    name: 'Skirts', 
    count: 100, 
    imageUrl: '/skirt.jpg', 
    linkUrl: '/shop?category=skirts' 
  },
  { 
    name: 'Hats', 
    count: 100, 
    imageUrl: '/hats.jpg', 
    linkUrl: '/shop?category=headwear',
    objectPosition: 'center 10%'
  },
  { 
    name: 'Shoes', 
    count: 100, 
    imageUrl: '/lb.jpg', 
    linkUrl: '/shop?category=shoes' 
  },
  { 
    name: 'Tees', 
    count: 100, 
    imageUrl: '/tees.jpg', 
    linkUrl: '/shop?category=tees' 
  },
  
  { 
    name: 'Tops', 
    count: 100, 
    imageUrl: '/tops.jpg', 
    linkUrl: '/shop?category=tops',
    objectPosition: 'center top'
  },
];

export default function ShopByPalette() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden" style={{ backgroundColor: '#d4d4d4' }}>
      {/* Decorative background stripes */}
      <div className="absolute inset-0 flex gap-[2px] opacity-10 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 bg-black/30" style={{ transform: 'skewX(-12deg)' }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight" style={{ color: '#0d0d0d' }}>
          CLOTHING DESIGNED FOR YOU
        </h2>
        <p className="max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed" style={{ color: '#4d4d4d' }}>
          Every piece is created to support the way you live day to day;<br className="hidden md:block" />
          comfortable, intentional, and easy to move in, wherever your routine takes you.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 md:left-8 z-20 -translate-y-1/2 hidden md:block">
        <button 
          onClick={() => scroll('left')}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-8 z-20 -translate-y-1/2 hidden md:block">
        <button 
          onClick={() => scroll('right')}
          className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm"
        >
          <ChevronRight size={32} strokeWidth={1.5} />
        </button>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-12 no-scrollbar px-4 md:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <Link 
            key={index} 
            href={category.linkUrl} 
            className="flex-none w-[280px] md:w-[320px] group relative snap-start"
          >
            <div className="aspect-square overflow-hidden bg-[#e5e5e5] relative">
              <Image 
                src={category.imageUrl} 
                alt={category.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: (category as { objectPosition?: string }).objectPosition || 'center' }}
              />
              {/* Bottom Label */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-[#0d0d0d] text-white px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                  SHOP {category.name} ({category.count})
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Button */}
      <div className="mt-12 text-center">
        <Link 
          href="/shop" 
          className="inline-block border-2 border-[#0d0d0d] px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#0d0d0d] hover:text-white transition-all duration-300"
        >
          SEE ALL PRODUCTS
        </Link>
      </div>
    </section>
  );
}
