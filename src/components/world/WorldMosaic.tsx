'use client';

import React from 'react';
import Image from 'next/image';

const MOSAIC_IMAGES = [
  { src: '/skirt.jpg', alt: 'World Mosaic 1', className: 'col-span-8 row-span-2' },
  { src: '/tops.jpg', alt: 'World Mosaic 2', className: 'col-span-4 row-span-2' },
  { src: '/tg.jpg', alt: 'World Mosaic 3', className: 'col-span-4 row-span-1' },
  { src: '/mn.jpg', alt: 'World Mosaic 4', className: 'col-span-4 row-span-2' },
  { src: '/Model3.jpg', alt: 'World Mosaic 5', className: 'col-span-4 row-span-1' },
  { src: '/tp.jpg', alt: 'World Mosaic gap filler 1', className: 'col-span-4 row-span-1' }, 
  { src: '/wb.jpg', alt: 'World Mosaic gap filler 2', className: 'col-span-4 row-span-1' }, 
  { src: '/tww.jpg', alt: 'World Mosaic 6', className: 'col-span-8 row-span-2' },
  { src: '/tees.jpg', alt: 'World Mosaic 7', className: 'col-span-4 row-span-2' },
  { src: '/middle.jpg', alt: 'World Mosaic 8', className: 'col-span-8 row-span-2' },
  { src: '/lb.jpg', alt: 'World Mosaic 9', className: 'col-span-4 row-span-2' },
  { src: '/rb.jpg', alt: 'World Mosaic 10', className: 'col-span-4 row-span-1' },
  { src: '/caa.jpg', alt: 'World Mosaic gap filler 3', className: 'col-span-4 row-span-1' },
  { src: '/001.jpg', alt: 'World Mosaic 11', className: 'col-span-4 row-span-1' },
  { src: '/002.jpg', alt: 'World Mosaic 12', className: 'col-span-6 row-span-2' },
  { src: '/004.jpg', alt: 'World Mosaic 14', className: 'col-span-6 row-span-1' },
  { src: '/005.jpg', alt: 'World Mosaic 15', className: 'col-span-6 row-span-1' },
  { src: '/006.jpg', alt: 'World Mosaic 16', className: 'col-span-12 row-span-2' },
  { src: '/tts.png', alt: 'World Mosaic 20', className: 'col-span-8 row-span-2' },
  { src: '/beyondimg.png', alt: 'World Mosaic 21', className: 'col-span-4 row-span-1' },
  { src: '/downa.png', alt: 'World Mosaic 22', className: 'col-span-4 row-span-1' },
  { src: '/007.jpg', alt: 'World Mosaic 17', className: 'col-span-6 row-span-1' },
  { src: '/008.jpg', alt: 'World Mosaic 18', className: 'col-span-6 row-span-1' },
  { src: '/009.jpg', alt: 'World Mosaic 19', className: 'col-span-12 row-span-2' },
];

export default function WorldMosaic() {
  return (
    <section className="bg-white py-1">
      <div className="max-w-[1920px] mx-auto px-1">
        <div className="grid grid-cols-12 gap-1 auto-rows-[250px] md:auto-rows-[400px] grid-flow-dense">
          {MOSAIC_IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden group bg-gray-50 border border-white ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
