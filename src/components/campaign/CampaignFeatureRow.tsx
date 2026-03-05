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
      <div className="flex items-center justify-center px-6 md:px-20 py-6 border-y border-gray-100">

        <div className="relative w-20 h-20 md:w-32 md:h-32 ">
          <Image src="/Copy of 8+ red logo.png" alt="Logo" fill className="object-contain" />
        </div>

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
      <div className="flex items-center justify-center px-6 md:px-20 py-6 border-y border-gray-100">

        <div className="relative w-14 h-14 md:w-24 md:h-24">
          <Image src="/Copy of 8+ red logo.png" alt="Logo" fill className="object-contain" />
        </div>

      </div>
    </section>
  );
}
