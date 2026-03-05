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
    <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
      <div className="relative w-full">
        <Image
          src={image}
          alt="Banner"
          width={1920}
          height={1080}
          className="w-full h-auto block brightness-75"
          priority
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-5xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] font-tt lowercase">
            dress easy live <span className="text-[#C72f32] font-medium">bold</span>
          </h1>
        
        {showButtons && (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto px-4">
            <Link 
              href="/shop"
              className="bg-white text-black py-4 px-12 text-sm font-medium  tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full"
            >
              Shop XX
            </Link>
            <Link 
              href="/shop"
              className="bg-white text-black py-4 px-12 text-sm font-medium tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full"
            >
              Shop XY
            </Link>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}