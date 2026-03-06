'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCasualSection } from '@/lib/firebase/homepage-sections';
import { CasualSectionData } from '@/types';

interface CasualSectionProps {
  image?: string; // Keep for backwards compatibility
}

// Default fallback data
const DEFAULT_IMAGE = '/casualbg.gif';
const DEFAULT_BADGE = 'Eightplux Casual';
const DEFAULT_TITLE = 'dress easy, live bold';
const DEFAULT_PRIMARY_BUTTON = { text: 'explore', href: '/shop' };
const DEFAULT_SECONDARY_BUTTON = { text: 'watch', href: '/shop' };

export default function CasualSection({ image }: CasualSectionProps) {
  const [casualData, setCasualData] = useState<CasualSectionData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCasualSection((data) => {
      setCasualData(data);
    });
    return () => unsubscribe();
  }, []);

  const mediaUrl = casualData?.mediaUrl || image || DEFAULT_IMAGE;
  const badgeText = casualData?.badgeText || DEFAULT_BADGE;
  const title = casualData?.title || DEFAULT_TITLE;
  
  const primaryButton = casualData?.primaryButtonCollectionId
    ? { text: casualData.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: `/shop/collections/${casualData.primaryButtonCollectionId}` }
    : { text: casualData?.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: '/shop' };
  
  const secondaryButton = casualData?.secondaryButtonCollectionId
    ? { text: casualData.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: `/shop/collections/${casualData.secondaryButtonCollectionId}` }
    : { text: casualData?.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: '/shop' };

  return (
    <section className="relative w-full overflow-hidden bg-[#4A2C2A]">
      <img
        alt="Eightplux Casual collection"
        className="w-full h-auto block opacity-70"
        src={mediaUrl}
      />
      <div className="absolute inset-0 z-[1] opacity-40 mix-blend-multiply bg-amber-900" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">
            {badgeText}
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-light text-white mb-10 font-tt">
          {title.split(' ').map((word, i) => (
            <span key={i}>
              {word.toLowerCase() === 'bold' ? (
                <span className="text-[#C72f32] font-bold">{word} </span>
              ) : (
                <span>{word} </span>
              )}
            </span>
          ))}
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href={primaryButton.href}
            className="bg-white text-black px-10 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-40"
          >
            {primaryButton.text}
          </Link>
          <Link
            href={secondaryButton.href}
            className="bg-white text-black px-10 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-40"
          >
            {secondaryButton.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
