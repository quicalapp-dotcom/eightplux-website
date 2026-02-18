'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroImages() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const base = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(60px)',
    transition: `opacity 700ms ease ${delay}ms, transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="w-full flex gap-2 md:gap-3 px-2 md:px-4 mb-2 items-end justify-center">
      {/* Left column: lt + lb */}
      <div className="flex flex-col gap-2 md:gap-3 flex-none">
        {/* lt: 472 × 461.93 */}
        <div className="relative overflow-hidden flex-none" style={{ width: 472, height: 461.93, ...base(0) }}>
          <Image src="/lt.jpg" alt="Left top" fill className="object-cover" priority />
        </div>
        {/* lb: 472 × 193.07 */}
        <div className="relative overflow-hidden flex-none" style={{ width: 472, height: 193.07, ...base(80) }}>
          <Image src="/lb.jpg" alt="Left bottom" fill className="object-cover" priority />
        </div>
      </div>

      {/* Center: middle 480 × 573 */}
      <div className="relative overflow-hidden flex-none" style={{ width: 480, height: 573, alignSelf: 'flex-end', ...base(160) }}>
        <Image src="/middle.jpg" alt="Center" fill className="object-cover" priority />
      </div>

      {/* Right column: rt + rb */}
      <div className="flex flex-col gap-2 md:gap-3 flex-none">
        {/* rt: 472 × 327.5 */}
        <div className="relative overflow-hidden flex-none" style={{ width: 472, height: 327.5, ...base(240) }}>
          <Image src="/rt.jpg" alt="Right top" fill className="object-cover" priority />
        </div>
        {/* rb: 472 × 327.5 */}
        <div className="relative overflow-hidden flex-none" style={{ width: 472, height: 327.5, ...base(320) }}>
          <Image src="/rb.jpg" alt="Right bottom" fill className="object-cover" priority />
        </div>
      </div>
    </div>
  );
}
