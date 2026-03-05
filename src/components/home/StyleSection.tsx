'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToStyleSection } from '@/lib/firebase/homepage-sections';
import { StyleSectionData, StyleCard as StyleCardType } from '@/types';

interface StyleCard {
  src: string;
  label: string;
  collectionId?: string;
}

interface StyleSectionProps {
  cards?: StyleCard[]; // Keep for backwards compatibility
}

// Default fallback data
const DEFAULT_BADGE = 'Eightplux Style';
const DEFAULT_TITLE = 'every look is a statement';
const DEFAULT_CARDS: StyleCard[] = [
    { src: '/tops.jpg', label: 'Jesus top' },
    { src: '/tg.jpg', label: 'Jesus top' },
    { src: '/tp.jpg', label: 'Crop top' },
    { src: '/wb.jpg', label: 'Tank top' },
];

export default function StyleSection({ cards }: StyleSectionProps) {
  const [styleData, setStyleData] = useState<StyleSectionData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStyleSection((data) => {
      setStyleData(data);
    });
    return () => unsubscribe();
  }, []);

  const badgeText = styleData?.badgeText || DEFAULT_BADGE;
  const title = styleData?.title || DEFAULT_TITLE;
  
  // Get style cards from Firestore or fallback to props or defaults
  const styleCards = styleData?.cards?.filter(c => c.isActive) 
    || cards 
    || DEFAULT_CARDS.map((c) => ({ mediaUrl: c.src, label: c.label }));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex flex-row justify-between items-center mb-16 border-b border-gray-200 pb-8 overflow-hidden">
          <div className="flex-shrink-0">
            <span className="bg-gray-100 text-gray-800 px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
              {badgeText}
            </span>
          </div>
          <h2 className="text-sm md:text-5xl lg:text-7xl font-light text-right text-black font-tt lowercase ml-4 leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {styleCards.map((card: any, index: number) => {
            const src = card.mediaUrl || card.src;
            const label = card.label;
            const collectionId = card.collectionId;

            const content = (
              <>
                <img
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={src}
                />
                <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
                  <span className="bg-white/20 backdrop-blur-md text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-white/20">
                    {label}
                  </span>
                </div>
              </>
            );

            return collectionId ? (
              <Link key={index} href={`/shop/collections/${collectionId}`} className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                {content}
              </Link>
            ) : (
              <div key={index} className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
