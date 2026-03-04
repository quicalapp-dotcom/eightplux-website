'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '@/types';
import { subscribeToProducts, subscribeToCategories } from '@/lib/firebase/admin';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function ShopPage() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [tempSelectedGenders, setTempSelectedGenders] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState(2000);
    const [tempPriceRange, setTempPriceRange] = useState(2000);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch real-time data
    useEffect(() => {
        const unsubscribeProducts = subscribeToProducts(setProducts);
        const unsubscribeCategories = subscribeToCategories(setCategories);

        return () => {
            unsubscribeProducts();
            unsubscribeCategories();
        };
    }, []);


    const clearFilters = () => {
        setSelectedCategories([]);
        setTempSelectedCategories([]);
        setSelectedGenders([]);
        setTempSelectedGenders([]);
        setPriceRange(2000);
        setTempPriceRange(2000);
    };


    const fallbackProducts: Product[] = [
        { id: '1', name: 'Waistcoat with Pockets', slug: 'waistcoat-pockets', price: 49.90, fabric: 'Technical', images: ['/Model1.jpg'], colors: [{name: 'Black', hex: '#000'}], isNew: true, isBestSeller: false, isSale: false, category: 'Waistcoats', currency: 'USD', description: '', inventory: 10, sizes: ['S', 'M', 'L'], tags: [], gender: 'women', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Silk Trouser', slug: 'silk-trouser', price: 110.00, fabric: 'Silk', images: ['/lg.jpg'], colors: [{name: 'Navy', hex: '#1e3a5f'}], isNew: false, isBestSeller: true, isSale: false, category: 'Trousers', currency: 'USD', description: '', inventory: 5, sizes: ['M', 'L'], tags: [], gender: 'women', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Derby Boot', slug: 'derby-boot', price: 135.00, fabric: 'Leather', images: ['/Model2.jpg'], colors: [{name: 'Brown', hex: '#4b3621'}], isNew: true, isBestSeller: false, isSale: false, category: 'Shoes', currency: 'USD', description: '', inventory: 8, sizes: ['42', '43'], tags: [], gender: 'men', createdAt: new Date(), updatedAt: new Date() },
    ];

    // Determine which data to use
    const baseProducts = products.length > 0 ? products : fallbackProducts;
    
    // Filter products based on selections
    const productsToDisplay = baseProducts.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Gender filter
        if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender.charAt(0).toUpperCase() + product.gender.slice(1))) {
            return false;
        }
        
        // Price filter
        if (product.price > priceRange) {
            return false;
        }
        
        return true;
    });

    const categoriesToDisplay = categories.length > 0 ? categories.map(c => c.name) : ['Waistcoats', 'Trousers', 'Shoes', 'Outerwear', 'Tops', 'Shirts'];
    const genders = ['Men', 'Women', 'Unisex'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    const handleApplyFilters = () => {
        setSelectedCategories(tempSelectedCategories);
        setSelectedGenders(tempSelectedGenders);
        setPriceRange(tempPriceRange);
        setMobileFiltersOpen(false);
    };

    const toggleGender = (gender: string) => {
        setTempSelectedGenders(prev => 
            prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
        );
        if (!mobileFiltersOpen) {
            setSelectedGenders(prev => 
                prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
            );
        }
    };

    const toggleCategory = (cat: string) => {
        setTempSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
        // For desktop, apply immediately if not mobile
        if (!mobileFiltersOpen) {
            setSelectedCategories(prev => 
                prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
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
                                    <Link href={`/shop/${product.slug}`} className="block">
                                        <div className="relative aspect-[3/4] mb-6 bg-[#F6F6F6] dark:bg-gray-900 overflow-hidden">
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
                                                    <span className="text-[#C72f32] underline decoration-1 underline-offset-4">${product.price}</span>
                                                    <span className="line-through opacity-50">${product.compareAtPrice}</span>
                                                </>
                                            ) : (
                                                <span>${product.price}</span>
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
                            {/* Gender / High Level Categories */}
                            <div className="space-y-4">
                                <button 
                                    onClick={() => toggleGender('Women')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedGenders.includes('Women') ? 'border-black' : 'border-gray-100 dark:border-gray-800 text-gray-400'}`}
                                >
                                    Woman+ <span className={`text-xl font-light transition-transform ${selectedGenders.includes('Women') ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                <button 
                                    onClick={() => toggleGender('Men')}
                                    className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] border-t pt-6 group transition-colors ${selectedGenders.includes('Men') ? 'border-black' : 'border-gray-100 dark:border-gray-800 text-gray-400'}`}
                                >
                                    Man+ <span className={`text-xl font-light transition-transform ${selectedGenders.includes('Men') ? 'rotate-45' : ''}`}>+</span>
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Category</h4>
                                <div className="space-y-4">
                                    {categoriesToDisplay.map((cat) => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => toggleCategory(cat)}
                                                    className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-gray-700 checked:bg-black dark:checked:bg-white transition-all cursor-pointer"
                                                />
                                                <X className="absolute w-2 h-2 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-black transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter - Desktop */}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
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

                            {/* Size Filter */}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Size</h4>
                                    <button className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white underline decoration-dotted">Size guide</button>
                                </div>
                                <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-6 font-bold">Choose your size</p>
                                <div className="grid grid-cols-2 gap-y-4">
                                    {sizes.concat(['XXL']).map((size) => (
                                        <label key={size} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-gray-700 checked:bg-black dark:checked:bg-white transition-all cursor-pointer"
                                                />
                                                <X className="absolute w-2 h-2 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reset All */}
                            <div className="pt-10 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
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
