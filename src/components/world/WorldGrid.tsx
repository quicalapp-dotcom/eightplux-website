'use client';

import React from 'react';
import Image from 'next/image';

const WORLD_IMAGES = [
  { src: '/skirt.jpg', alt: 'World Grid 1', className: 'col-span-2 row-span-2' },
  { src: '/tops.jpg', alt: 'World Grid 2', className: 'col-span-1 row-span-2' },
  { src: '/tg.jpg', alt: 'World Grid 3', className: 'col-span-1 row-span-1' },
  { src: '/mn.jpg', alt: 'World Grid 4', className: 'col-span-1 row-span-2' },
  { src: '/Model3.jpg', alt: 'World Grid 5', className: 'col-span-1 row-span-1' },
  { src: '/tww.jpg', alt: 'World Grid 6', className: 'col-span-2 row-span-2' },
  { src: '/tees.jpg', alt: 'World Grid 7', className: 'col-span-1 row-span-2' },
  { src: '/middle.jpg', alt: 'World Grid 8', className: 'col-span-1 row-span-1' },
  { src: '/lb.jpg', alt: 'World Grid 9', className: 'col-span-1 row-span-2' },
  { src: '/rb.jpg', alt: 'World Grid 10', className: 'col-span-2 row-span-1' },
];

export default function WorldGrid() {
  return (
    <section className="bg-white px-4 md:px-8 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[350px]">
        {WORLD_IMAGES.map((img, idx) => (
          <div 
            key={idx} 
            className={`relative overflow-hidden group bg-gray-50 ${img.className}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
