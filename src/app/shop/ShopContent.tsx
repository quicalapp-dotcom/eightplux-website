'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Product, SubCollection, Collection } from '@/types';
import { subscribeToProducts } from '@/lib/firebase/products';
import { subscribeToSubCollections } from '@/lib/firebase/subCollections';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { useCurrencyStore } from '@/stores/currencyStore';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export function ShopContent() {
    const { formatPrice } = useCurrencyStore();
    const searchParams = useSearchParams();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [tempSelectedCollections, setTempSelectedCollections] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'male' | 'female'>('all');
    const [selectedSuperCollection, setSelectedSuperCollection] = useState<'all' | 'casual' | 'sport'>(
        searchParams.get('superCollection') as 'casual' | 'sport' || 'all'
    );

    // Clear selected collections when super collection changes
    useEffect(() => {
        setSelectedCollections([]);
        setTempSelectedCollections([]);
    }, [selectedSuperCollection]);
    const [priceRange, setPriceRange] = useState(2000);
    const [tempPriceRange, setTempPriceRange] = useState(2000);
    const [products, setProducts] = useState<Product[]>([]);
    const [subCollections, setSubCollections] = useState<SubCollection[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);

    // Fetch real-time data
    useEffect(() => {
        const unsubscribeProducts = subscribeToProducts((prods) => {
            console.log('[ShopContent] Products loaded:', prods.length);
            console.log('[ShopContent] Sample product:', prods[0]?.id, prods[0]?.name, prods[0]?.collectionId);
            setProducts(prods);
        });
        const unsubscribeSubCollections = subscribeToSubCollections((subs) => {
            console.log('[ShopContent] Sub-collections loaded:', subs.length);
            setSubCollections(subs);
        });
        const unsubscribeCollections = subscribeToCollections((cols) => {
            console.log('[ShopContent] Collections loaded:', cols.length);
            console.log('[ShopContent] Collections superCollection values:', cols.map(c => ({ name: c.name, superCollection: c.superCollection, id: c.id })));
            setCollections(cols);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeSubCollections();
            unsubscribeCollections();
        };
    }, []);

    const clearFilters = () => {
        setSelectedCollections([]);
        setTempSelectedCollections([]);
        setSelectedCategory('all');
        setPriceRange(2000);
        setTempPriceRange(2000);
    };

    // Filter products based on selections
    const productsToDisplay = products.filter(product => {
        // Category filter (Male/Female/Unisex)
        if (selectedCategory !== 'all') {
            // Unisex products appear in both male and female categories
            if (product.category === 'unisex') {
                // If selected category is not all, unisex products should be included
            } else if (product.category !== selectedCategory) {
                return false;
            }
        }

        // Super Collection filter - check product's collection superCollection
        if (selectedSuperCollection !== 'all') {
            const productCollection = collections.find(c => c.id === product.collectionId);
            console.log('[Shop Filter] Product:', product.name, '| collectionId:', product.collectionId, '| productCollection:', productCollection?.name, '| productCollection.superCollection:', productCollection?.superCollection, '| selectedSuperCollection:', selectedSuperCollection, '| passes:', !!productCollection && productCollection.superCollection === selectedSuperCollection);
            if (!productCollection || productCollection.superCollection !== selectedSuperCollection) {
                return false;
            }
        }

        // Sub-Collection filter
        if (selectedCollections.length > 0 && !selectedCollections.includes(product.subCollectionId || '')) {
            return false;
        }

        // Price filter
        if (product.price > priceRange) {
            return false;
        }

        return true;
    });

    const handleApplyFilters = () => {
        setSelectedCollections(tempSelectedCollections);
        setPriceRange(tempPriceRange);
        setMobileFiltersOpen(false);
    };

    const toggleCategory = (cat: 'all' | 'male' | 'female') => {
        if (!mobileFiltersOpen) {
            setSelectedCategory(cat);
        }
    };

    const toggleCollection = (colId: string) => {
        setTempSelectedCollections(prev =>
            prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
        );
        if (!mobileFiltersOpen) {
            setSelectedCollections(prev =>
                prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
            );
        }
    };

    return (
        <>
        <div className="pt-[81px] bg-white min-h-screen">
            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content Area (Left) */}
                    <div className="flex-1 order-2 lg:order-1">
                        {/* Results Count & Sort - Desktop */}
                        <div className="hidden lg:flex justify-between items-center mb-12 border-b border-gray-100 dark:border-gray-900 pb-6">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                {productsToDisplay.length} Products
                            </span>
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sort By:</span>
                                <select className="bg-transparent border-none text-[10px] uppercase font-bold focus:ring-0 cursor-pointer pr-8 tracking-widest">
                                    <option>Newest In</option>
                                    <option>Price: High to Low</option>
                                    <option>Price: Low to High</option>
                                    <option>Best Sellers</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid - 3 Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {productsToDisplay.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <Link href={`/shop/product/${product.slug}`} className="block">
                                        <div className="relative aspect-[3/4] mb-6 bg-[#F6F6F6] overflow-hidden">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {product.isSale && (
                                                <div className="absolute top-4 left-4 z-10 bg-[#C72f32] text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                                    Sale
                                                </div>
                                            )}
                                            {product.inventory <= 0 && !product.isSale && (
                                                <div className="absolute top-4 left-4 z-10 bg-gray-400 text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                                    Sold Out
                                                </div>
                                            )}
                                            {product.isComingSoon && (
                                                <div className="absolute top-4 left-4 z-10 bg-[#C72f32] text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                                    Coming Soon
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="space-y-2 uppercase tracking-widest text-[10px] font-bold">
                                        <h3 className="leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="flex gap-2 text-gray-500">
                                            {product.isSale && product.compareAtPrice ? (
                                                <>
                                                    <span className="text-[#C72f32] underline decoration-1 underline-offset-4">{formatPrice(product.price)}</span>
                                                    <span className="line-through opacity-50">{formatPrice(product.compareAtPrice)}</span>
                                                </>
                                            ) : (
                                                <span>{formatPrice(product.price)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Loading Indicator / Load More */}
                        <div className="flex justify-center mt-24">
                            <button className="text-[10px] uppercase font-bold tracking-[0.3em] border-b border-black dark:border-white pb-1 hover:opacity-50 transition-opacity">
                                Load More
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Filters (Right) */}
                    <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
                        <div className="sticky top-[120px] space-y-12">
                            {/* Super Collection Filter */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedSuperCollection('all')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedSuperCollection === 'all' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    All <span className={`text-xl font-light transition-transform ${selectedSuperCollection === 'all' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <button
                                    onClick={() => setSelectedSuperCollection('casual')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedSuperCollection === 'casual' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    Casual <span className={`text-xl font-light transition-transform ${selectedSuperCollection === 'casual' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <button
                                    onClick={() => setSelectedSuperCollection('sport')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedSuperCollection === 'sport' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    Sport <span className={`text-xl font-light transition-transform ${selectedSuperCollection === 'sport' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                            </div>

                            {/* Category / Gender Filter */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => toggleCategory('all')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedCategory === 'all' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    All <span className={`text-xl font-light transition-transform ${selectedCategory === 'all' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <button
                                    onClick={() => toggleCategory('female')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedCategory === 'female' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    Shop XX+ <span className={`text-xl font-light transition-transform ${selectedCategory === 'female' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <button
                                    onClick={() => toggleCategory('male')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedCategory === 'male' ? 'border-black' : 'border-gray-100 text-gray-400'}`}
                                >
                                    Shop XY+ <span className={`text-xl font-light transition-transform ${selectedCategory === 'male' ? 'rotate-45' : ''}`}>+</span>
                                </button>
                            </div>

                             {/* Sub-Collections Filter */}
                             <div className="border-t border-gray-100 pt-10">
                                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Sub-Collections</h4>
                                 <div className="space-y-4">
                                     {subCollections
                                         .map((sc) => (
                                             <label key={sc.id} className="flex items-center gap-3 cursor-pointer group">
                                                 <div className="relative flex items-center justify-center">
                                                     <input
                                                         type="checkbox"
                                                         checked={selectedCollections.includes(sc.id)}
                                                         onChange={() => toggleCollection(sc.id)}
                                                         className="peer appearance-none w-4 h-4 border border-gray-300 checked:bg-black checked:text-white transition-all cursor-pointer"
                                                     />
                                                     <X className="absolute w-2 h-2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                 </div>
                                                 <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-black transition-colors">{sc.name}</span>
                                             </label>
                                         ))}
                                 </div>
                             </div>

                            {/* Price Filter - Desktop */}
                            <div className="border-t border-gray-100 pt-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Price Range</h4>
                                    <span className="text-[10px] font-bold">${priceRange}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="50"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                            </div>

                            {/* Reset All */}
                            <div className="pt-10 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
                                >
                                    Reset all <span className="text-lg rotate-45">⟳</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Mobile Filter Toggle Button - Floating or Sticky Bottom could also work */}
            <div className="lg:hidden fixed bottom-8 right-8 z-40">
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
        <WorldSection  image="/community.gif" />
        <NewsletterSection />
        </>
    );
}
