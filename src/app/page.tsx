'use client';

import { useEffect } from 'react';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import SportSection   from '@/components/home/SportSection';
import CasualSection  from '@/components/home/CasualSection';
import StyleSection   from '@/components/home/StyleSection';
import WorldSection   from '@/components/home/WorldSection';
import StageSection   from '@/components/home/StageSection';
import NewsletterSection from '@/components/home/NewsletterSection';

// ─── Images from /public ───────────────────────────────────────────────────
// TODO: swap any value here with an admin-uploaded URL when ready.
const IMAGES = {
  heroSlides: [
    { src: '/Model1.jpg' },
    { src: '/Model2.jpg' },
    { src: '/Model3.jpg' }
  ],
  sport:  '/tees.jpg',
  casual: '/lt.jpg',
  style: [
    { src: '/tops.jpg', label: 'Jesus top' },
    { src: '/tg.jpg',   label: 'Jesus top' },
    { src: '/tp.jpg',   label: 'Crop top'  },
    { src: '/wb.jpg',   label: 'Tank top'  },
  ],
  world: '/tww.jpg',
  stage: '/middle.jpg',
};

export default function HomePage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #1a1a1a; }
      ::-webkit-scrollbar-thumb { background: #333; }
      ::-webkit-scrollbar-thumb:hover { background: #FF0000; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans antialiased selection:bg-[#FF0000] selection:text-white">
      <HeroSlideshow slides={IMAGES.heroSlides} />
      <SportSection  image={IMAGES.sport} />
      <CasualSection image={IMAGES.casual} />
      <StyleSection  cards={IMAGES.style} />
      <WorldSection  image={IMAGES.world} />
      <StageSection  image={IMAGES.stage} />
      <NewsletterSection />
    </main>
  );
}