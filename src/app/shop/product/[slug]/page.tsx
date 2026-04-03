'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrencyStore } from '@/stores/currencyStore';
import { getProductBySlug, getProducts } from '@/lib/firebase/products';
import { addNotifyMeRequest } from '@/lib/firebase/notifyMe';
import { Product, ProductColor } from '@/types';
import WorldSection from '@/components/home/WorldSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    // Decode the slug to handle any URL-encoded characters
    const slug = params.slug ? decodeURIComponent(params.slug as string) : '';
    const { formatPrice } = useCurrencyStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Auto-sliding functionality
    useEffect(() => {
        if (!product || product.images.length <= 1) return;
        
        const interval = setInterval(() => {
            if (!isDragging) {
                setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
            }
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [product, isDragging]);

    // Touch/Mouse event handlers for manual sliding
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setDragOffset(0);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        setDragOffset(clientX - startX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (Math.abs(dragOffset) > 50) {
            if (dragOffset > 0 && currentImageIndex > 0) {
                setCurrentImageIndex((prev) => prev - 1);
            } else if (dragOffset < 0 && currentImageIndex < (product?.images.length || 1) - 1) {
                setCurrentImageIndex((prev) => prev + 1);
            }
        }
        setDragOffset(0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleDragEnd();
        }
    };

    const { addItem, showNotification } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const { user } = useAuth();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await getProductBySlug(slug);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    if (fetchedProduct.colors.length > 0) {
                        setSelectedColor(fetchedProduct.colors[0]);
                    }
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

    // Fetch related products
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const allProducts = await getProducts();
                // Filter out current product and take first 4 products as "related"
                const filtered = allProducts
                    .filter(p => p.slug !== slug)
                    .slice(0, 4);
                setRelatedProducts(filtered);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [slug]);

    const [selectionError, setSelectionError] = useState('');

    const handleAddToBag = () => {
        if (!product) return;
        
        setSelectionError('');

        if (product.sizes.length > 0 && !selectedSize) {
            setSelectionError('please select a size before adding to bag');
            return;
        }

        if (product.colors.length > 0 && !selectedColor) {
            setSelectionError('please select a color before adding to bag');
            return;
        }

        const newItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor?.name || '',
            quantity: 1,
        };

        addItem(newItem);
        showNotification(newItem);
    };

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [emailInput, setEmailInput] = useState('');

    const handleNotifyMe = async () => {
        if (!product) return;

        if (user) {
            // For signed in users, use their stored email
            try {
                await addNotifyMeRequest({
                    productId: product.id,
                    productName: product.name,
                    email: user.email || '',
                    userId: user.uid,
                });

                // Send confirmation email
                await fetch('/api/notify-me/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.email,
                        productName: product.name
                    }),
                });

                alert('Thank you! You will be notified when this product is available.');
            } catch (error) {
                console.error('Error adding notify me request:', error);
                alert('Failed to add notification. Please try again.');
            }
        } else {
            // For guest users, show email input form
            setShowEmailForm(true);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!product) {
            alert('Product not found');
            return;
        }
        
        if (!emailInput.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            await addNotifyMeRequest({
                    productId: product.id,
                    productName: product.name,
                    email: emailInput,
                    userId: user?.uid || undefined,
                });

            // Send confirmation email
            await fetch('/api/notify-me/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput,
                    productName: product.name
                }),
            });

            setShowEmailForm(false);
            setEmailInput('');
            alert('Thank you! You will be notified when this product is available.');
        } catch (error) {
            console.error('Error adding notify me request:', error);
            alert('Failed to add notification. Please try again.');
        }
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

    const categoryLink = product.category === 'female' ? '/shop/female' : product.category === 'male' ? '/shop/male' : '/shop';

    return (
        <>
        <div className="bg-white text-black min-h-screen pt-[81px]">
            {/* Main Product Section */}
            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Image Gallery (Left) */}
                    <div className="flex-1 flex gap-4 h-fit">
                        {/* Thumbnails (Vertical) - Desktop Only */}
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

                        {/* Main Image with Mobile Carousel */}
                        <div className="flex-1 relative">
                            <div 
                                ref={carouselRef}
                                className="aspect-[3/4] relative bg-[#F6F6F6] border border-gray-100 overflow-hidden cursor-grab active:cursor-grabbing"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Image
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-300"
                                    style={{ transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'none' }}
                                    priority
                                    draggable={false}
                                />
                                
                                {/* Previous/Next Arrow Buttons - Desktop */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
                                            }}
                                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
                                            }}
                                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Navigation Dots - Mobile Only */}
                            {product.images.length > 1 && (
                                <div className="flex md:hidden justify-center gap-2 mt-4">
                                    {product.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                currentImageIndex === idx 
                                                    ? 'bg-black w-6' 
                                                    : 'bg-gray-300'
                                            }`}
                                            aria-label={`Go to image ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info (Right) */}
                    <div className="w-full lg:w-[450px] shrink-0 space-y-10">
                        {/* Breadcrumbs */}
                        <nav className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            <Link href="/shop" className="hover:text-black">Shop</Link> / <Link href={categoryLink} className="hover:text-black">{product.category === 'female' ? 'Women' : product.category === 'male' ? 'Men' : 'Unisex'}</Link> / {product.category}
                        </nav>

                        {/* Title & Price */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] leading-[1.1]">
                                {product.name}
                            </h1>
                            {product.isComingSoon && (
                                <div className="inline-block bg-[#C72f32] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest">
                                    Coming Soon
                                </div>
                            )}
                            <p className="text-2xl font-bold tracking-widest">
                                {formatPrice(product.price)}
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
                                </div>
                            </div>
                        </div>

                        {/* Size & Fit */}
                        {product.sizeFit && (
                            <div className="border-t border-gray-100 pt-8 pb-4">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Size & Fit</h4>
                                <p className="text-[10px] font-bold tracking-widest leading-relaxed opacity-60">
                                    {product.sizeFit}
                                </p>
                            </div>
                        )}

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
                                                setSelectionError('');
                                            }}
                                            className="w-full text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectionError && (
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C72f32] animate-pulse">
                                    {selectionError}
                                </p>
                            )}

                            {product.isComingSoon ? (
                                showEmailForm ? (
                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        <input
                                            type="email"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 uppercase font-bold tracking-[0.2em] text-[10px] bg-[#333] text-white hover:bg-black transition-colors"
                                            >
                                                Notify Me
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEmailForm(false);
                                                    setEmailInput('');
                                                }}
                                                className="px-4 py-3 uppercase font-bold tracking-[0.2em] text-[10px] bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={handleNotifyMe}
                                        className="w-full py-4 uppercase font-bold tracking-[0.2em] text-[10px] flex justify-center px-8 items-center transition-colors bg-[#333] text-white hover:bg-black"
                                    >
                                        Notify Me When Ready
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={handleAddToBag}
                                    disabled={product.inventory <= 0}
                                    className={`w-full py-4 uppercase font-bold tracking-[0.2em] text-[10px] flex justify-between px-8 items-center transition-colors ${
                                        product.inventory <= 0 
                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                            : 'bg-[#333] text-white hover:bg-black'
                                    }`}
                                >
                                    {product.inventory <= 0 ? 'Sold Out' : 'Add to cart'} 
                                    {product.inventory > 0 && <span className="text-xl">+</span>}
                                </button>
                            )}
                        </div>

                        {/* End of product info column */}
                    </div>
                </div>

                {/* You Can Also Check Section - Real products from Firebase */}
                <div className="mt-32 border-t border-gray-100 pt-20">
                    <h1 className="text-lg font-bold uppercase tracking-[0.1em] mb-12 px-2">You can also check</h1>
                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((item) => (
                                <Link key={item.id} href={`/shop/product/${item.slug}`} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] mb-6 bg-[#F6F6F6] overflow-hidden border border-gray-100">
                                        <Image
                                            src={item.images[0]}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-2 uppercase tracking-widest text-[10px] font-bold px-2">
                                        <h3 className="leading-tight text-gray-500 group-hover:text-black transition-colors">{item.name}</h3>
                                        <p>{formatPrice(item.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm uppercase tracking-widest">No products available</p>
                    )}
                </div>
            </main>
        </div>
        <WorldSection image="/community.gif" />
        <NewsletterSection />
        </>
    );
}
