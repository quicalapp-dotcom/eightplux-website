'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignInteractiveHeroProps {
  image: string;
}

export default function CampaignInteractiveHero({ image }: CampaignInteractiveHeroProps) {
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
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto px-4">
          <Link 
            href="/shop"
            className="bg-white text-black py-4 px-12 text-sm font-medium lowercase tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full shadow-lg"
          >
            shop XX
          </Link>
          <Link 
            href="/shop"
            className="bg-white text-black py-4 px-12 text-sm font-medium lowercase tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full shadow-lg"
          >
            shop XY
          </Link>
        </div>
      </div>
    </div>
  </section>
);
}