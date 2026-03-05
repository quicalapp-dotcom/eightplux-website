'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignInteractiveHeroProps {
  image: string;
   buttonText?: string;
  buttonHref?: string;
}

export default function CampaignInteractiveHero({ image,
  buttonText = "EXPLORE", 
  buttonHref = "/shop" 
 }: CampaignInteractiveHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
      <div className="relative w-full">
        <Image
          src={image}
          alt="Interactive Hero"
          width={1920}
          height={1080}
          className="w-full h-auto block brightness-90"
          priority
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 bg-black/5">
        <h2 className="text-white text-5xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] mb-16 font-tt lowercase">
          play <span className="text-[#C72f32] font-medium">beyond</span> limit
        </h2>
        <div className="flex justify-center w-full max-w-xs sm:max-w-none mx-auto px-4">
          <Link 
            href={buttonHref}
            className="inline-block border border-white/50 text-white px-16 py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  </section>
);
}
