'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToStyleSection } from '@/lib/firebase/homepage-sections';
import { getCollectionSlugById } from '@/lib/firebase/collections';
import { StyleSectionData, StyleCard as StyleCardType } from '@/types';

interface StyleCard {
  src: string;
  label: string;
  collectionId?: string;
  mediaUrl?: string;
}

interface StyleCardWithSlug extends StyleCard {
  collectionSlug?: string | null;
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
  const [styleCards, setStyleCards] = useState<StyleCardWithSlug[]>([]);
  const [badgeText, setBadgeText] = useState<string>(DEFAULT_BADGE);
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);

  useEffect(() => {
    const unsubscribe = subscribeToStyleSection(async (data) => {
      if (data) {
        setBadgeText(data.badgeText || DEFAULT_BADGE);
        setTitle(data.title || DEFAULT_TITLE);

        const styleCards = data.cards?.filter(c => c.isActive)
          || cards
          || DEFAULT_CARDS.map((c) => ({ mediaUrl: c.src, label: c.label }));

        const cardsWithSlugPromises = styleCards.map(async (card: any) => {
          if (card.collectionId) {
            const slug = await getCollectionSlugById(card.collectionId);
            return { ...card, collectionSlug: slug };
          }
          return { ...card, collectionSlug: null };
        });

        const cardsWithSlug = await Promise.all(cardsWithSlugPromises);
        setStyleCards(cardsWithSlug);
      } else {
        setBadgeText(DEFAULT_BADGE);
        setTitle(DEFAULT_TITLE);
        setStyleCards(cards || DEFAULT_CARDS);
      }
    });
    return () => unsubscribe();
  }, [cards]);

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
            {title.split(' ').map((word, i) => (
              <span key={i} className={word.toLowerCase() === 'statement' ? 'text-[#C72f32]' : ''}>
                {word}{' '}
              </span>
            ))}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {styleCards.map((card: StyleCardWithSlug, index: number) => {
            const src = card.mediaUrl || card.src;
            const label = card.label;
            const collectionSlug = card.collectionSlug;

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

            return collectionSlug ? (
              <Link key={index} href={`/shop/collections/${collectionSlug}`} className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
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
