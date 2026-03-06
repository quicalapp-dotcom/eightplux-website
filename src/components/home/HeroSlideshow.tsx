'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { subscribeToHeroSection } from '@/lib/firebase/homepage-sections';
import { HeroSectionData } from '@/types';

const SLIDE_INTERVAL_MS = 10_000;

// Default fallback data
const DEFAULT_SLIDES = [
    { src: '/Model1.jpg', mediaType: 'image' as const },
    { src: '/define.jpg', mediaType: 'image' as const },
    { src: '/Model3.jpg', mediaType: 'image' as const }
];

const DEFAULT_DECORATIVE_IMAGE = '/letsfly.png';
const DEFAULT_TITLE = 'yOu\'ve been grounded long enough';
const DEFAULT_PRIMARY_BUTTON = { text: 'Shop XX', href: '/shop/women' };
const DEFAULT_SECONDARY_BUTTON = { text: 'Shop XY', href: '/shop/men' };

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);
    const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
    const total = heroData?.slides?.length || DEFAULT_SLIDES.length;

    const next = useCallback(() => {
        setCurrent((prev: number) => (prev + 1) % total);
    }, [total]);

    useEffect(() => {
        const timer = setInterval(next, SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [next]);

    useEffect(() => {
        const unsubscribe = subscribeToHeroSection((data) => {
            setHeroData(data);
        });
        return () => unsubscribe();
    }, []);

    const slides = heroData?.slides?.filter(s => s.isActive).map(s => s.src) || DEFAULT_SLIDES.map(s => s.src);
    const title = heroData?.title || DEFAULT_TITLE;
    const decorativeImage = heroData?.decorativeImage || DEFAULT_DECORATIVE_IMAGE;
    
    const primaryButton = heroData?.primaryButtonCollectionId 
        ? { text: heroData.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: `/shop/collections/${heroData.primaryButtonCollectionId}` }
        : { text: heroData?.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: '/shop/women' };
    
    const secondaryButton = heroData?.secondaryButtonCollectionId
        ? { text: heroData.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: `/shop/collections/${heroData.secondaryButtonCollectionId}` }
        : { text: heroData?.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: '/shop/men' };

    return (
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center pt-[60px]">

            {/* Slides */}
            {slides.map((src, i) => (
                <div
                    key={src}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
                        i === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        alt={`Hero slide ${i + 1}`}
                        className="w-full h-full object-cover object-top brightness-[0.7]"
                        src={src}
                    />
                </div>
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

            <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto mt-32">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-light text-white leading-tight tracking-tight mb-8">
                    {title.split(' ').map((word, i) => (
                        <span key={i}>
                            {word.toLowerCase() === 'grounded' ? (
                                <span className="text-[#C72f32] font-bold">{word} </span>
                            ) : (
                                <span>{word} </span>
                            )}
                        </span>
                    ))}
                </h1>
                <div className="relative mb-16 flex justify-center">
                    <img
                        src={decorativeImage}
                        alt="Decorative"
                        className="h-24 md:h-36 object-contain drop-shadow-lg"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mx-auto px-4">
                    <Link
                        href={primaryButton.href}
                        className="bg-white text-black px-12 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-[180px] text-center"
                    >
                        {primaryButton.text}
                    </Link>
                    <Link
                        href={secondaryButton.href}
                        className="bg-white text-black px-12 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-[180px] text-center"
                    >
                        {secondaryButton.text}
                    </Link>
                </div>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`rounded-full transition-all duration-500 h-[5px] ${
                            i === current
                                ? 'w-6 bg-white'
                                : 'w-4 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
