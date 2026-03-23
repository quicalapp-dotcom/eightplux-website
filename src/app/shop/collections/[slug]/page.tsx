'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Product, SubCollection, Collection } from '@/types';
import { getSubCollectionBySlug, getProductsBySubCollection } from '@/lib/firebase/subCollections';
import { getCollectionById } from '@/lib/firebase/collections';
import { useCurrencyStore } from '@/stores/currencyStore';

export default function CollectionPage() {
    const { formatPrice } = useCurrencyStore();
    const params = useParams();
    const router = useRouter();
    const [subCollection, setSubCollection] = useState<SubCollection | null>(null);
    const [parentCollection, setParentCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedSubCollection = await getSubCollectionBySlug(params.slug as string);
                if (!fetchedSubCollection) {
                    router.push('/shop');
                    return;
                }
                setSubCollection(fetchedSubCollection);
                
                // Get parent collection info
                const parentCol = await getCollectionById(fetchedSubCollection.collectionId);
                setParentCollection(parentCol);
                
                const fetchedProducts = await getProductsBySubCollection(fetchedSubCollection.id);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching sub-collection data:', error);
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchData();
        }
    }, [params.slug, router]);

    const filteredProducts = products;

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-[81px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!subCollection) {
        return null;
    }

    return (
        <div className="bg-white min-h-screen pt-[81px]">
            {/* Hero Image */}
            {subCollection.image && (
                <div className="relative w-full h-[300px] md:h-[400px]">
                    {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(subCollection.image) ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            src={subCollection.image}
                        />
                    ) : (
                        <Image
                            src={subCollection.image}
                            alt={subCollection.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-[0.2em]">
                            {subCollection.name}
                        </h1>
                    </div>
                </div>
            )}

            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                {/* Collection Info (if no hero image) */}
                {!subCollection.image && (
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.1em] mb-4">
                            {subCollection.name}
                        </h1>
                        {parentCollection && (
                            <p className="text-gray-500 text-sm uppercase tracking-widest">
                                Part of {parentCollection.name}
                            </p>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map((product) => (
                            <Link 
                                key={product.id} 
                                href={`/shop/product/${product.slug}`}
                                className="group"
                            >
                                <div className="aspect-[3/4] relative bg-[#F6F6F6] mb-4 overflow-hidden">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {product.isNew && (
                                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            New
                                        </div>
                                    )}
                                    {product.isSale && (
                                        <div className="absolute top-4 right-4 bg-[#C72f32] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            Sale
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold uppercase tracking-widest">{product.name}</h3>
                                    <div className="flex gap-2 text-sm">
                                        <span className={product.isSale ? 'text-[#C72f32]' : ''}>
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.isSale && product.compareAtPrice && (
                                            <span className="text-gray-400 line-through">
                                                {formatPrice(product.compareAtPrice)}
                                            </span>
                                        )}
                                    </div>
                                    {product.colors.length > 1 && (
                                        <div className="flex gap-1">
                                            {product.colors.slice(0, 4).map((color, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-3 h-3 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-sm uppercase tracking-widest">
                            No products found in this collection
                        </p>
                        <Link 
                            href="/shop" 
                            className="inline-block mt-4 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
