'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignBannerProps {
  image: string;
  showButtons?: boolean;
  buttonText?: string;
  buttonHref?: string;
}

export default function CampaignBanner({ image, showButtons,
  buttonText = "EXPLORE", 
  buttonHref = "/shop" 
 }: CampaignBannerProps) {
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
          <h1 className="text-white text-5xl md:text-[96px] font-normal mb-16 tracking-[-0.05em] leading-[1.22] font-tt lowercase">
            dress easy live <span className="text-[#C72f32] font-medium">bold</span>
          </h1>
        
        {showButtons && (
          <div className="flex justify-center w-full max-w-xs sm:max-w-none mx-auto px-4">
          <Link 
            href={buttonHref}
            className="inline-block border border-white/50 text-white px-16 py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center"
          >
            {buttonText}
          </Link>
        </div>
        )}
      </div>
      </div>
    </section>
  );
}
