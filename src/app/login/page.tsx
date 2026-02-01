'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login:', { email, password });
    };

    return (
        <div className="bg-white font-sans h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Side - Editorial Image */}
            <div className="hidden md:block md:w-1/2 lg:w-[60%] h-full relative overflow-hidden bg-black">
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD08Hda8NDSHDZs8B_4G2F6kDx74-zIYw1at3M95kt6BD1V_KUsYblp6PqcTtbaZ0qwx6Wr-Dwl8QhYKv1UAiHbpG5GUkoG80RV02Np_9QlqCYimkfUThPA0R61EljBlPIQCb0fJkgpILLUa_cq4aiI9NLCpIWmmj4eVrfwfPBJC6L4ZnpCnPSXqqiRXHwmf0I928tKftUm_MOuKlyBdiGzRyuIhlyNTRT21G5YxiKxexjQljes-cvB7EoOS7hRO_88G-lbQKFdTV8W"
                    alt="Editorial fashion"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                <div className="absolute bottom-0 left-0 p-12 lg:p-16 w-full text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-8 bg-red-600" />
                        <span className="text-xs font-bold tracking-[0.4em] uppercase text-white">Editorial Campaign</span>
                    </div>
                    <h2 className="font-display text-5xl lg:text-7xl leading-none mb-6">
                        Urban <span className="italic font-light text-gray-300">Decay</span>
                    </h2>
                    <p className="text-xs text-gray-300 max-w-md leading-relaxed tracking-wide font-light">
                        Explore the intersection of raw urban aesthetics and high-end luxury. Sign in to access the exclusive collection drop.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 lg:w-[40%] h-full bg-white flex flex-col items-center justify-between p-8 md:p-12 lg:px-20 lg:py-16 relative overflow-y-auto">
                {/* Logo */}
                <div className="w-full flex flex-col items-center pt-8 md:pt-0">
                    <Link href="/" className="font-logo text-3xl tracking-widest font-semibold flex items-center gap-1 text-text-light">
                        EIGHTPLU<span className="text-primary text-4xl">+</span>
                    </Link>
                    <span className="text-[9px] tracking-[0.4em] font-sans text-gray-400 mt-2">EST 2022</span>
                </div>

                {/* Form */}
                <div className="w-full max-w-sm">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl text-black mb-3">Welcome Back</h1>
                        <p className="text-xs text-gray-500 tracking-widest uppercase">Please enter your details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="group relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-sm font-sans text-black placeholder-transparent focus:border-black focus:ring-0 transition-colors"
                                placeholder="Email Address"
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-widest font-bold cursor-text pointer-events-none"
                            >
                                Email Address
                            </label>
                        </div>

                        <div className="group relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-sm font-sans text-black placeholder-transparent focus:border-black focus:ring-0 transition-colors pr-10"
                                placeholder="Password"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-widest font-bold cursor-text pointer-events-none"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-3 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 px-8 text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-600 transition-colors duration-300 mt-4 flex items-center justify-center gap-2 group shadow-xl shadow-black/5"
                        >
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="w-full text-center pb-4">
                    <p className="text-xs text-gray-400 font-light mb-5">Not a member yet?</p>
                    <Link
                        href="/signup"
                        className="inline-block text-[10px] font-bold uppercase tracking-widest border border-gray-200 px-10 py-3 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-black"
                    >
                        Create an Account
                    </Link>
                    <div className="mt-8 flex justify-center space-x-6 text-gray-300">
                        <Link href="/help" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">
                            Help
                        </Link>
                        <span className="text-[9px]">•</span>
                        <Link href="/privacy" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">
                            Privacy
                        </Link>
                        <span className="text-[9px]">•</span>
                        <Link href="/terms" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
