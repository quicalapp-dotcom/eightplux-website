'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignBannerProps {
  image: string;
  showButtons?: boolean;
}

export default function CampaignBanner({ image, showButtons }: CampaignBannerProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <Image
        src={image}
        alt="Banner"
        fill
        className="object-cover brightness-75"
      />
      <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] uppercase leading-[1.1] font-tt">
            every look is a <br />
            <span className="text-[#C72f32] font-black tracking-[0.05em]">statement</span>
          </h1>
        
        {showButtons && (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto px-4">
            <Link 
              href="/shop?category=men"
              className="bg-white text-black py-4 px-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-300 text-center shadow-xl w-full"
            >
              SHOP MEN
            </Link>
            <Link 
              href="/shop?category=women"
              className="bg-white text-black py-4 px-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-300 text-center shadow-xl w-full"
            >
              SHOP WOMEN
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
