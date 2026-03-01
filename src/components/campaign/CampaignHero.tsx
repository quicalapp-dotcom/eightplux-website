'use client';

import React from 'react';
import Image from 'next/image';

interface CampaignHeroProps {
  image: string;
}

export default function CampaignHero({ image }: CampaignHeroProps) {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <Image
        src={image}
        alt="Campaign Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] uppercase leading-[1.1]">
            every look is a <br />
            <span className="text-[#FF0000] font-black tracking-[0.05em]">statement</span>
          </h1>
          <p className="pt-8 text-[#FF0000] text-3xl md:text-5xl font-serif italic tracking-widest lowercase opacity-90 drop-shadow-md">
            Let it Fly
          </p>
        </div>
      </div>
    </section>
  );
}
