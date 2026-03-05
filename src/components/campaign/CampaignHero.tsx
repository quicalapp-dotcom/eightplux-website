'use client';

import React from 'react';
import Image from 'next/image';

interface CampaignHeroProps {
  image: string;
}

export default function CampaignHero({ image }: CampaignHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
      <div className="relative w-full">
        <Image
          src={image}
          alt="Campaign Hero"
          width={1920}
          height={1080}
          className="w-full h-auto block"
          priority
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-white text-3xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] font-tt lowercase flex flex-wrap justify-center gap-x-2">
              every look is a <span className="text-[#C72f32] font-medium">statement</span>
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
      </div>
    </section>
  );
}