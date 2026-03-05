'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuth } from '@/contexts/AuthContext';
import { getProductBySlug } from '@/lib/firebase/products';
import { Product, ProductColor } from '@/types';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

// Mock data for fallback
const fallbackStyledWith = [
    { name: 'Silk Trouser', price: 110, image: '/lt.jpg', slug: 'silk-trouser' },
    { name: 'Derby Boot', price: 135, image: '/Model2.jpg', slug: 'derby-boot' },
    { name: 'Technical Coat', price: 250, image: '/tg.jpg', slug: 'technical-coat' },
];

const fallbackRecentlyViewed = [
    { name: 'Cashmere Hoodie', price: 89, image: '/bg.jpg' },
    { name: 'Calfskin Jacket', price: 245, image: '/bb.jpg' },
    { name: 'Studio Knit', price: 65, image: '/Model3.jpg' },
    { name: 'Mist Tee', price: 12, image: '/Model1.jpg' },
];

const mockProduct: Product = {
    id: 'mock-1',
    name: 'Waistcoat with Pockets',
    slug: 'waistcoat-pockets',
    price: 49.90,
    fabric: 'Technical',
    images: ['/Model1.jpg', '/Model2.jpg', '/Model3.jpg'],
    colors: [{ name: 'Black', hex: '#000000' }, { name: 'Grey', hex: '#808080' }],
    isNew: true,
    isBestSeller: false,
    isSale: false,
    category: 'women',
    collectionId: 'mock-collection',
    currency: 'USD',
    description: 'Round neck waistcoat featuring front welt pockets, contrast trims, a pleat in the back and metal appliqué fastening in the front.',
    inventory: 10,
    sizes: ['S', 'M', 'L'],
    tags: [],
    gender: 'women',
    createdAt: new Date(),
    updatedAt: new Date()
};


export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addItem, showNotification } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await getProductBySlug(slug);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    if (fetchedProduct.colors.length > 0) {
                        setSelectedColor(fetchedProduct.colors[0]);
                    }
                } else {
                    // Use mock product as fallback if not found in DB
                    setProduct(mockProduct);
                    setSelectedColor(mockProduct.colors[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const handleAddToBag = () => {
        if (!product || !selectedColor) return;

        const newItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor.name,
            quantity: 1,
        };

        addItem(newItem);
        showNotification(newItem);
    };

    const handleWishlistToggle = () => {
        if (!product || !user) return;

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id, user.uid);
        } else {
            addToWishlist(product.id, user.uid);
        }
    };

    // Click outside handler for size dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSizeDropdownOpen(false);
            }
        };

        if (isSizeDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSizeDropdownOpen]);

    if (loading) {
        return (
            <div className="bg-white text-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black mx-auto mb-4"></div>
                    <p className="text-sm uppercase tracking-widest text-gray-500">Loading product</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-white text-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
                    <Link href="/shop" className="inline-block px-8 py-4 bg-black text-white uppercase tracking-[0.2em] text-xs font-bold hover:opacity-90 transition-opacity">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const categoryLink = product.category === 'women' ? '/shop/women' : '/shop/men';

    return (
        <>
        <div className="bg-white text-black min-h-screen pt-[81px]">
            {/* Main Product Section */}
            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Image Gallery (Left) */}
                    <div className="flex-1 flex gap-4 h-fit">
                        {/* Thumbnails (Vertical) */}
                        <div className="hidden md:flex flex-col gap-4 w-24">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`aspect-[3/4] relative border border-gray-100 overflow-hidden ${currentImageIndex === idx ? 'ring-1 ring-black' : ''}`}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 aspect-[3/4] relative bg-[#F6F6F6] border border-gray-100 overflow-hidden">
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Product Info (Right) */}
                    <div className="w-full lg:w-[450px] shrink-0 space-y-10">
                        {/* Breadcrumbs */}
                        <nav className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            <Link href="/shop" className="hover:text-black">Shop</Link> / <Link href={categoryLink} className="hover:text-black">{product.category === 'women' ? 'Women' : 'Men'}</Link> / {product.category}
                        </nav>

                        {/* Title & Price */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] leading-[1.1]">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold tracking-widest">
                                ${product.price}
                            </p>
                        </div>

                        {/* Description & Summary Grid */}
                        <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 pb-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</h4>
                                <p className="text-[10px] font-bold tracking-widest leading-relaxed opacity-60">
                                    {product.description || "Round neck waistcoat featuring front welt pockets, contrast trims, a pleat in the back and metal appliqué fastening in the front."}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Summary</h4>
                                <div className="text-[10px] font-bold tracking-widest leading-relaxed opacity-60 space-y-1">
                                    <p>Color: {selectedColor?.name || 'Navy Blue'}</p>
                                    <p>Height of model: 177 cm. / 5' 9"</p>
                                    <p className="opacity-40">{product.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-6 relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                                className="flex justify-between items-center border border-gray-100 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all group"
                            >
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors">Choose size</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{selectedSize || '-'}</span>
                                    <span className={`text-[8px] transition-transform duration-300 ${isSizeDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                                </div>
                            </div>

                            {/* Custom Dropdown List */}
                            {isSizeDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 z-20 bg-white border border-t-0 border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setIsSizeDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleAddToBag}
                                className="w-full bg-[#333] text-white py-4 uppercase font-bold tracking-[0.2em] text-[10px] flex justify-between px-8 items-center hover:bg-black transition-colors"
                            >
                                Add to cart <span className="text-xl">+</span>
                            </button>
                        </div>

                        {/* Match With Section - Mock fallbacks */}
                        <div className="border-t border-gray-100 pt-12 mt-12 pb-20">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 mb-10">Match with</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {fallbackStyledWith.map((item) => (
                                    <Link key={item.name} href={`/shop/product/${item.slug}`} className="group space-y-4">
                                        <div className="aspect-[3/4] bg-[#F6F6F6] relative border border-gray-100 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1 uppercase tracking-widest font-bold">
                                            <h4 className="text-[9px] leading-tight text-gray-400 group-hover:text-black transition-colors">
                                                {item.name}
                                            </h4>
                                            <div className="flex gap-2 text-[9px]">
                                                <span>${item.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <button className="w-full bg-[#333] text-white py-4 uppercase font-bold tracking-[0.2em] text-[10px] mt-10 hover:bg-black transition-colors text-center">
                                Go to cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* You Can Also Check Section - Mock fallbacks */}
                <div className="mt-32 border-t border-gray-100 pt-20">
                    <h1 className="text-lg font-bold uppercase tracking-[0.1em] mb-12 px-2">You can also check</h1>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {fallbackRecentlyViewed.map((item, idx) => (
                            <Link key={idx} href={`/shop/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] mb-6 bg-[#F6F6F6] overflow-hidden border border-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="space-y-2 uppercase tracking-widest text-[10px] font-bold px-2">
                                    <h3 className="leading-tight text-gray-500 group-hover:text-black transition-colors">{item.name}</h3>
                                    <p>${item.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
        <WorldSection image="/community.gif" />
        <NewsletterSection />
        </>
    );
}
