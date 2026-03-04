'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface WorldHeroProps {
  image: string;
}

export default function WorldHero({ image }: WorldHeroProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      {/* Image fills the full section — no grey sides, no cropping weirdness */}
      <Image
        src={image}
        alt="World of 8+ Hero"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Dark overlay + text at the bottom */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 md:pb-12 text-center px-4 bg-black/10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-white/70 mb-3 font-metropolis">
          <Link href="/" className="hover:text-white transition-colors">
            Homepage
          </Link>
          <span>/</span>
          <span className="text-white/90">The World Of Eightplux</span>
        </nav>

        {/* Bold Header */}
        <h1 className="text-white text-[28px] md:text-[48px] font-bold tracking-[0.1em] leading-[1.2] uppercase drop-shadow-md font-tt">
          ARTISTIC/DOPE/CULTURED
        </h1>
      </div>
    </section>
  );
}