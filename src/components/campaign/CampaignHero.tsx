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
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-thin tracking-[0.15em] leading-[1.1] font-tt lowercase">
            every look is a <br />
            <span className="text-[#C72f32] font-bold tracking-[0.05em]">statement</span>
          </h1>
          <div className="flex justify-center pt-8">
            <img 
              src="/letsfly.png" 
              alt="Let's Fly" 
              className="h-20 md:h-28 object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
