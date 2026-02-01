'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';

// Mock product data
const products = [
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
    },
    {
        id: '3',
        name: 'Moto Leather',
        slug: 'moto-leather',
        price: 2450,
        fabric: 'Calfskin',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ot2c9vv5-mlJg9eapl412CP3uc1hDlHsDk4iUZZFD1pskjJVXTBP6Pr_hvlhIonNV1Lkgna5xDhGnXv3mj6hP-nZJDkzXS3cWtB3eFUbROxCJXt744Dt7K2-QWGjxaeWd7se0fBjZF-OPm7moUbEqKCQy_m957iaf4Z12mWkIPxioQoVvt4uOQZtuk7pgmBUYYSF1mevinOAGl9x7zBF_fUgVGnEYBJhdsbfqjG_nsuVFFOMKD-hAmIY00eZlW4QgzJNVYedfGfz',
        ],
        colors: [{ name: 'Black', hex: '#000000' }],
        isBestSeller: true,
    },
    {
        id: '4',
        name: 'Core Hoodie',
        slug: 'core-hoodie',
        price: 450,
        fabric: 'Heavyweight Cotton',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ot2c9vv5-mlJg9eapl412CP3uc1hDlHsDk4iUZZFD1pskjJVXTBP6Pr_hvlhIonNV1Lkgna5xDhGnXv3mj6hP-nZJDkzXS3cWtB3eFUbROxCJXt744Dt7K2-QWGjxaeWd7se0fBjZF-OPm7moUbEqKCQy_m957iaf4Z12mWkIPxioQoVvt4uOQZtuk7pgmBUYYSF1mevinOAGl9x7zBF_fUgVGnEYBJhdsbfqjG_nsuVFFOMKD-hAmIY00eZlW4QgzJNVYedfGfz',
        ],
        colors: [{ name: 'Gray', hex: '#808080' }, { name: 'Black', hex: '#000000' }],
    },
    {
        id: '5',
        name: 'Silk Trouser',
        slug: 'silk-trouser',
        price: 1100,
        fabric: 'Relaxed Pleat',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRiiwapBhxLMrAoy6_1_ft9UvkdAm5Mba_9mNSHQ2dITghsQKqOJGc5Yz-k27QHeujR-PMinyiaW6CSzleoGwZOJoc3fxsUuuD5BEQiO3ZbWjUkC5cvGEa70eD68werBr2UNC5IKZZBV1i5J8QCHwAxpORlYCA354Uomh775PyM68nrV7VtZy-kZxAIq1oL6Bln6dGzxVTniWYX0W1nreaXMWHzjFMHpnml2gBnHusI4NZTeVt9aYV3KzKdu5X2fkCPHqu1QxPQ4H',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRiiwapBhxLMrAoy6_1_ft9UvkdAm5Mba_9mNSHQ2dITghsQKqOJGc5Yz-k27QHeujR-PMinyiaW6CSzleoGwZOJoc3fxsUuuD5BEQiO3ZbWjUkC5cvGEa70eD68werBr2UNC5IKZZBV1i5J8QCHwAxpORlYCA354Uomh775PyM68nrV7VtZy-kZxAIq1oL6Bln6dGzxVTniWYX0W1nreaXMWHzjFMHpnml2gBnHusI4NZTeVt9aYV3KzKdu5X2fkCPHqu1QxPQ4H',
        ],
        colors: [{ name: 'Camel', hex: '#d2b48c' }],
    },
    {
        id: '6',
        name: 'Luxury Zip',
        slug: 'luxury-zip',
        price: 890,
        fabric: 'Cashmere Blend',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
        ],
        colors: [{ name: 'Gray', hex: '#808080' }, { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#f5f5f5' }],
    },
    {
        id: '7',
        name: 'Combat Derby',
        slug: 'combat-derby',
        price: 1350,
        fabric: 'Polished Leather',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAONEJr7Tczt0KHlX1SSC9TPyHy2oS3b72tPHuAS0ER6awAcq-6kkbN36jPGiG4WzwDRBhjH84FI2lV32n962QW--eTAWvIU1nnnlri9LpQVFjLD5xYTH0Hjp1EgQzdtrm8va5qtpWj9jmdup6kCg7p_LmXTfIvLPvKwlIknIr9gLVfklOK-SAeH9LVaVZ_ZA-4TCSXJXw7PMpXhX54cb8MOqCkXc_hBklTupZwxfdw2po52GXAv7n-fPaRgHl5QqTCQhb7niuSZVDR',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW',
        ],
        colors: [{ name: 'Black', hex: '#000000' }],
    },
    {
        id: '8',
        name: 'Racer Jacket',
        slug: 'racer-jacket',
        price: 1950,
        compareAtPrice: 2450,
        fabric: 'Structured',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAONEJr7Tczt0KHlX1SSC9TPyHy2oS3b72tPHuAS0ER6awAcq-6kkbN36jPGiG4WzwDRBhjH84FI2lV32n962QW--eTAWvIU1nnnlri9LpQVFjLD5xYTH0Hjp1EgQzdtrm8va5qtpWj9jmdup6kCg7p_LmXTfIvLPvKwlIknIr9gLVfklOK-SAeH9LVaVZ_ZA-4TCSXJXw7PMpXhX54cb8MOqCkXc_hBklTupZwxfdw2po52GXAv7n-fPaRgHl5QqTCQhb7niuSZVDR',
        ],
        colors: [{ name: 'Black', hex: '#000000' }, { name: 'Oxblood', hex: '#3b0d0d' }],
        isSale: true,
    },
    {
        id: '9',
        name: 'Lounge Pant',
        slug: 'lounge-pant',
        price: 320,
        fabric: 'Organic Cotton',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRiiwapBhxLMrAoy6_1_ft9UvkdAm5Mba_9mNSHQ2dITghsQKqOJGc5Yz-k27QHeujR-PMinyiaW6CSzleoGwZOJoc3fxsUuuD5BEQiO3ZbWjUkC5cvGEa70eD68werBr2UNC5IKZZBV1i5J8QCHwAxpORlYCA354Uomh775PyM68nrV7VtZy-kZxAIq1oL6Bln6dGzxVTniWYX0W1nreaXMWHzjFMHpnml2gBnHusI4NZTeVt9aYV3KzKdu5X2fkCPHqu1QxPQ4H',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
        ],
        colors: [{ name: 'White', hex: '#f5f5f5' }, { name: 'Black', hex: '#000000' }],
    },
];

const categories = ['All Products', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'];
const genders = ['Men', 'Women', 'Unisex'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'Oxblood', hex: '#722f37' },
];

const subcategories = [
    { name: 'New Releases', href: '/new-releases' },
    { name: 'Women', href: '/shop/women' },
    { name: 'Men', href: '/shop/men' },
    { name: 'Hoodies', href: '/shop?category=hoodies' },
    { name: 'Shirts', href: '/shop?category=shirts' },
    { name: 'Pants', href: '/shop?category=pants' },
    { name: 'Accessories', href: '/shop?category=accessories' },
    { name: 'Shop Looks', href: '/shop/looks' },
];

export default function ShopPage() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState(2000);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedGenders([]);
        setPriceRange(2000);
    };

    return (
        <div className="pt-[81px]">
            {/* Subcategory Navigation */}
            <div className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 hidden md:block">
                <div className="container mx-auto px-6 py-4">
                    <ul className="flex justify-center space-x-8 text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">
                        {subcategories.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <main className="pb-24 px-6 md:px-12 container mx-auto pt-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="w-full lg:w-64 shrink-0 hidden lg:block sticky top-[120px] h-[calc(100vh-180px)] overflow-y-auto pr-4">
                        <div className="space-y-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-display text-lg">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-[10px] uppercase underline text-gray-500 hover:text-black dark:hover:text-white"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {categories.map((category) => (
                                        <li key={category}>
                                            <label className="flex items-center space-x-2 cursor-pointer hover:text-black dark:hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCategories([...selectedCategories, category]);
                                                        } else {
                                                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                                                        }
                                                    }}
                                                    className="form-checkbox text-black border-gray-300 rounded-none focus:ring-0"
                                                />
                                                <span>{category}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gender Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Gender</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {genders.map((gender) => (
                                        <li key={gender}>
                                            <label className="flex items-center space-x-2 cursor-pointer hover:text-black dark:hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenders.includes(gender)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedGenders([...selectedGenders, gender]);
                                                        } else {
                                                            setSelectedGenders(selectedGenders.filter(g => g !== gender));
                                                        }
                                                    }}
                                                    className="form-checkbox text-black border-gray-300 rounded-none focus:ring-0"
                                                />
                                                <span>{gender}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Price</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                                />
                                <div className="flex justify-between text-[10px] mt-2 font-mono">
                                    <span>$0</span>
                                    <span>${priceRange}+</span>
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Size</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            className="border border-gray-200 dark:border-gray-700 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Color</h4>
                                <div className="flex gap-3">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.name}
                                            className="w-5 h-5 rounded-full border border-gray-200"
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                            <span className="text-sm uppercase font-bold">{products.length} Items</span>
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
                            </button>
                        </div>

                        {/* Results Count & Sort - Desktop */}
                        <div className="hidden lg:flex justify-between items-center mb-8">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">
                                Showing 1-{products.length} of {products.length} Results
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-xs uppercase font-bold text-gray-500">Sort By:</span>
                                <select className="bg-transparent border-none text-xs uppercase font-bold focus:ring-0 cursor-pointer pr-8">
                                    <option>Newest In</option>
                                    <option>Price: High to Low</option>
                                    <option>Price: Low to High</option>
                                    <option>Best Sellers</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <div key={product.id} className="group product-card cursor-pointer">
                                    <Link href={`/shop/${product.slug}`} className="block">
                                        <div className="relative aspect-[3/4] mb-4 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                            {/* Badges */}
                                            {product.isNew && (
                                                <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                                                    New In
                                                </div>
                                            )}
                                            {product.isBestSeller && (
                                                <div className="absolute top-2 left-2 z-10 border border-black dark:border-white bg-transparent px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                                                    Best Seller
                                                </div>
                                            )}
                                            {product.isSale && (
                                                <div className="absolute top-2 left-2 z-10 bg-red-700 text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                                                    Sale
                                                </div>
                                            )}

                                            {/* Images */}
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover default-img"
                                            />
                                            <Image
                                                src={product.images[1] || product.images[0]}
                                                alt={`${product.name} hover`}
                                                fill
                                                className="object-cover hover-img opacity-0 transition-opacity duration-500"
                                            />

                                            {/* Quick Add */}
                                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
                                                <button className="bg-white/90 backdrop-blur text-black w-full py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                                                    Quick Add
                                                </button>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-display text-lg leading-tight mb-1 group-hover:underline underline-offset-4 decoration-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.fabric}</p>
                                        </div>
                                        {product.isSale && product.compareAtPrice ? (
                                            <div className="flex flex-col items-end">
                                                <span className="font-display text-sm text-red-700">${product.price.toLocaleString()}</span>
                                                <span className="font-display text-xs line-through text-gray-400">
                                                    ${product.compareAtPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-display text-sm">${product.price.toLocaleString()}</span>
                                        )}
                                    </div>

                                    {/* Color Swatches */}
                                    <div className="flex gap-1 mt-2">
                                        {product.colors.map((color) => (
                                            <div
                                                key={color.name}
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Loading Indicator */}
                        <div className="flex justify-center mt-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-black p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-display text-lg">Filters</h3>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Same filter content as desktop... */}
                        <p className="text-gray-500 text-sm">Filter options here...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
