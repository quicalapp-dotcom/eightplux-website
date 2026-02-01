'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

// Mock Wishlist Data (since we don't have backend storage for it yet)
const MOCK_WISHLIST_ITEMS = [
    {
        id: '1',
        name: 'Oversized Graphic Tee',
        price: 45,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2836&auto=format&fit=crop',
        color: 'Black',
        size: 'L',
        inStock: true
    },
    {
        id: '2',
        name: 'Wide Leg Cargo Pants',
        price: 85,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2797&auto=format&fit=crop',
        color: 'Olive',
        size: '32',
        inStock: false
    }
];

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST_ITEMS);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const removeItem = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleAddToCart = (item: any) => {
        addItem({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            size: item.size,
            color: item.color
        });
        // Optionally show toast or feedback
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
                    {wishlistItems.length} Items Saved
                </p>

                {wishlistItems.length === 0 ? (
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
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative">
                                <div className="relative aspect-[3/4] bg-gray-100 dark:bg-[#141414] mb-4 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-2 rounded-full hover:bg-white dark:hover:bg-black transition-colors z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {!item.inStock && (
                                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                            <span className="bg-black text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Sold Out</span>
                                        </div>
                                    )}

                                    {/* Quick Add Overlay */}
                                    {item.inStock && (
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
                                    <p className="text-xs text-gray-500 mb-2">{item.color} / {item.size}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
