'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role || 'customer';
                if (['super_admin', 'order_manager', 'content_manager'].includes(role)) {
                    router.push('/admin');
                } else {
                    router.push('/account');
                }
            } else {
                router.push('/account');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            let msg = 'Invalid email or password.';
            if (err.code === 'auth/too-many-requests') {
                msg = 'Too many attempts. Please try again later.';
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

            {/* Right Side - Minimal Login Form */}
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
                        <h1 className="font-tt text-4xl lowercase mb-4">welcome back</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">please enter your details below</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 text-[10px] uppercase font-bold text-[#C72f32] bg-red-50/50 text-center tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
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

                        <div className="flex justify-start">
                            <Link href="/forgot-password" title="reset password" className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#C72f32] transition-colors border-b border-gray-100 pb-1">
                                forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-colors flex items-center justify-center gap-2 group shadow-xl shadow-black/5 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'sign in'}
                        </button>
                    </form>
                </div>

                {/* Footer / Signup Link */}
                <div className="pt-20">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">not a member yet?</p>
                    <Link
                        href="/signup"
                        className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-100 px-12 py-4 hover:border-black transition-all"
                    >
                        create account
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
