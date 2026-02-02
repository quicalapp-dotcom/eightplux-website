'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
    product: Product;
    showQuickAdd?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuth();
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            // Redirect to login or show a modal
            return;
        }
        if (isWishlisted) {
            removeItem(product.id, user.uid);
        } else {
            addItem(product.id, user.uid);
        }
    };

    const primaryImage = product.images[0];
    const hoverImage = product.images[1] || product.images[0];

    return (
        <div
            className="group product-card cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] mb-4 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {/* Badges */}
                    {product.isNew && (
                        <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                            New In
                        </div>
                    )}
                    {product.isBestSeller && !product.isNew && (
                        <div className="absolute top-2 left-2 z-10 border border-black dark:border-white bg-transparent text-black dark:text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                            Best Seller
                        </div>
                    )}
                    {product.isSale && product.compareAtPrice && (
                        <div className="absolute top-2 left-2 z-10 bg-red-700 text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
                            Sale
                        </div>
                    )}

                    {/* Images */}
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <Image
                        src={hoverImage}
                        alt={`${product.name} alternate view`}
                        fill
                        className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Quick Add Button */}
                    {showQuickAdd && (
                        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
                            <button className="bg-white/90 backdrop-blur text-black w-full py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                                Quick Add
                            </button>
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Heart
                            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                        />
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex justify-between items-start">
                <div>
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-display text-lg leading-tight mb-1 group-hover:underline underline-offset-4 decoration-1">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.fabric || product.subcategory}
                    </p>
                </div>
                <div className="text-right">
                    {product.isSale && product.compareAtPrice ? (
                        <>
                            <span className="font-display text-sm text-red-700">${product.price.toLocaleString()}</span>
                            <span className="font-display text-xs line-through text-gray-400 block">
                                ${product.compareAtPrice.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="font-display text-sm">${product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>

            {/* Color Swatches */}
            {product.colors.length > 0 && (
                <div className="flex gap-1 mt-2">
                    {product.colors.slice(0, 4).map((color) => (
                        <div
                            key={color.name}
                            className="w-2 h-2 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
