'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Product, Collection } from '@/types';
import { getCollectionBySlug, getProductsByCollection } from '@/lib/firebase/collections';

export default function CollectionPage() {
    const params = useParams();
    const router = useRouter();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCollection = await getCollectionBySlug(params.slug as string);
                if (!fetchedCollection) {
                    router.push('/shop');
                    return;
                }
                setCollection(fetchedCollection);
                
                const fetchedProducts = await getProductsByCollection(fetchedCollection.id);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching collection data:', error);
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.slug, router]);

    // Fallback data if collection not found or no products
    const fallbackProducts: Product[] = [
        {
            id: '1',
            name: 'The Trench',
            slug: 'the-trench',
            price: 1250,
            fabric: 'Technical Cotton Blend',
            images: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuArdfgsNIMQMstJ0ysu6C0rVRpYRrwMkx-6YicV9P_Rc4k14KjpvQylNHxYJIMPfvszdg4s1ELWqLmWJVcyv2sDtWLvZLgB9sbEntPDjTmaw60sFSlqkIcJ044MXHGBoRkgcbrJuTJN6aIS0jSLW07_aRI51pmLKPeSHi9IWEQ5EjtwLGaJVhGnYaBItypAETA6DMiBvGP95_8U6WXgaAxReyxnw9vatAYAlXaSRdHtwGsOJlQkGWAIF5nxPkvvaOVCHYOGNEw5ySJL',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_',
            ],
            colors: [{ name: 'Black', hex: '#000000' }, { name: 'Gray', hex: '#808080' }],
            isNew: true,
            isBestSeller: false,
            isSale: false,
            compareAtPrice: undefined,
            category: 'Outerwear',
            currency: 'USD',
            description: 'Technical cotton blend trench coat',
            inventory: 10,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: [],
            gender: 'unisex',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            name: 'Studio Blouson',
            slug: 'studio-blouson',
            price: 890,
            fabric: 'Archival Fit',
            images: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuArdfgsNIMQMstJ0ysu6C0rVRpYRrwMkx-6YicV9P_Rc4k14KjpvQylNHxYJIMPfvszdg4s1ELWqLmWJVcyv2sDtWLvZLgB9sbEntPDjTmaw60sFSlqkIcJ044MXHGBoRkgcbrJuTJN6aIS0jSLW07_aRI51pmLKPeSHi9IWEQ5EjtwLGaJVhGnYaBItypAETA6DMiBvGP95_8U6WXgaAxReyxnw9vatAYAlXaSRdHtwGsOJlQkGWAIF5nxPkvvaOVCHYOGNEw5ySJL',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_',
            ],
            colors: [{ name: 'Black', hex: '#000000' }],
            isNew: false,
            isBestSeller: true,
            isSale: false,
            compareAtPrice: undefined,
            category: 'Outerwear',
            currency: 'USD',
            description: 'Archival fit blouson jacket',
            inventory: 5,
            sizes: ['S', 'M', 'L', 'XL'],
            tags: [],
            gender: 'men',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const displayProducts = products.length > 0 ? products : fallbackProducts;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0F0F0F] text-black dark:text-gray-100">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black flex items-center justify-center">
                <Image
                    src={collection?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_'}
                    alt={collection?.name || 'Collection'}
                    fill
                    className="object-cover opacity-80"
                />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-5xl md:text-8xl font-display uppercase tracking-widest mb-4">
                        {collection?.name || 'Collection'}
                    </h1>
                    <p className="text-xs md:text-sm font-light tracking-[0.3em] uppercase opacity-80">
                        {collection?.description || 'Discover our latest collection'}
                    </p>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <section className="sticky top-[81px] z-40 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex overflow-x-auto gap-8 md:gap-12 w-full md:w-auto justify-center md:justify-start hide-scrollbar">
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === 'All'
                                    ? 'font-bold border-b border-black dark:border-white pb-1'
                                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveCategory('Women')}
                            className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === 'Women'
                                    ? 'font-bold border-b border-black dark:border-white pb-1'
                                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            Women
                        </button>
                        <button
                            onClick={() => setActiveCategory('Men')}
                            className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === 'Men'
                                    ? 'font-bold border-b border-black dark:border-white pb-1'
                                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            Men
                        </button>
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
                                <Link href={`/shop/${product.slug}`}>
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
                                        {product.isBestSeller && (
                                            <div className="absolute top-2 left-2 z-20">
                                                <span className="bg-black text-white px-2 py-1 text-[9px] uppercase tracking-widest font-bold">
                                                    Best Seller
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
