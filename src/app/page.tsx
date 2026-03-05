'use client';

import { useEffect } from 'react';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import SportSection   from '@/components/home/SportSection';
import CasualSection  from '@/components/home/CasualSection';
import StyleSection   from '@/components/home/StyleSection';
import WorldSection   from '@/components/home/WorldSection';
import StageSection   from '@/components/home/StageSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #1a1a1a; }
      ::-webkit-scrollbar-thumb { background: #333; }
      ::-webkit-scrollbar-thumb:hover { background: #C72f32; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans antialiased selection:bg-[#C72f32] selection:text-white">
      <HeroSlideshow />
      <SportSection />
      <CasualSection />
      <StyleSection />
      <WorldSection />
      <StageSection />
      <NewsletterSection />
    </main>
  );
}