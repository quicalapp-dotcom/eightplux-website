import Link from 'next/link';
import Image from 'next/image';

const voidImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ot2c9vv5-mlJg9eapl412CP3uc1hDlHsDk4iUZZFD1pskjJVXTBP6Pr_hvlhIonNV1Lkgna5xDhGnXv3mj6hP-nZJDkzXS3cWtB3eFUbROxCJXt744Dt7K2-QWGjxaeWd7se0fBjZF-OPm7moUbEqKCQy_m957iaf4Z12mWkIPxioQoVvt4uOQZtuk7pgmBUYYSF1mevinOAGl9x7zBF_fUgVGnEYBJhdsbfqjG_nsuVFFOMKD-hAmIY00eZlW4QgzJNVYedfGfz';

export default function VoidCollection() {
  return (
    <section className="w-full bg-[#f0f0f0] py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-200 skew-x-12 opacity-50 z-0" />
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-[#666666] uppercase tracking-[0.2em] mb-4 block">Limited Release</span>
          <h2 className="text-5xl md:text-7xl font-display font-bold leading-none mb-6 text-[#1a1a1a] uppercase">
            The Void <br />Collection
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Enter the lottery for exclusive access to the Spring 2025 archival pieces. Application closes in 48 hours.
          </p>
          <Link href="/campaigns/void" className="inline-block bg-black text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform">
            Enter The Draw
          </Link>
        </div>
        <div className="w-full md:w-1/3 aspect-square relative bg-white p-4 shadow-xl rotate-3">
          <Image src={voidImage} alt="Abstract architectural texture" fill className="object-cover contrast-125" />
        </div>
      </div>
    </section>
  );
}
