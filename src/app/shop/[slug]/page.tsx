'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

// Mock product data - in production this would come from a database
const product = {
    id: 'void-trench',
    name: 'The Void Trench',
    price: 3200,
    description: 'Oversized silhouette constructed from bonded technical cotton. Features dropped shoulders, concealed placket, and exaggerated lapels. Finished with our signature raw-hem detailing and internal carry straps.',
    ref: '8P-2024-VT',
    images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZlC9BvXQOC0fXsdORuBsOosfqGKQkRGJwU4739Gryc4Mbv3GGyulPtr8TvXu1ncep1G-pSj9XMPwq1d2-_u3drJyZiIYIosY5h-N4TAqNBbIYIGXmlyBGjkcVeFN0Fg_nftkxsshtR6bssd8GQkQwKAIri00LtT13W9OLKqQpBTKbhcGyA8g9w2EEoj1DYrBe3sgJ3yw2riXATCnitBBxTjM0As_3FK5AbY5UuLLpR19ZamN0emnW1FNY-TRKY8g0qiHHVKdPm9D',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_',
    ],
    colors: [
        { name: 'Obsidian', hex: '#000000' },
        { name: 'Charcoal', hex: '#3e3e3e' },
        { name: 'Khaki', hex: '#5c5346' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Outerwear',
};

const styledWith = [
    { name: 'Silk Trouser', price: 1100, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRiiwapBhxLMrAoy6_1_ft9UvkdAm5Mba_9mNSHQ2dITghsQKqOJGc5Yz-k27QHeujR-PMinyiaW6CSzleoGwZOJoc3fxsUuuD5BEQiO3ZbWjUkC5cvGEa70eD68werBr2UNC5IKZZBV1i5J8QCHwAxpORlYCA354Uomh775PyM68nrV7VtZy-kZxAIq1oL6Bln6dGzxVTniWYX0W1nreaXMWHzjFMHpnml2gBnHusI4NZTeVt9aYV3KzKdu5X2fkCPHqu1QxPQ4H', slug: 'silk-trouser' },
    { name: 'Derby Boot', price: 1350, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAONEJr7Tczt0KHlX1SSC9TPyHy2oS3b72tPHuAS0ER6awAcq-6kkbN36jPGiG4WzwDRBhjH84FI2lV32n962QW--eTAWvIU1nnnlri9LpQVFjLD5xYTH0Hjp1EgQzdtrm8va5qtpWj9jmdup6kCg7p_LmXTfIvLPvKwlIknIr9gLVfklOK-SAeH9LVaVZ_ZA-4TCSXJXw7PMpXhX54cb8MOqCkXc_hBklTupZwxfdw2po52GXAv7n-fPaRgHl5QqTCQhb7niuSZVDR', slug: 'derby-boot' },
];

const recentlyViewed = [
    { name: 'Cashmere Hoodie', price: 890, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf' },
    { name: 'Calfskin Jacket', price: 2450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW' },
    { name: 'Studio Knit', price: 650, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArdfgsNIMQMstJ0ysu6C0rVRpYRrwMkx-6YicV9P_Rc4k14KjpvQylNHxYJIMPfvszdg4s1ELWqLmWJVcyv2sDtWLvZLgB9sbEntPDjTmaw60sFSlqkIcJ044MXHGBoRkgcbrJuTJN6aIS0jSLW07_aRI51pmLKPeSHi9IWEQ5EjtwLGaJVhGnYaBItypAETA6DMiBvGP95_8U6WXgaAxReyxnw9vatAYAlXaSRdHtwGsOJlQkGWAIF5nxPkvvaOVCHYOGNEw5ySJL' },
    { name: 'Mist Tee', price: 120, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf' },
];

export default function ProductDetailPage() {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState('M');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addItem } = useCartStore();

    const handleAddToBag = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor.name,
        });
    };

    return (
        <div className="bg-white dark:bg-[#0F0F0F] text-black dark:text-gray-100 min-h-screen">
            {/* Main Product Section */}
            <main className="w-full flex flex-col lg:flex-row min-h-screen">
                {/* Image Gallery - Sticky on Desktop */}
                <div className="w-full lg:w-[62%] h-[80vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                    <Image
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-cover object-top"
                        priority
                    />

                    {/* Image Navigation */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/80 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/80 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Reference Number */}
                    <div className="absolute bottom-8 left-8 z-10 hidden lg:block">
                        <p className="text-[10px] uppercase tracking-widest text-white/70">Ref. {product.ref}</p>
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-24 right-6 w-10 h-10 bg-white/80 dark:bg-black/80 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info Panel */}
                <div className="w-full lg:w-[38%] bg-white dark:bg-[#0F0F0F] flex flex-col pt-12 pb-24 px-6 md:px-12 lg:pt-32 lg:px-16 overflow-y-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gray-400 mb-8">
                        <Link href="/shop" className="hover:text-black dark:hover:text-white">Shop</Link>
                        <span>/</span>
                        <Link href="/shop?category=outerwear" className="hover:text-black dark:hover:text-white">{product.category}</Link>
                        <span>/</span>
                        <span className="text-black dark:text-white">{product.name.split(' ')[1]}</span>
                    </div>

                    {/* Title & Price */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wide leading-tight mb-2">
                            {product.name}
                        </h1>
                        <p className="text-xl font-light tracking-wide">${product.price.toLocaleString()}</p>
                    </div>

                    {/* Description */}
                    <div className="mb-10 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <p className="text-sm font-light leading-relaxed text-gray-600 dark:text-gray-300">
                            {product.description}
                        </p>
                        <button className="mt-4 text-[10px] uppercase font-bold tracking-widest underline underline-offset-4 decoration-1 decoration-gray-300 hover:decoration-black dark:hover:decoration-white transition-all">
                            View Full Details
                        </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-8 mb-12">
                        {/* Color Selection */}
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest font-bold mb-3">
                                Color — {selectedColor.name}
                            </span>
                            <div className="flex space-x-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full hover:scale-110 transition-transform ${selectedColor.name === color.name
                                                ? 'ring-2 ring-offset-2 ring-black dark:ring-white'
                                                : 'border border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] uppercase tracking-widest font-bold">Size</span>
                                <button className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white underline decoration-dotted">
                                    Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-10 border flex items-center justify-center text-xs transition-colors ${selectedSize === size
                                                ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Add to Bag */}
                    <button
                        onClick={handleAddToBag}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:opacity-90 transition-opacity mb-4"
                    >
                        Add to Bag
                    </button>
                    <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider">
                        Free global shipping on orders over $500
                    </p>

                    {/* Styled With */}
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="font-display text-lg uppercase tracking-widest mb-6">Styled With</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {styledWith.map((item) => (
                                <Link key={item.name} href={`/shop/${item.slug}`} className="group">
                                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] uppercase tracking-wider font-bold group-hover:underline">
                                            {item.name}
                                        </span>
                                        <span className="text-[10px]">${item.price.toLocaleString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Campaign Section */}
            <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-black">
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_"
                    alt="Campaign Visual"
                    fill
                    className="object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6">
                    <h2 className="text-4xl md:text-7xl font-display uppercase tracking-widest mb-4 text-center">
                        In Motion
                    </h2>
                    <button className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <Play className="w-5 h-5 ml-0.5" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium">Watch Campaign</span>
                    </button>
                </div>
            </section>

            {/* Recently Viewed */}
            <section className="py-20 bg-white dark:bg-[#0F0F0F] border-b border-gray-100 dark:border-gray-900">
                <div className="container mx-auto px-6">
                    <h3 className="text-xl font-display uppercase tracking-widest mb-10 text-center md:text-left">
                        Recently Viewed
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {recentlyViewed.map((item) => (
                            <div key={item.name} className="group relative bg-white dark:bg-[#141414] overflow-hidden">
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xs font-display font-semibold uppercase tracking-wider">
                                            {item.name}
                                        </h3>
                                        <span className="text-xs font-light">${item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
