'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToWorldHero } from '@/lib/firebase/world';
import { WorldHeroData } from '@/types';

interface WorldHeroProps {
  image?: string;
}

// Default fallback data
const DEFAULT_IMAGE = '/whero.jpg';

export default function WorldHero({ image }: WorldHeroProps) {
  const [worldHeroData, setWorldHeroData] = useState<WorldHeroData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToWorldHero((data) => {
      setWorldHeroData(data);
    });
    return () => unsubscribe();
  }, []);

  const mediaUrl = worldHeroData?.mediaUrl || image || DEFAULT_IMAGE;

  // Auto-detect if mediaUrl is a video
  const isVideoUrl = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(mediaUrl);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Container wraps the image to determine height naturally */}
      <div className="relative w-full">
        {isVideoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
            src={mediaUrl}
          />
        ) : (
          <img
            src={mediaUrl}
            alt="World of 8+ Hero"
            className="w-full h-auto block"
          />
        )}
      </div>

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