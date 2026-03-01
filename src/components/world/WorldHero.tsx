'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface WorldHeroProps {
  image: string;
}

export default function WorldHero({ image }: WorldHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* 1. Main visual with breadcrumbs and text overlay */}
      <div className="relative h-[85vh] w-full">
        <Image
          src={image}
          alt="World of 8+ Hero"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 md:pb-40 text-center px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Homepage</Link>
            <span>/</span>
            <span className="text-white">The World Of Eightplux</span>
          </nav>

          {/* Bold Header */}
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.3em] uppercase drop-shadow-2xl">
            ARTISTIC/DOPE/CULTURED
          </h1>
        </div>
      </div>
    </section>
  );
}
