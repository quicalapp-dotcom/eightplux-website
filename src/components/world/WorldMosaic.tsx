'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { subscribeToWorldMosaic } from '@/lib/firebase/world';
import { WorldMosaicImage } from '@/types';

// Default fallback images if no data from Firebase
const DEFAULT_MOSAIC_IMAGES = [
  { src: '/skirt.jpg', alt: 'World Mosaic 1', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/tops.jpg', alt: 'World Mosaic 2', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/tg.jpg', alt: 'World Mosaic 3', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/mn.jpg', alt: 'World Mosaic 4', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/Model3.jpg', alt: 'World Mosaic 5', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/tp.jpg', alt: 'World Mosaic gap filler 1', className: 'col-span-4 row-span-1', socialLink: '' }, 
  { src: '/wb.jpg', alt: 'World Mosaic gap filler 2', className: 'col-span-4 row-span-1', socialLink: '' }, 
  { src: '/tww.jpg', alt: 'World Mosaic 6', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/tees.jpg', alt: 'World Mosaic 7', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/middle.jpg', alt: 'World Mosaic 8', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/lb.jpg', alt: 'World Mosaic 9', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/rb.jpg', alt: 'World Mosaic 10', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/caa.jpg', alt: 'World Mosaic gap filler 3', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/001.jpg', alt: 'World Mosaic 11', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/002.jpg', alt: 'World Mosaic 12', className: 'col-span-6 row-span-2', socialLink: '' },
  { src: '/004.jpg', alt: 'World Mosaic 14', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/005.jpg', alt: 'World Mosaic 15', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/006.jpg', alt: 'World Mosaic 16', className: 'col-span-12 row-span-2', socialLink: '' },
  { src: '/tts.png', alt: 'World Mosaic 20', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/beyondimg.png', alt: 'World Mosaic 21', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/downa.png', alt: 'World Mosaic 22', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/007.jpg', alt: 'World Mosaic 17', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/008.jpg', alt: 'World Mosaic 18', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/009.jpg', alt: 'World Mosaic 19', className: 'col-span-12 row-span-2', socialLink: '' },
];

export default function WorldMosaic() {
  const [images, setImages] = useState<WorldMosaicImage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToWorldMosaic((data) => {
      if (data && data.length > 0) {
        setImages(data);
      } else {
        // Use default images if no data from Firebase
        setImages(DEFAULT_MOSAIC_IMAGES.map((img, idx) => ({
          ...img,
          id: idx.toString(),
          sortOrder: idx
        })));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="bg-white py-1">
      <div className="max-w-[1920px] mx-auto px-1">
        <div className="grid grid-cols-12 gap-1 auto-rows-[250px] md:auto-rows-[400px] grid-flow-dense">
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`relative overflow-hidden group bg-gray-50 border border-white ${img.className}`}
            >
              {img.socialLink ? (
                <Link 
                  href={img.socialLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium">View Profile</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
