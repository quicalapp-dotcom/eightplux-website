'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Sign Up:', { name, email, password, newsletter });
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-gray-100 font-sans min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-gray-50/90 dark:bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="hidden md:flex space-x-8 text-xs font-medium tracking-widest uppercase">
                        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-red-600 transition-colors">Shop</Link>
                    </div>

                    {/* Logo - Center */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 text-center group cursor-pointer">
                        <div className="flex flex-col items-center">
                            <span className="font-logo text-2xl md:text-3xl tracking-widest font-semibold flex items-center gap-1">
                                EIGHTPLU<span className="text-primary text-3xl md:text-4xl">+</span>
                            </span>
                            <span className="text-[8px] tracking-[0.3em] font-sans text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
                                EST 2022
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex text-xs font-medium tracking-widest uppercase">
                            <Link href="/login" className="hover:text-red-600 transition-colors text-gray-400">Login</Link>
                            <span className="text-red-600 mx-2">/</span>
                            <span className="text-red-600 border-b border-red-600 pb-0.5">Sign Up</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow flex w-full pt-20">
                {/* Left Side - Editorial Image */}
                <div className="hidden lg:block w-1/2 relative h-[calc(100vh-80px)] overflow-hidden bg-gray-100 dark:bg-black">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjmEAolBz4kn73s9tH_a4nPpCD23hoObbijpVB1UJKpGIEd-objRVCr-8e259_S2xvsYMMwwhSRNzaSnNPFeBsxeY2RrXS55KHFX1v3wQhyruPnPkUE5Mv7XcPg9Zct5X-Yp8amHcq08DbseyuSsk9HQbJYy6mhyP17M8IcQOe_8_1DdlS-hM9B1Ou5feZGZQ8Vys0SgCxTENSl35M849IS8QbzaMiOgNletSeBmNjfb7VGS6r8HdVMY-xnfjqgtdB49P9FqkeQBRG"
                        alt="Editorial fashion"
                        fill
                        className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-12 left-12 text-white z-10 max-w-md">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-white/80">Membership</p>
                        <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-4">
                            Join the<br /><span className="italic font-light">Inner Circle</span>
                        </h2>
                        <p className="text-sm font-light text-gray-200 leading-relaxed tracking-wide">
                            Gain exclusive access to pre-releases, private sales, and curated editorial content. Be part of the movement.
                        </p>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50 dark:bg-[#0A0A0A] relative">
                    <div className="w-full max-w-md">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="font-display text-3xl md:text-4xl mb-3">Create Account</h1>
                            <p className="text-xs text-gray-500 tracking-wide uppercase">Enter your details to register</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-red-600 focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-red-600 focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1 relative">
                                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-red-600 focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={newsletter}
                                        onChange={(e) => setNewsletter(e.target.checked)}
                                        className="w-4 h-4 rounded-none border-gray-300 text-red-600 focus:ring-red-600/20 mt-0.5 bg-transparent"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
                                            Join the World of 8+
                                        </span>
                                        <span className="text-[10px] text-gray-500 leading-tight mt-1">
                                            Receive curated news, exclusive invites, and updates on new collections. Unsubscribe anytime.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all duration-300 py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-gray-200/50 dark:shadow-none"
                                >
                                    Create My Account
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                            <span className="text-gray-500">Already a member?</span>
                            <Link
                                href="/login"
                                className="font-bold uppercase tracking-widest hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
                            >
                                Back to Login
                            </Link>
                        </div>

                        <div className="mt-12 flex justify-center space-x-6 text-gray-400">
                            <Link href="/privacy" className="hover:text-red-600 transition-colors text-[10px] uppercase tracking-wider">
                                Privacy Policy
                            </Link>
                            <span className="text-gray-600">|</span>
                            <Link href="/terms" className="hover:text-red-600 transition-colors text-[10px] uppercase tracking-wider">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
