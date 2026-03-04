'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/stores/cartStore';
import { Collection } from '@/types';
import { subscribeToCollections } from '@/lib/firebase/admin';

const baseNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop', dropdown: [
        { name: 'New Releases', href: '/shop?filter=new' },
        { name: 'Women', href: '/shop/women' },
        { name: 'Men', href: '/shop/men' },
        { name: 'Hoodies', href: '/shop?category=hoodies' },
        { name: 'Shirts', href: '/shop?category=shirts' },
        { name: 'Pants', href: '/shop?category=pants' },
        { name: 'Accessories', href: '/shop?category=accessories' },
    ]},
    { name: 'Campaign', href: '/campaigns' },
    { name: 'The World Of 8+', href: '/world', dropdown: [
        { name: 'Eightplux World', href: '/world' },
    ]},
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);

    const { user, loading, isAdmin } = useAuth();
    const { getItemCount } = useCartStore();
    const itemCount = getItemCount();

    useEffect(() => {
        setMounted(true);
        const unsubscribe = subscribeToCollections(setCollections);
        return () => unsubscribe();
    }, []);

    const navLinks = baseNavLinks.map(link => {
        if (link.name === 'Shop' && link.dropdown) {
            return {
                ...link,
                dropdown: [
                    ...link.dropdown,
                    ...collections
                        .map(c => ({ name: c.name, href: `/shop/collections/${c.slug}` }))
                        .filter(item => !link.dropdown!.some(l => l.name === item.name))
                ]
            };
        }
        return link;
    });

    if (!mounted) return null;

    return (
        <>
            {/* ── Desktop Navbar ───────────────────────────────────────────── */}
            <nav className="absolute top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="mx-auto px-4 md:px-10 h-[60px] flex items-center relative">

                    {/* LEFT — Nav links */}
                    <div className="hidden md:flex items-center gap-7 flex-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={`text-[11px] font-semibold tracking-widest uppercase flex items-center gap-0.5 transition-colors ${
                                            isActive ? 'text-[#C72f32]' : 'text-black hover:text-[#C72f32]'
                                        }`}
                                    >
                                        {link.name}
                                        {link.dropdown && <ChevronDown className="w-3 h-3" />}
                                    </Link>

                                    <AnimatePresence>
                                        {link.dropdown && activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute top-full left-0 mt-3 bg-white border border-gray-100 shadow-lg min-w-[200px]"
                                            >
                                                <div className="py-3">
                                                    {link.dropdown.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className="block px-5 py-2 text-[10px] uppercase tracking-widest text-gray-600 hover:text-[#C72f32] hover:bg-gray-50 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* CENTER — Logo (absolute so it's truly centred) */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
                        <Image
                            src="/EIghtplu+ logo.png"
                            alt="Eightplux Logo"
                            width={
143}
                            height={17.09}
                            className="object-contain"
                        />
                    </Link>

                    {/* RIGHT — Icons */}
                    <div className="flex items-center gap-1.5 md:gap-5 ml-auto">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="text-black hover:text-[#C72f32] transition-colors"
                        >
                            <Search className="w-[18px] h-[18px]" />
                        </button>

                        {/* Cart */}
                        <Link href="/cart" className="relative text-black hover:text-[#C72f32] transition-colors group">
                            <ShoppingBag className="w-[18px] h-[18px]" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-[#C72f32] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* User / Account */}
                        {loading ? (
                            <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse hidden md:block" />
                        ) : user ? (
                            <div className="hidden md:flex items-center gap-4">
                                {isAdmin && (
                                    <Link href="/admin" className="text-black hover:text-[#C72f32] transition-colors" title="Admin Dashboard">
                                        <Shield className="w-[18px] h-[18px]" />
                                    </Link>
                                )}
                                <Link href="/account" className="text-black hover:text-[#C72f32] transition-colors" title="My Account">
                                    <User className="w-[18px] h-[18px]" />
                                </Link>
                            </div>
                        ) : (
                            <Link href="/login" className="text-black hover:text-[#C72f32] transition-colors hidden md:block">
                                <User className="w-[18px] h-[18px]" />
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            className="md:hidden text-black"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-12">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <Image
                                        src="/EIghtplu+ logo.png"
                                        alt="Eightplux Logo"
                                        width={64}
                                        height={64}
                                        className="object-contain"
                                    />
                                </Link>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-[#C72f32]" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-2xl font-bold uppercase tracking-wide mb-2 text-black hover:text-[#C72f32] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="pl-4 space-y-3 border-l-2 border-gray-100">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block text-sm text-gray-600 hover:text-[#C72f32] transition-colors uppercase tracking-widest"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-gray-100 flex justify-between">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C72f32]"
                                    >
                                        <Shield className="w-4 h-4" /> Admin
                                    </Link>
                                )}
                                <Link
                                    href={user ? '/account' : '/login'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#C72f32] transition-colors"
                                >
                                    <User className="w-4 h-4" /> {user ? 'Account' : 'Login'}
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#C72f32] transition-colors"
                                >
                                    <Heart className="w-4 h-4" /> Wishlist
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Search Modal ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-start justify-center pt-32"
                    >
                        <div className="w-full max-w-2xl px-6 relative">
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute -top-12 right-6 md:-right-12"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="flex items-center border-b-2 border-black pb-4">
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
                                            className="px-4 py-2 border border-gray-200 text-sm hover:bg-black hover:text-white transition-colors"
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
