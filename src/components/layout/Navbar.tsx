'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/stores/cartStore';
import { clsx } from 'clsx';
import { Collection } from '@/types';
import { subscribeToCollections } from '@/lib/firebase/admin';

const baseNavLinks = [
    { name: 'Home', href: '/' },
    {
        name: 'Shop',
        href: '/shop',
        dropdown: [
            { name: 'New Releases', href: '/shop?filter=new' },
            { name: 'Women', href: '/shop/women' },
            { name: 'Men', href: '/shop/men' },
            { name: 'Hoodies', href: '/shop?category=hoodies' },
            { name: 'Shirts', href: '/shop?category=shirts' },
            { name: 'Pants', href: '/shop?category=pants' },
            { name: 'Accessories', href: '/shop?category=accessories' },
            { name: 'Shop Looks', href: '/shop/looks' },
        ]
    },
    { name: 'Campaign', href: '/campaigns' },
    { name: 'World of 8+', href: '/world' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);

    const { user, loading, isAdmin } = useAuth();
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Fetch collections
        const unsubscribe = subscribeToCollections(setCollections);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    // Generate nav links with dynamic collections
    const navLinks = baseNavLinks.map(link => {
        if (link.name === 'Shop' && link.dropdown) {
            return {
                ...link,
                dropdown: [
                    ...link.dropdown,
                    ...collections.map(collection => ({
                        name: collection.name,
                        href: `/shop/collections/${collection.slug}`
                    })).filter(item => !link.dropdown.some(linkItem => linkItem.name === item.name))
                ]
            };
        }
        return link;
    });

    if (!mounted) return null;

    return (
        <>
            <nav className={clsx(
                'fixed w-full z-50 transition-all duration-500',
                scrolled ? 'bg-white/90 dark:bg-gray-200/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
            )}>
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between">
                    
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-red-500" />
                    </button>

                    {/* Left - Menu (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative"
                                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                >
                                    {link.name}
                                    {link.dropdown && <ChevronDown className="w-3 h-3" />}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {link.dropdown && activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-4 bg-white border border-gray-200 shadow-lg min-w-[200px]"
                                        >
                                            <div className="py-4">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-6 py-2 text-[10px] uppercase tracking-widest text-black hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Center - Logo */}
                    <Link href="/" className={clsx(
                        'group',
                        'md:absolute md:left-1/2 md:transform md:-translate-x-1/2'
                    )}>
                        <div className="flex flex-col items-center">
                            <span className="font-display text-xl md:text-2xl lg:text-3xl tracking-widest font-semibold flex items-center gap-1">
                                <Image
                                    src="/Copy of 8+ red logo.png"
                                    alt="Eightplux Logo"
                                    width={30}
                                    height={30}
                                    className="object-contain md:w-[45px] md:h-[45px]"
                                />
                                EIGHTPLU<span className="text-[#D32F2F] text-2xl md:text-3xl lg:text-4xl">+</span>
                            </span>
                        </div>
                    </Link>

                    {/* Right - Icons */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* User Account / Login */}
                        {loading ? (
                            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse hidden md:block"></div>
                        ) : user ? (
                            <div className="flex items-center space-x-6 hidden md:flex">
                                {isAdmin && (
                                    <Link href="/admin" className="text-red-500 hover:text-red-600 transition-colors" title="Admin Dashboard">
                                        <Shield className="w-5 h-5" />
                                    </Link>
                                )}
                                <Link href="/account" className="text-red-500 hover:text-red-600 transition-colors" title="My Account">
                                    <User className="w-5 h-5" />
                                </Link>
                            </div>
                        ) : (
                            <Link href="/login" className="text-red-500 hover:text-red-600 transition-colors hidden md:block">
                                <User className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link href="/wishlist" className="text-red-500 hover:text-red-600 transition-colors hidden md:block">
                            <Heart className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <button onClick={toggleCart} className="relative text-red-500 hover:text-red-600 transition-colors group">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-[#CCCCCC] md:hidden overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-12">
                                <span className="font-display text-xl flex items-center gap-1">
                                    <Image
                                        src="/Copy of 8+ red logo.png"
                                        alt="Eightplux Logo"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                    EIGHTPLU<span className="text-red-600">+</span>
                                </span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-red-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-2xl font-display uppercase tracking-wide mb-2 text-red-500"
                                        >
                                            {link.name}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="pl-4 space-y-3 border-l-2 border-[#F4F1E9] bg-[#F4F1E9]">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block text-sm text-black hover:text-red-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-[#F4F1E9] flex justify-between">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500"
                                    >
                                        <Shield className="w-4 h-4" /> Admin
                                    </Link>
                                )}
                                <Link
                                    href={user ? "/account" : "/login"}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500"
                                >
                                    <User className="w-4 h-4" /> {user ? "Account" : "Login"}
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500"
                                >
                                    <Heart className="w-4 h-4" /> Wishlist
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm flex items-start justify-center pt-32"
                    >
                        <div className="w-full max-w-2xl px-6 relative">
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute -top-12 right-6 md:-right-12"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="flex items-center border-b-2 border-black dark:border-white pb-4">
                                <Search className="w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    autoFocus
                                    className="flex-1 ml-4 bg-transparent text-xl md:text-3xl font-display placeholder-gray-300 focus:outline-none"
                                />
                            </div>

                            <div className="mt-8">
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Popular Searches</p>
                                <div className="flex flex-wrap gap-3">
                                    {['Trench', 'Hoodie', 'Leather', 'New Arrivals'].map((term) => (
                                        <Link
                                            key={term}
                                            href={`/shop?q=${term}`}
                                            onClick={() => setSearchOpen(false)}
                                            className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                        >
                                            {term}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
