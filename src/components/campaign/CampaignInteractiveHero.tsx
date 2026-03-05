'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { subscribeToCampaignInteractiveHero } from '@/lib/firebase/campaign-sections';
import { CampaignInteractiveHeroData } from '@/types';

// Default fallback data
const DEFAULT_IMAGE = '/sportbg.gif';
const DEFAULT_TITLE = 'play beyond limit';
const DEFAULT_PRIMARY_BUTTON = { text: 'shop XX', href: '/shop' };
const DEFAULT_SECONDARY_BUTTON = { text: 'shop XY', href: '/shop' };

export default function CampaignInteractiveHero() {
    const [heroData, setHeroData] = useState<CampaignInteractiveHeroData | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToCampaignInteractiveHero((data) => {
            setHeroData(data);
        });
        return () => unsubscribe();
    }, []);

    const mediaUrl = heroData?.mediaUrl || DEFAULT_IMAGE;
    const title = heroData?.title || DEFAULT_TITLE;
    
    const primaryButton = heroData?.primaryButtonCollectionId
        ? { text: heroData.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: `/shop/collections/${heroData.primaryButtonCollectionId}` }
        : { text: heroData?.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: DEFAULT_PRIMARY_BUTTON.href };
    
    const secondaryButton = heroData?.secondaryButtonCollectionId
        ? { text: heroData.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: `/shop/collections/${heroData.secondaryButtonCollectionId}` }
        : { text: heroData?.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: DEFAULT_SECONDARY_BUTTON.href };

    return (
        <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
            <div className="relative w-full">
                <Image
                    src={mediaUrl}
                    alt="Interactive Hero"
                    width={1920}
                    height={1080}
                    className="w-full h-auto block brightness-90"
                    priority
                />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 bg-black/5">
                    <h2 className="text-white text-5xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] mb-16 font-tt lowercase">
                        {title}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto px-4">
                        <Link
                            href={primaryButton.href}
                            className="bg-white text-black py-4 px-12 text-sm font-medium lowercase tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full shadow-lg"
                        >
                            {primaryButton.text}
                        </Link>
                        <Link
                            href={secondaryButton.href}
                            className="bg-white text-black py-4 px-12 text-sm font-medium lowercase tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full shadow-lg"
                        >
                            {secondaryButton.text}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}