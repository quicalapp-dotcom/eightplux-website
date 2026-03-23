'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToWorldSection } from '@/lib/firebase/homepage-sections';
import { WorldSectionData } from '@/types';

interface WorldSectionProps {
  image?: string; // Keep for backwards compatibility
}

// Default fallback data
const DEFAULT_IMAGE = '/community.gif';
const DEFAULT_TITLE = 'the Stage is yours';
const DEFAULT_SUBTITLE = 'tag us to be featured in the collective';
const DEFAULT_BUTTON = { text: 'explore', href: '/shop' };

export default function WorldSection({ image }: WorldSectionProps) {
  const [worldData, setWorldData] = useState<WorldSectionData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToWorldSection((data) => {
      setWorldData(data);
    });
    return () => unsubscribe();
  }, []);

  const mediaUrl = worldData?.mediaUrl || image || DEFAULT_IMAGE;
  const title = worldData?.title || DEFAULT_TITLE;
  const subtitle = worldData?.subtitle || DEFAULT_SUBTITLE;
  
  const button = worldData?.buttonCollectionId
    ? { text: worldData.buttonText || DEFAULT_BUTTON.text, href: `/shop/collections/${worldData.buttonCollectionId}` }
    : { text: worldData?.buttonText || DEFAULT_BUTTON.text, href: '/shop' };

  // Auto-detect if mediaUrl is a video
  const isVideoUrl = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(mediaUrl);

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {isVideoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block opacity-50"
          src={mediaUrl}
        />
      ) : (
        <img
          alt="Eightplux World – the collective"
          className="w-full h-auto block opacity-50"
          src={mediaUrl}
        />
      )}
      <div className="absolute inset-0  flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto font-tt">
        <h2 className="text-white text-5xl md:text-8xl lg:text-[100px] font-thin tracking-tighter leading-[0.85] mb-4 flex flex-col items-center">
          <span className="flex items-center gap-2 md:gap-4">
            <span className="lowercase">the</span>
            <span className="text-[#C72f32] font-black italic">Stage</span>
          </span>
          <span className="lowercase">is yours</span>
        </h2>

        <p className="text-[10px] md:text-sm font-light text-white/80 mb-12 tracking-[0.2em] lowercase">
          {subtitle}
        </p>

        <div className="flex justify-center mt-4">
          <Link
            href={button.href}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-3 text-[11px] lowercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
          >
            {button.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
