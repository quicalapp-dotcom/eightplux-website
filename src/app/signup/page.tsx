'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update display name
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: name,
                email: email,
                role: 'customer', // Default role for new signups
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                newsletter: newsletter,
            });

            router.push('/account'); // Redirect to account page after signup
        } catch (err: any) {
            console.error('Signup error:', err);
            let msg = 'Failed to create account. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                msg = 'Email is already in use.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.';
            } else if (err.code === 'auth/invalid-email') {
                msg = 'Invalid email address.';
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen flex flex-col">
            {/* Main Content */}
            <div className="flex-grow flex w-full">
                {/* Left Side - Editorial Image */}
                <div className="hidden lg:block w-1/2 relative h-screen overflow-hidden bg-gray-100 dark:bg-black">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjmEAolBz4kn73s9tH_a4nPpCD23hoObbijpVB1UJKpGIEd-objRVCr-8e259_S2xvsYMMwwhSRNzaSnNPFeBsxeY2RrXS55KHFX1v3wQhyruPnPkUE5Mv7XcPg9Zct5X-Yp8amHcq08DbseyuSsk9HQbJYy6mhyP17M8IcQOe_8_1DdlS-hM9B1Ou5feZGZQ8Vys0SgCxTENSl35M849IS8QbzaMiOgNletSeBmNjfb7VGS6r8HdVMY-xnfjqgtdB49P9FqkeQBRG"
                        alt="Editorial fashion"
                        fill
                        className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute bottom-12 left-12 text-white z-10 max-w-md">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-white/80">Membership</p>
                        <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-4">Join the<br /><span className="italic font-light">Inner Circle</span></h2>
                        <p className="text-sm font-light text-gray-200 leading-relaxed tracking-wide">
                            Gain exclusive access to pre-releases, private sales, and curated editorial content. Be part of the movement.
                        </p>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50 dark:bg-[#0A0A0A] relative pt-24 h-screen overflow-y-auto">
                    <div className="w-full max-w-md fade-in-up">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="font-display text-3xl md:text-4xl text-black dark:text-gray-100 mb-3">Create Account</h1>
                            <p className="text-xs text-gray-500 tracking-wide uppercase">Enter your details to register</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name input */}
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-gray-100 focus:border-primary focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            {/* Email input */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-gray-100 focus:border-primary focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            {/* Password input */}
                            <div className="space-y-1 relative">
                                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 text-black dark:text-gray-100 focus:border-primary focus:ring-0 px-0 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-600 transition-colors pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={newsletter}
                                        onChange={(e) => setNewsletter(e.target.checked)}
                                        className="w-4 h-4 rounded-none border-gray-300 text-primary focus:ring-primary/20 mt-0.5 bg-transparent"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-black dark:text-gray-100 group-hover:text-primary transition-colors">
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
                                    disabled={loading}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                                        </>
                                    ) : (
                                        'Create My Account'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                            <span className="text-gray-500">Already a member?</span>
                            <Link href="/login" className="font-bold uppercase tracking-widest text-black dark:text-white hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
                                Back to Login
                            </Link>
                        </div>

                        <div className="mt-12 flex justify-center space-x-6 text-gray-400">
                            <Link href="/privacy" className="hover:text-primary transition-colors text-[10px] uppercase tracking-wider">Privacy Policy</Link>
                            <span className="text-gray-600">|</span>
                            <Link href="/terms" className="hover:text-primary transition-colors text-[10px] uppercase tracking-wider">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
