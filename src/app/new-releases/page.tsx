'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import { getNewReleasesProducts } from '@/lib/firebase/collections';

const categories = ['All', 'Women', 'Men', 'Outerwear', 'Knitwear', 'Accessories'];

export default function NewReleasesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const newReleases = await getNewReleasesProducts();
                setProducts(newReleases);
            } catch (error) {
                console.error('Error fetching new releases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Display products from Firebase only
    const displayProducts = products;

    return (
        <div className="bg-white dark:bg-[#0F0F0F] text-black dark:text-gray-100">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_"
                    alt="New Releases Collection"
                    fill
                    className="object-cover opacity-80"
                />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-5xl md:text-8xl font-display uppercase tracking-widest mb-4">
                        New Releases
                    </h1>
                    <p className="text-xs md:text-sm font-light tracking-[0.3em] uppercase opacity-80">
                        Fall / Winter 2024 Collection
                    </p>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <section className="sticky top-[81px] z-40 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex overflow-x-auto gap-8 md:gap-12 w-full md:w-auto justify-center md:justify-start hide-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === category
                                        ? 'font-bold border-b border-black dark:border-white pb-1'
                                        : 'text-gray-500 hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors w-full md:w-auto justify-center">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter & Sort
                    </button>
                </div>
            </section>

            {/* Product Grid */}
            <section className="bg-white dark:bg-[#0F0F0F]">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[2px] w-full">
                    {displayProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`group relative bg-white dark:bg-[#141414] overflow-hidden ${index === 7 ? 'col-span-1 md:col-span-2 row-span-2' : ''
                                }`}
                        >
                            {/* Editorial Break */}
                            {index === 7 ? (
                                <div className="relative w-full h-full min-h-[400px]">
                                    <Image
                                        src={product.images[0]}
                                        alt="Editorial"
                                        fill
                                        className="object-cover grayscale opacity-80"
                                    />
                                    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                                        <h2 className="text-white text-3xl font-display mb-2">Intentional Shapes</h2>
                                        <p className="text-white/80 text-xs tracking-wide">
                                            Explore the architectural silhouettes of the season.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link href={`/shop/${product.id}`}>
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:opacity-0 transition-opacity duration-300 z-10"
                                        />
                                        <Image
                                            src={product.images[1]}
                                            alt={`${product.name} hover`}
                                            fill
                                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 scale-105"
                                        />
                                        {/* Badge */}
                                        {product.isNew && (
                                            <div className="absolute top-2 left-2 z-20">
                                                <span className="bg-white/90 px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-black">
                                                    New
                                                </span>
                                            </div>
                                        )}
                                        {product.isExclusive && (
                                            <div className="absolute top-2 left-2 z-20">
                                                <span className="bg-black text-white px-2 py-1 text-[9px] uppercase tracking-widest font-bold">
                                                    Exclusive
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xs font-display font-semibold uppercase tracking-wider">
                                                {product.name}
                                            </h3>
                                            <span className="text-xs font-light">${product.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                            {product.fabric}
                                        </p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="py-16 text-center">
                    <button className="border border-black dark:border-white px-12 py-4 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                        Load More
                    </button>
                </div>
            </section>

            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
