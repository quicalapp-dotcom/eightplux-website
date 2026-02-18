'use client';

import Link from 'next/link';

export default function Highlights() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '90vh' }}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/eightplus.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1 }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-6 py-32"
        style={{ zIndex: 2, minHeight: '90vh' }}
      >
        <h2
          className="font-black uppercase text-white leading-none mb-6"
          style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', maxWidth: '900px' }}
        >
          <span className="block">WHAT YOU WEAR SHOULD DO</span>
          <span className="block">MORE THAN LOOK GOOD.</span>
        </h2>
        <p
          className="text-white font-light leading-relaxed mb-12"
          style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)', maxWidth: '380px', opacity: 0.85 }}
        >
          These pieces are designed as everyday, built for motion, expression, and comfort so you can choose what fits your life, not just your style.
        </p>
        <Link
          href="/shop"
          className="text-white text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 transition-colors duration-200"
          style={{ border: '1.5px solid #ffffff' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffffff';
            (e.currentTarget as HTMLAnchorElement).style.color = '#000000';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
          }}
        >
          EXPLORE CLOTHING CATEGORIES
        </Link>
      </div>
    </section>
  );
}
