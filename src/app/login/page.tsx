'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/account'); // Redirect to account page after login
        } catch (err: any) {
            console.error('Login error:', err);
            // Determine user-friendly error message
            let msg = 'Failed to sign in. Please check your credentials.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                msg = 'Invalid email or password.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Too many failed attempts. Please try again later.';
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white font-sans h-screen flex flex-col md:flex-row overflow-hidden text-black dark:text-white">
            {/* Left Side - Editorial Image */}
            <div className="hidden md:block md:w-1/2 lg:w-[60%] h-full relative overflow-hidden bg-black">
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD08Hda8NDSHDZs8B_4G2F6kDx74-zIYw1at3M95kt6BD1V_KUsYblp6PqcTtbaZ0qwx6Wr-Dwl8QhYKv1UAiHbpG5GUkoG80RV02Np_9QlqCYimkfUThPA0R61EljBlPIQCb0fJkgpILLUa_cq4aiI9NLCpIWmmj4eVrfwfPBJC6L4ZnpCnPSXqqiRXHwmf0I928tKftUm_MOuKlyBdiGzRyuIhlyNTRT21G5YxiKxexjQljes-cvB7EoOS7hRO_88G-lbQKFdTV8W"
                    alt="Editorial fashion"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>
                <div className="absolute bottom-0 left-0 p-12 lg:p-16 w-full text-white animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-8 bg-primary"></span>
                        <span className="text-xs font-bold tracking-[0.4em] uppercase text-white">Editorial Campaign</span>
                    </div>
                    <h2 className="font-display text-5xl lg:text-7xl leading-none mb-6">Urban <span className="italic font-light text-gray-300">Decay</span></h2>
                    <p className="text-xs text-gray-300 max-w-md leading-relaxed tracking-wide font-light">
                        Explore the intersection of raw urban aesthetics and high-end luxury. Sign in to access the exclusive collection drop.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 lg:w-[40%] h-full bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-8 md:p-12 lg:px-20 lg:py-16 relative overflow-y-auto pt-24">

                {/* Form */}
                <div className="w-full max-w-sm">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl text-black dark:text-white mb-3">Welcome Back</h1>
                        <p className="text-xs text-gray-500 tracking-widest uppercase">Please enter your details</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email input */}
                        <div className="group relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-sm font-sans text-black dark:text-white placeholder-transparent focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="Email Address"
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black dark:peer-focus:text-white uppercase tracking-widest font-bold cursor-text pointer-events-none"
                            >
                                Email Address
                            </label>
                        </div>

                        {/* Password input */}
                        <div className="group relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-sm font-sans text-black dark:text-white placeholder-transparent focus:border-black dark:focus:border-white focus:ring-0 transition-colors pr-10"
                                placeholder="Password"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black dark:peer-focus:text-white uppercase tracking-widest font-bold cursor-text pointer-events-none"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-8 text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-300 mt-4 flex items-center justify-center gap-2 group shadow-xl shadow-black/5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="w-full text-center pb-4">
                    <p className="text-xs text-gray-400 font-light mb-5">Not a member yet?</p>
                    <Link
                        href="/signup"
                        className="inline-block text-[10px] font-bold uppercase tracking-widest border border-gray-200 px-10 py-3 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 text-black dark:text-white"
                    >
                        Create an Account
                    </Link>

                    <div className="mt-8 flex justify-center space-x-6 text-gray-300">
                        <Link href="/contact" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">Help</Link>
                        <span className="text-[9px]">•</span>
                        <Link href="/privacy" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">Privacy</Link>
                        <span className="text-[9px]">•</span>
                        <Link href="/terms" className="hover:text-gray-500 transition-colors text-[9px] uppercase tracking-wider">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
