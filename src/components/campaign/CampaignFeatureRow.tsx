'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { subscribeToCampaignFeatureRow } from '@/lib/firebase/campaign-sections';
import { getSubCollectionSlugById } from '@/lib/firebase/subCollections';
import { CampaignFeatureRowData, CampaignFeatureItem } from '@/types';

interface CampaignFeatureRowProps {
    rowId: string;
    defaultLeftImage: string;
    defaultRightImage: string;
}

interface FeatureItemWithSlug extends CampaignFeatureItem {
    collectionSlug?: string | null;
}

// Default fallback
const DEFAULT_LOGO = '/Copy of 8+ red logo.png';

export default function CampaignFeatureRow({ rowId, defaultLeftImage, defaultRightImage }: CampaignFeatureRowProps) {
    const [rowData, setRowData] = useState<CampaignFeatureRowData | null>(null);
    const [itemsWithSlugs, setItemsWithSlugs] = useState<FeatureItemWithSlug[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToCampaignFeatureRow(rowId, (data) => {
            setRowData(data);
        });
        return () => unsubscribe();
    }, [rowId]);

    // Fetch slugs for all items with collectionId
    useEffect(() => {
        const fetchSlugs = async () => {
            const items = rowData?.items?.filter(item => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
                || [
                    { id: 'fallback-1', mediaUrl: defaultLeftImage, collectionId: '', mediaType: 'image' as const, sortOrder: 0, isActive: true },
                    { id: 'fallback-2', mediaUrl: defaultRightImage, collectionId: '', mediaType: 'image' as const, sortOrder: 1, isActive: true }
                ];

            const itemsWithSlugPromises = items.map(async (item) => {
                if (item.collectionId) {
                    const slug = await getSubCollectionSlugById(item.collectionId);
                    return { ...item, collectionSlug: slug };
                }
                return { ...item, collectionSlug: null };
            });

            const itemsWithSlug = await Promise.all(itemsWithSlugPromises);
            setItemsWithSlugs(itemsWithSlug);
        };

        if (rowData) {
            fetchSlugs();
        }
    }, [rowData, defaultLeftImage, defaultRightImage]);

    // Determine grid class based on number of items
    const getGridClass = (count: number) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2';
        if (count === 3) return 'grid-cols-1 md:grid-cols-3';
        if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    };

    return (
        <section className="bg-white">
            {/* Branded Divider Top */}
            <div className="flex items-center justify-center px-6 md:px-20 py-6 border-y border-gray-100">
                <div className="relative w-20 h-20 md:w-32 md:h-32">
                    <Image src={DEFAULT_LOGO} alt="Logo" fill className="object-contain" />
                </div>
            </div>

            <div className={`grid ${getGridClass(itemsWithSlugs.length)} gap-4 p-4 md:p-8`}>
                {itemsWithSlugs.map((item, index) => {
                    // Auto-detect if mediaUrl is a video
                    const isVideoUrl = item.mediaType === 'video' || /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(item.mediaUrl);

                    const content = (
                        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden group">
                            {isVideoUrl ? (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    src={item.mediaUrl}
                                />
                            ) : (
                                <Image
                                    src={item.mediaUrl}
                                    alt={`Feature ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                            )}
                            {item.collectionSlug && (
                                <Link href={`/shop/collections/${item.collectionSlug}`} className="absolute inset-0 z-10" />
                            )}
                        </div>
                    );

                    return item.collectionSlug ? (
                        <Link key={item.id || index} href={`/shop/collections/${item.collectionSlug}`} className="relative">
                            {content}
                        </Link>
                    ) : (
                        <div key={item.id || index}>{content}</div>
                    );
                })}
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
