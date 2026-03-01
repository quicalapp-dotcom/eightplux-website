'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignStageSectionProps {
  image: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CampaignStageSection({ 
  image, 
  buttonText = "EXPLORE", 
  buttonHref = "/shop" 
}: CampaignStageSectionProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <Image
        src={image}
        alt="Stage Section"
        fill
        className="object-cover brightness-50"
      />
      <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
        <h2 className="text-white text-3xl md:text-5xl lg:text-7xl font-light tracking-[0.2em] uppercase leading-tight mb-12 drop-shadow-xl">
          the <span className="text-[#FF0000] font-black italic">stage</span> is yours
        </h2>
        
        <Link 
          href={buttonHref}
          className="inline-block border border-white/50 text-white px-16 py-4 text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
