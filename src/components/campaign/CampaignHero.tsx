'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { subscribeToCampaignHero } from '@/lib/firebase/campaign-sections';
import { CampaignHeroData } from '@/types';

// Default fallback data
const DEFAULT_IMAGE = '/caa.jpg';
const DEFAULT_TITLE = 'every look is a statement';
const DEFAULT_DECORATIVE_IMAGE = '/letsfly.png';

export default function CampaignHero() {
    const [heroData, setHeroData] = useState<CampaignHeroData | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToCampaignHero((data) => {
            setHeroData(data);
        });
        return () => unsubscribe();
    }, []);

    const mediaUrl = heroData?.mediaUrl || DEFAULT_IMAGE;
    const title = heroData?.title || DEFAULT_TITLE;
    const decorativeImage = heroData?.decorativeImage || DEFAULT_DECORATIVE_IMAGE;

    return (
        <section className="relative w-full overflow-hidden bg-black flex items-center justify-center">
            <div className="relative w-full">
                <Image
                    src={mediaUrl}
                    alt="Campaign Hero"
                    width={1920}
                    height={1080}
                    className="w-full h-auto block"
                    priority
                />
                <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-4xl space-y-6">
                        <h1 className="text-white text-3xl md:text-[96px] font-normal tracking-[-0.05em] leading-[1.22] font-tt lowercase flex flex-wrap justify-center gap-4">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={word.toLowerCase() === 'statement' ? 'text-[#C72f32]' : ''}>
                                    {word}
                                </span>
                            ))}
                        </h1>
                        <div className="flex justify-center pt-8">
                            <img
                                src={decorativeImage}
                                alt="Decorative"
                                className="h-20 md:h-28 object-contain drop-shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}