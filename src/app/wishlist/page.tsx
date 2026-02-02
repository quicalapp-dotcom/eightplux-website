'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useWishlistSync } from '@/lib/firebase/wishlist';
import { getProduct } from '@/lib/firebase/products';
import { Product } from '@/types';

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { addItem: addToCart } = useCartStore();
    const { items: wishlistItemIds, removeItem: removeFromWishlist } = useWishlistStore();
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

    useWishlistSync();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (user) {
                const products = await Promise.all(
                    wishlistItemIds.map(item => getProduct(item.productId))
                );
                setWishlistProducts(products.filter(p => p !== null) as Product[]);
            }
        };

        fetchWishlistProducts();
    }, [wishlistItemIds, user]);

    const handleRemoveItem = (productId: string) => {
        if (user) {
            removeFromWishlist(productId, user.uid);
        }
    };

    const handleAddToCart = (item: Product) => {
        addToCart({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.images[0],
            quantity: 1,
            size: 'L', // Default size, you might want to change this
            color: 'Black' // Default color, you might want to change this
        });
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-display text-4xl md:text-5xl mb-2 text-center">Your Wishlist</h1>
                <p className="text-gray-500 text-center uppercase tracking-widest text-xs mb-12">
                    {wishlistProducts.length} Items Saved
                </p>

                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                        <Heart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <h2 className="text-xl font-medium mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save items you love to shop later. Syncs across all your devices.</p>
                        <Link href="/shop" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-xs font-bold tracking-widest hover:opacity-90 transition-opacity">
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {wishlistProducts.map((item) => (
                            <div key={item.id} className="group relative">
                                <div className="relative aspect-[3/4] bg-gray-100 dark:bg-[#141414] mb-4 overflow-hidden">
                                    <Image
                                        src={item.images[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-2 rounded-full hover:bg-white dark:hover:bg-black transition-colors z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Quick Add Overlay */}
                                    { (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 text-xs font-bold uppercase tracking-widest translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                                        >
                                            <ShoppingBag className="w-3 h-3" /> Add to Bag
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        <span className="text-sm font-medium">${item.price}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
