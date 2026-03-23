'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToStageSection } from '@/lib/firebase/homepage-sections';
import { StageSectionData } from '@/types';

interface StageSectionProps {
  image?: string; // Keep for backwards compatibility
}

// Default fallback data
const DEFAULT_IMAGE = '/definend.jpg';
const DEFAULT_TITLE = 'Define your statement';
const DEFAULT_BUTTON = { text: 'explore', href: '/shop' };

export default function StageSection({ image }: StageSectionProps) {
  const [stageData, setStageData] = useState<StageSectionData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStageSection((data) => {
      setStageData(data);
    });
    return () => unsubscribe();
  }, []);

  const mediaUrl = stageData?.mediaUrl || image || DEFAULT_IMAGE;
  const title = stageData?.title || DEFAULT_TITLE;
  
  const button = stageData?.buttonCollectionId
    ? { text: stageData.buttonText || DEFAULT_BUTTON.text, href: `/shop/collections/${stageData.buttonCollectionId}` }
    : { text: stageData?.buttonText || DEFAULT_BUTTON.text, href: '/shop' };

  // Parse title for styling (first word in red, rest normal)
  const titleParts = title.split(' ');
  const firstWord = titleParts[0] || '';
  const restOfTitle = titleParts.slice(1).join(' ');

  // Auto-detect if mediaUrl is a video
  const isVideoUrl = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(mediaUrl);

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
      {isVideoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block brightness-[0.5]"
          src={mediaUrl}
        />
      ) : (
        <img
          alt="Eightplux stage"
          className="w-full h-auto block brightness-[0.5]"
          src={mediaUrl}
        />
      )}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4 font-tt">
        <h2 className="text-white text-5xl md:text-8xl lg:text-[100px] font-thin tracking-tighter leading-[0.85] mb-12 flex flex-col items-center">
          <span className="flex items-center gap-2 md:gap-4">
            <span className="text-[#C72f32] font-black italic">{firstWord}</span>
            <span className="lowercase">{restOfTitle}</span>
          </span>
        </h2>

        <div className="flex justify-center">
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
