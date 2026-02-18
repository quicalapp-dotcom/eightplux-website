'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = ['ALL', 'SKIRTS', 'SHOES', 'ACCESSORIES', 'SHORTS', 'TOPS'];

const products = [
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/lg.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/bb.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/tg.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/tp.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'SHORTS',  imageUrl: '/wb.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/wg.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'ACCESSORIES', imageUrl: '/tees.jpg' },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/mn.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'SKIRTS',  imageUrl: '/tww.jpg'  },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'TOPS',    imageUrl: '/rt.jpg'   },
  { name: 'DNA Capsule Hoodie', price: '$129', category: 'SKIRTS',  imageUrl: '/sg.jpg'   },
];

export default function CollectionGrid() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section className="py-20 px-6 md:px-12" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2
          className="text-5xl md:text-7xl font-black uppercase text-center mb-12 tracking-tight"
          style={{ color: '#0d0d0d' }}
        >
          PRODUCTS
        </h2>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-16">
          <div
            className="flex overflow-x-auto border border-[#0d0d0d]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-none px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: activeCategory === cat ? '#0d0d0d' : 'transparent',
                color: activeCategory === cat ? '#ffffff' : '#0d0d0d',
              }}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <Link key={index} href="/shop" className="group block">
              <div className="aspect-[3/4] relative overflow-hidden bg-[#e5e5e5] mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-sm font-bold text-[#0d0d0d] mb-1">{product.name}</h3>
              <p className="text-sm text-[#4d4d4d] font-medium">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
