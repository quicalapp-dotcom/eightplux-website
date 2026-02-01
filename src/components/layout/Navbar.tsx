'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { clsx } from 'clsx';

const navLinks = [
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);

    const { openCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Always transparent navbar with subtle background on scroll
    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center transition-all duration-300',
                    isScrolled
                        ? 'bg-black/80 backdrop-blur-sm text-white'
                        : 'bg-gradient-to-b from-black/80 to-transparent text-white'
                )}
            >
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center group">
                    <span className="font-logo text-2xl md:text-3xl tracking-widest font-semibold flex items-center gap-1">
                        EIGHTPLU<span className="text-primary text-3xl md:text-4xl">+</span>
                    </span>
                    <span className="text-[8px] tracking-[0.3em] font-sans text-gray-400 group-hover:text-primary transition-colors duration-300 hidden md:block">
                        EST 2022
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-12 text-xs uppercase tracking-[0.2em] font-medium">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative"
                            onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className={clsx(
                                    'hover:opacity-70 transition-opacity flex items-center gap-1',
                                    pathname === link.href && 'underline underline-offset-8 decoration-1'
                                )}
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
                                        className="absolute top-full left-0 mt-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg min-w-[200px]"
                                    >
                                        <div className="py-4">
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block px-6 py-2 text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
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

                {/* Right Icons */}
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="hover:opacity-70 transition-opacity"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <Link href="/account" className="hover:opacity-70 transition-opacity hidden sm:block">
                        <User className="w-5 h-5" />
                    </Link>

                    <Link href="/wishlist" className="hover:opacity-70 transition-opacity hidden sm:block">
                        <Heart className="w-5 h-5" />
                    </Link>

                    <button
                        onClick={openCart}
                        className="hover:opacity-70 transition-opacity relative"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden hover:opacity-70 transition-opacity"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav >

            {/* Mobile Menu */}
            <AnimatePresence>
                {
                    mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 md:hidden"
                        >
                            <div className="space-y-8">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-2xl font-display uppercase tracking-wide"
                                        >
                                            {link.name}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="mt-4 ml-4 space-y-3">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block text-sm text-gray-500"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-12 left-6 right-6 flex justify-between">
                                <Link href="/account" className="text-xs uppercase tracking-widest">
                                    Account
                                </Link>
                                <Link href="/wishlist" className="text-xs uppercase tracking-widest">
                                    Wishlist
                                </Link>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Search Modal */}
            <AnimatePresence>
                {
                    searchOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-white dark:bg-black flex items-start justify-center pt-32"
                        >
                            <div className="w-full max-w-2xl px-6">
                                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                                    <Search className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        autoFocus
                                        className="flex-1 ml-4 bg-transparent text-2xl font-light focus:outline-none"
                                    />
                                    <button onClick={() => setSearchOpen(false)}>
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="mt-8">
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Popular Searches</p>
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
                    )
                }
            </AnimatePresence >
        </>
    );
}
