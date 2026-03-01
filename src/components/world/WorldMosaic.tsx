'use client';

import React from 'react';
import Image from 'next/image';

export default function WorldMosaic() {
  return (
    <section className="bg-black py-1">
      <div className="max-w-7xl mx-auto space-y-1">
        {/* Row 1: Jersey Collection */}
        <div className="grid grid-cols-12 gap-1 h-[600px] md:h-[800px]">
          {/* Left Column (Vertical Stack) */}
          <div className="col-span-5 md:col-span-4 flex flex-col gap-1">
            <div className="relative h-2/3 w-full overflow-hidden">
              <Image src="/mn.jpg" alt="Model" fill className="object-cover" />
            </div>
            <div className="relative h-1/3 w-full overflow-hidden">
              <Image src="/lb.jpg" alt="Detail" fill className="object-cover" />
            </div>
          </div>
          {/* Right Column (Focus) */}
          <div className="col-span-7 md:col-span-8 relative overflow-hidden">
            <Image src="/Model2.jpg" alt="Main" fill className="object-cover" />
          </div>
        </div>

        {/* Row 2: Bridge Collection (Inverted layout) */}
        <div className="grid grid-cols-12 gap-1 h-[600px] md:h-[800px]">
          {/* Left Column (Focus) */}
          <div className="col-span-7 md:col-span-8 relative overflow-hidden">
            <Image src="/middle.jpg" alt="Landscape" fill className="object-cover" />
          </div>
          {/* Right Column (Vertical Stack) */}
          <div className="col-span-5 md:col-span-4 flex flex-col gap-1">
            <div className="relative h-2/3 w-full overflow-hidden">
              <Image src="/rb.jpg" alt="Portrait" fill className="object-cover" />
            </div>
            <div className="relative h-1/3 w-full overflow-hidden">
              <Image src="/tops.jpg" alt="Detail" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
