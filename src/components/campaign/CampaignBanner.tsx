'use client';

import React from 'react';
import Image from 'next/image';

interface CampaignBannerProps {
  image: string;
}

export default function CampaignBanner({ image }: CampaignBannerProps) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
      <Image
        src={image}
        alt="Banner"
        fill
        className="object-cover brightness-75"
      />
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-[0.3em] leading-tight drop-shadow-2xl">
          dress easy <br className="md:hidden" />
          live <span className="text-[#FF0000]">bold</span>
        </h2>
      </div>
    </section>
  );
}
