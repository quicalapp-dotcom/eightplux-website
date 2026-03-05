'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToSportSection } from '@/lib/firebase/homepage-sections';
import { SportSectionData } from '@/types';

interface SportSectionProps {
  image?: string; // Keep for backwards compatibility
}

// Default fallback data
const DEFAULT_IMAGE = '/sporttt.gif';
const DEFAULT_BADGE = 'Eightplux Sport';
const DEFAULT_TITLE = 'play beyond limit';
const DEFAULT_PRIMARY_BUTTON = { text: 'explore', href: '/shop' };
const DEFAULT_SECONDARY_BUTTON = { text: 'watch', href: '/shop' };

export default function SportSection({ image }: SportSectionProps) {
  const [sportData, setSportData] = useState<SportSectionData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSportSection((data) => {
      setSportData(data);
    });
    return () => unsubscribe();
  }, []);

  const mediaUrl = sportData?.mediaUrl || image || DEFAULT_IMAGE;
  const badgeText = sportData?.badgeText || DEFAULT_BADGE;
  const title = sportData?.title || DEFAULT_TITLE;
  
  const primaryButton = sportData?.primaryButtonCollectionId
    ? { text: sportData.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: `/shop/collections/${sportData.primaryButtonCollectionId}` }
    : { text: sportData?.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: '/shop' };
  
  const secondaryButton = sportData?.secondaryButtonCollectionId
    ? { text: sportData.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: `/shop/collections/${sportData.secondaryButtonCollectionId}` }
    : { text: sportData?.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: '/shop' };

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <img
        alt="Eightplux Sport collection"
        className="w-full h-auto block opacity-60"
        src={mediaUrl}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">
            {badgeText}
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-light text-white mb-10">
          {title}
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
