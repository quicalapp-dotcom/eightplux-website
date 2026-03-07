'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { Product, Collection } from '@/types';
import { subscribeToProducts } from '@/lib/firebase/products';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { useCurrencyStore } from '@/stores/currencyStore';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;
    const { formatPrice } = useCurrencyStore();
    
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [tempSelectedCollections, setTempSelectedCollections] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState(2000);
    const [tempPriceRange, setTempPriceRange] = useState(2000);
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryLabel = category === 'women' ? 'Women' : 'Men';
    const categoryTitle = category === 'women' ? 'Shop XX' : 'Shop XY';

    // Fetch real-time data
    useEffect(() => {
        const unsubscribeProducts = subscribeToProducts((prods) => {
            // Filter products by category
            const filtered = prods.filter(p => p.category === category);
            setProducts(filtered);
            setLoading(false);
        });
        
        const unsubscribeCollections = subscribeToCollections((cols) => {
            // Filter collections by category
            const filtered = cols.filter(c => c.category === category && c.isActive);
            setCollections(filtered);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeCollections();
        };
    }, [category]);

    const clearFilters = () => {
        setSelectedCollections([]);
        setTempSelectedCollections([]);
        setPriceRange(2000);
        setTempPriceRange(2000);
    };

    // Filter products based on selections
    const productsToDisplay = products.filter(product => {
        // Collection filter
        if (selectedCollections.length > 0 && !selectedCollections.includes(product.collectionId)) {
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
                    {/* Back Button & Title */}
                    <div className="mb-12">
                        <button 
                            onClick={() => router.push('/shop')}
                            className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Shop
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
                            {categoryTitle}
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">
                            {categoryLabel} Collection
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Main Content Area */}
                        <div className="flex-1 order-2 lg:order-1">
                            {/* Results Count & Sort - Desktop */}
                            <div className="hidden lg:flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
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

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {loading ? (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-gray-400 uppercase tracking-widest text-xs">Loading products...</p>
                                    </div>
                                ) : productsToDisplay.length > 0 ? (
                                    productsToDisplay.map((product) => (
                                        <div key={product.id} className="group cursor-pointer">
                                            <Link href={`/shop/${product.slug}`} className="block">
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
                                                    {product.isNew && (
                                                        <div className="absolute top-4 right-4 z-10 bg-black text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                                            New
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
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-gray-400 uppercase tracking-widest text-xs mb-4">No products found</p>
                                        <button 
                                            onClick={clearFilters}
                                            className="text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1 hover:opacity-50"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Load More */}
                            {!loading && productsToDisplay.length > 0 && (
                                <div className="flex justify-center mt-24">
                                    <button className="text-[10px] uppercase font-bold tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity">
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
                            <div className="sticky top-[120px] space-y-12">
                                {/* Collections Filter */}
                                <div className="border-t border-gray-100 pt-10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Collections</h4>
                                    <div className="space-y-4">
                                        {collections.map((col) => (
                                            <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCollections.includes(col.id)}
                                                        onChange={() => toggleCollection(col.id)}
                                                        className="peer appearance-none w-4 h-4 border border-gray-300 checked:bg-black checked:text-white transition-all cursor-pointer"
                                                    />
                                                    <X className="absolute w-2 h-2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-black transition-colors">{col.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
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

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden fixed bottom-8 right-8 z-40">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <WorldSection image="/community.gif" />
            <NewsletterSection />
        </>
    );
}
