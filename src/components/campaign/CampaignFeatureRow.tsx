'use client';

import React from 'react';
import Image from 'next/image';

interface CampaignFeatureRowProps {
  leftImage: string;
  rightImage: string;
}

export default function CampaignFeatureRow({ leftImage, rightImage }: CampaignFeatureRowProps) {
  return (
    <section className="bg-white">
      {/* Branded Divider Top */}
      <div className="flex items-center justify-between px-6 md:px-20 py-6 border-y border-gray-100">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black">EIGHTPLUX®</span>
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          <Image src="/Copy of 8+ red logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black">EIGHTPLUX®</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-8">
        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden group">
          <Image src={leftImage} alt="Feature Left" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
        </div>
        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden group">
          <Image src={rightImage} alt="Feature Right" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
        </div>
      </div>

      {/* Branded Divider Bottom */}
      <div className="flex items-center justify-between px-6 md:px-20 py-6 border-y border-gray-100">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black">EIGHTPLUX®</span>
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          <Image src="/Copy of 8+ red logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black">EIGHTPLUX®</span>
      </div>
    </section>
  );
}
