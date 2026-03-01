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
        <h2 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-[0.3em] leading-tight drop-shadow-2xl mb-12">
          dress easy <br className="md:hidden" />
          live <span className="text-[#FF0000]">bold</span>
        </h2>
        
        {showButtons && (
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
        )}
      </div>
    </section>
  );
}
