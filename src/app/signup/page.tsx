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

            // Send welcome email and generate discount code (async - don't wait for it)
            try {
                await fetch('/api/newsletter/welcome', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
            } catch (emailError) {
                console.error('Failed to process welcome email:', emailError);
                // Don't fail the signup if email process fails
            }

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
        <div className="bg-white min-h-screen flex flex-col md:flex-row overflow-hidden text-black font-sans">
            {/* Left Side - High-Fidelity Editorial Image */}
            <div className="hidden md:block md:w-1/2 lg:w-[65%] h-screen relative overflow-hidden">
                <Image
                    src="/login.jpg"
                    alt="Editorial"
                    fill
                    className="object-cover object-top"
                    priority
                />
                <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Right Side - Minimal Signup Form */}
            <div className="w-full md:w-1/2 lg:w-[35%] h-screen bg-white flex flex-col px-8 py-12 md:px-16 md:py-20 relative overflow-y-auto">
                <div className="mb-20">
                    <Link href="/">
                        <Image
                            src="/Eightplus logocam.png"
                            alt="eightplux"
                            width={120}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                </div>

                <div className="flex-1 max-w-sm">
                    <div className="mb-12">
                        <h1 className="font-tt text-4xl lowercase mb-4">create account</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">enter your details to register</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 text-[10px] uppercase font-bold text-[#C72f32] bg-red-50/50 text-center tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Name input */}
                        <div className="group relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="peer w-full border-b border-gray-200 py-4 bg-transparent text-sm focus:border-black outline-none transition-colors"
                                placeholder="full name"
                                required
                            />
                        </div>

                        {/* Email input */}
                        <div className="group relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full border-b border-gray-200 py-4 bg-transparent text-sm focus:border-black outline-none transition-colors"
                                placeholder="email address"
                                required
                            />
                        </div>

                        {/* Password input */}
                        <div className="group relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full border-b border-gray-200 py-4 bg-transparent text-sm focus:border-black outline-none transition-colors pr-10"
                                placeholder="password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-4 text-gray-300 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Newsletter checkbox */}
                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={newsletter}
                                    onChange={(e) => setNewsletter(e.target.checked)}
                                    className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-black/20 mt-0.5 bg-transparent"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors">
                                        join the world of 8+
                                    </span>
                                    <span className="text-[9px] text-gray-300 leading-tight mt-1">
                                        receive curated news, exclusive invites, and updates on new collections. unsubscribe anytime.
                                    </span>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-colors flex items-center justify-center gap-2 group shadow-xl shadow-black/5 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'create account'}
                        </button>
                    </form>
                </div>

                {/* Footer / Login Link */}
                <div className="pt-20">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">already a member?</p>
                    <Link
                        href="/login"
                        className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-100 px-12 py-4 hover:border-black transition-all"
                    >
                        sign in
                    </Link>

                    <div className="mt-16 flex space-x-6">
                        <Link href="/help" className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-black transition-colors">help</Link>
                        <Link href="/privacy" className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-black transition-colors">privacy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
