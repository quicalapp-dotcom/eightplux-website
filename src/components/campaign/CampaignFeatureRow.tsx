'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { subscribeToCampaignFeatureRow } from '@/lib/firebase/campaign-sections';
import { CampaignFeatureRowData } from '@/types';

interface CampaignFeatureRowProps {
    rowId: string;
    defaultLeftImage: string;
    defaultRightImage: string;
}

// Default fallback
const DEFAULT_LOGO = '/Copy of 8+ red logo.png';

export default function CampaignFeatureRow({ rowId, defaultLeftImage, defaultRightImage }: CampaignFeatureRowProps) {
    const [rowData, setRowData] = useState<CampaignFeatureRowData | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToCampaignFeatureRow(rowId, (data) => {
            setRowData(data);
        });
        return () => unsubscribe();
    }, [rowId]);

    const leftMediaUrl = rowData?.leftMediaUrl || defaultLeftImage;
    const rightMediaUrl = rowData?.rightMediaUrl || defaultRightImage;
    const leftCollectionId = rowData?.leftCollectionId;
    const rightCollectionId = rowData?.rightCollectionId;

    const LeftContent = () => (
        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden group">
            <Image src={leftMediaUrl} alt="Feature Left" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            {leftCollectionId && (
                <Link href={`/shop/collections/${leftCollectionId}`} className="absolute inset-0 z-10" />
            )}
        </div>
    );

    const RightContent = () => (
        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden group">
            <Image src={rightMediaUrl} alt="Feature Right" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            {rightCollectionId && (
                <Link href={`/shop/collections/${rightCollectionId}`} className="absolute inset-0 z-10" />
            )}
        </div>
    );

    return (
        <section className="bg-white">
            {/* Branded Divider Top */}
            <div className="flex items-center justify-center px-6 md:px-20 py-6 border-y border-gray-100">
                <div className="relative w-20 h-20 md:w-32 md:h-32">
                    <Image src={DEFAULT_LOGO} alt="Logo" fill className="object-contain" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-8">
                {leftCollectionId ? (
                    <Link href={`/shop/collections/${leftCollectionId}`} className="relative">
                        <LeftContent />
                    </Link>
                ) : (
                    <LeftContent />
                )}
                {rightCollectionId ? (
                    <Link href={`/shop/collections/${rightCollectionId}`} className="relative">
                        <RightContent />
                    </Link>
                ) : (
                    <RightContent />
                )}
            </div>

            {/* Branded Divider Bottom */}
            <div className="flex items-center justify-center px-6 md:px-20 py-6 border-y border-gray-100">
                <div className="relative w-14 h-14 md:w-24 md:h-24">
                    <Image src={DEFAULT_LOGO} alt="Logo" fill className="object-contain" />
                </div>
            </div>
        </section>
    );
}
