'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let msg = 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with that email address.';
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
            <h1 className="font-tt text-4xl lowercase mb-4">forgot password</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              enter your email address and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-[10px] uppercase font-bold text-[#C72f32] bg-red-50/50 text-center tracking-widest">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 text-[10px] uppercase font-bold text-green-600 bg-green-50/50 text-center tracking-widest">
              Password reset email sent. Check your inbox.
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

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-colors flex items-center justify-center gap-2 group shadow-xl shadow-black/5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'send reset link'}
            </button>
          </form>
        </div>

        {/* Footer / Signup Link */}
        <div className="pt-20">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">
            remember your password?
          </p>
          <Link
            href="/login"
            className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-100 px-12 py-4 hover:border-black transition-all"
          >
            back to login
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
