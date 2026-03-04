'use client';

import React from 'react';
import WorldHero from '@/components/world/WorldHero';
import WorldMosaic from '@/components/world/WorldMosaic';
import StageSection from '@/components/home/StageSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function WorldPage() {
  return (
    <main className="bg-white min-h-screen pt-16">
      {/* 1. Hero Section */}
      <WorldHero 
        image="/tww.jpg" 
      />

      {/* 2. Mosaic Grid Section */}
      <WorldMosaic />

      {/* 3. The Stage Is Yours Section */}
      <StageSection 
        image="/Model3.jpg"
      />

      {/* 4. Final Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}
