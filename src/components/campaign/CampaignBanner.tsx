'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { subscribeToCampaignBanner } from '@/lib/firebase/campaign-sections';
import { CampaignBannerData } from '@/types';

// Default fallback data
const DEFAULT_IMAGE = '/casualbg.gif';
const DEFAULT_TITLE = 'dress easy live bold';
const DEFAULT_PRIMARY_BUTTON = { text: 'Shop XX', href: '/shop' };
const DEFAULT_SECONDARY_BUTTON = { text: 'Shop XY', href: '/shop' };

export default function CampaignBanner() {
    const [bannerData, setBannerData] = useState<CampaignBannerData | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToCampaignBanner((data) => {
            setBannerData(data);
        });
        return () => unsubscribe();
    }, []);

    const mediaUrl = bannerData?.mediaUrl || DEFAULT_IMAGE;
    const title = bannerData?.title || DEFAULT_TITLE;
    const showButtons = bannerData?.showButtons ?? true;
    
    const primaryButton = bannerData?.primaryButtonCollectionId
        ? { text: bannerData.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: `/shop/collections/${bannerData.primaryButtonCollectionId}` }
        : { text: bannerData?.primaryButtonText || DEFAULT_PRIMARY_BUTTON.text, href: DEFAULT_PRIMARY_BUTTON.href };
    
    const secondaryButton = bannerData?.secondaryButtonCollectionId
        ? { text: bannerData.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: `/shop/collections/${bannerData.secondaryButtonCollectionId}` }
        : { text: bannerData?.secondaryButtonText || DEFAULT_SECONDARY_BUTTON.text, href: DEFAULT_SECONDARY_BUTTON.href };

    return (
        <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
            <div className="relative w-full">
                <Image
                    src={mediaUrl}
                    alt="Banner"
                    width={1920}
                    height={1080}
                    className="w-full h-auto block brightness-75"
                    priority
                />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-white text-5xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] font-tt lowercase mb-8">
                        {title}
                    </h1>
                    {showButtons && (
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto px-4">
                            <Link
                                href={primaryButton.href}
                                className="bg-white text-black py-4 px-12 text-sm font-medium tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full"
                            >
                                {primaryButton.text}
                            </Link>
                            <Link
                                href={secondaryButton.href}
                                className="bg-white text-black py-4 px-12 text-sm font-medium tracking-tight hover:bg-black hover:text-white transition-all duration-300 text-center w-full"
                            >
                                {secondaryButton.text}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}