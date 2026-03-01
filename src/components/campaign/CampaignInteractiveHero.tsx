'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignInteractiveHeroProps {
  image: string;
}

export default function CampaignInteractiveHero({ image }: CampaignInteractiveHeroProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <Image
        src={image}
        alt="Interactive Hero"
        fill
        className="object-cover brightness-90"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/5">
        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] uppercase mb-16 drop-shadow-lg">
          play <span className="text-[#FF0000] font-black italic">beyond</span> limit
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg px-4">
          <Link 
            href="/shop?category=men"
            className="flex-1 bg-white text-black py-4 px-8 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-300 text-center shadow-xl"
          >
            SHOP MEN
          </Link>
          <Link 
            href="/shop?category=women"
            className="flex-1 bg-white text-black py-4 px-8 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-300 text-center shadow-xl"
          >
            SHOP WOMEN
          </Link>
        </div>
      </div>
    </section>
  );
}
