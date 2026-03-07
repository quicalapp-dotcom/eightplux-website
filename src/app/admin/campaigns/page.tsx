'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Video, Plus, X, Trash2, Upload, Home, MoveUp, MoveDown } from 'lucide-react';
import Link from 'next/link';
import {
    subscribeToCampaignHero,
    subscribeToCampaignFeatureRow,
    subscribeToCampaignInteractiveHero,
    subscribeToCampaignBanner,
    updateCampaignHero,
    updateCampaignFeatureRow,
    updateCampaignInteractiveHero,
    updateCampaignBanner,
    initializeAllCampaignSections
} from '@/lib/firebase/campaign-sections';
import { uploadAdminImage } from '@/lib/firebase/storage';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { Collection, CampaignFeatureItem } from '@/types';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function CampaignManagementPage() {
    const [saving, setSaving] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'featureRow1' | 'interactiveHero' | 'featureRow2' | 'banner' | 'featureRow3'>('hero');
    const [collections, setCollections] = useState<Collection[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Section States
    const [heroSection, setHeroSection] = useState<any>(null);
    const [featureRow1, setFeatureRow1] = useState<any>(null);
    const [interactiveHero, setInteractiveHero] = useState<any>(null);
    const [featureRow2, setFeatureRow2] = useState<any>(null);
    const [banner, setBanner] = useState<any>(null);
    const [featureRow3, setFeatureRow3] = useState<any>(null);

    useEffect(() => {
        const unsubscribeCollections = subscribeToCollections(setCollections);

        const unsubscribeHero = subscribeToCampaignHero((data) => {
            if (data) {
                setHeroSection(data);
                setInitialized(true);
            }
        });

        const unsubscribeFeatureRow1 = subscribeToCampaignFeatureRow('campaign_feature_row_1', (data) => {
            if (data) {
                setFeatureRow1(data);
                setInitialized(true);
            }
        });

        const unsubscribeInteractiveHero = subscribeToCampaignInteractiveHero((data) => {
            if (data) {
                setInteractiveHero(data);
                setInitialized(true);
            }
        });

        const unsubscribeFeatureRow2 = subscribeToCampaignFeatureRow('campaign_feature_row_2', (data) => {
            if (data) {
                setFeatureRow2(data);
                setInitialized(true);
            }
        });

        const unsubscribeBanner = subscribeToCampaignBanner((data) => {
            if (data) {
                setBanner(data);
                setInitialized(true);
            }
        });

        const unsubscribeFeatureRow3 = subscribeToCampaignFeatureRow('campaign_feature_row_3', (data) => {
            if (data) {
                setFeatureRow3(data);
                setInitialized(true);
            }
        });

        const timer = setTimeout(() => setDataLoaded(true), 1000);

        return () => {
            clearTimeout(timer);
            unsubscribeCollections();
            unsubscribeHero();
            unsubscribeFeatureRow1();
            unsubscribeInteractiveHero();
            unsubscribeFeatureRow2();
            unsubscribeBanner();
            unsubscribeFeatureRow3();
        };
    }, []);

    const handleInitialize = async () => {
        setInitializing(true);
        try {
            await initializeAllCampaignSections();
            alert('Campaign sections initialized with default content! You can now customize them.');
            setInitialized(true);
        } catch (error) {
            alert('Failed to initialize campaign sections');
            console.error(error);
        } finally {
            setInitializing(false);
        }
    };

    const getCollectionName = (collectionId: string) => {
        if (!collectionId) return 'Not set';
        const collection = collections.find(c => c.id === collectionId);
        return collection ? collection.name : 'Unknown';
    };

    const getCollectionCategory = (collectionId: string) => {
        if (!collectionId) return '';
        const collection = collections.find(c => c.id === collectionId);
        return collection ? (collection.category === 'women' ? 'Women' : 'Men') : '';
    };

    // Hero Section Handlers
    const handleSaveHero = async () => {
        setSaving(true);
        try {
            await updateCampaignHero(heroSection);
            alert('Campaign hero saved!');
        } catch (error) {
            alert('Failed to save campaign hero');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadHeroMedia = async (file: File) => {
        try {
            const url = await uploadAdminImage(file, 'campaign/hero');
            setHeroSection({ ...heroSection, mediaUrl: url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Feature Row Handlers
    const handleSaveFeatureRow = async (rowId: string, data: any) => {
        setSaving(true);
        try {
            await updateCampaignFeatureRow(rowId, data);
            alert('Feature row saved!');
        } catch (error) {
            alert('Failed to save feature row');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddFeatureItem = (rowId: string, setData: any) => {
        setData((prev: any) => {
            const newItem: CampaignFeatureItem = {
                id: Date.now().toString(),
                mediaUrl: '',
                mediaType: 'image',
                collectionId: '',
                sortOrder: prev.items?.length || 0,
                isActive: true
            };
            return { ...prev, items: [...(prev.items || []), newItem] };
        });
    };

    const handleRemoveFeatureItem = (rowId: string, itemId: string, setData: any) => {
        setData((prev: any) => ({
            ...prev,
            items: prev.items?.filter((item: CampaignFeatureItem) => item.id !== itemId) || []
        }));
    };

    const handleUpdateFeatureItem = (rowId: string, itemId: string, field: keyof CampaignFeatureItem, value: any, setData: any) => {
        setData((prev: any) => ({
            ...prev,
            items: prev.items?.map((item: CampaignFeatureItem) => 
                item.id === itemId ? { ...item, [field]: value } : item
            ) || []
        }));
    };

    const handleMoveFeatureItem = (rowId: string, index: number, direction: 'up' | 'down', setData: any) => {
        setData((prev: any) => {
            const newItems = [...(prev.items || [])];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= newItems.length) return prev;
            [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
            newItems.forEach((item, i) => item.sortOrder = i);
            return { ...prev, items: newItems };
        });
    };

    const handleUploadFeatureItemMedia = async (rowId: string, itemId: string, file: File, setData: any) => {
        try {
            const url = await uploadAdminImage(file, `campaign/${rowId}`);
            handleUpdateFeatureItem(rowId, itemId, 'mediaUrl', url, setData);
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Interactive Hero Handlers
    const handleSaveInteractiveHero = async () => {
        setSaving(true);
        try {
            await updateCampaignInteractiveHero(interactiveHero);
            alert('Interactive hero saved!');
        } catch (error) {
            alert('Failed to save interactive hero');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadInteractiveMedia = async (file: File) => {
        try {
            const url = await uploadAdminImage(file, 'campaign/interactive');
            setInteractiveHero({ ...interactiveHero, mediaUrl: url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Banner Handlers
    const handleSaveBanner = async () => {
        setSaving(true);
        try {
            await updateCampaignBanner(banner);
            alert('Banner saved!');
        } catch (error) {
            alert('Failed to save banner');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadBannerMedia = async (file: File) => {
        try {
            const url = await uploadAdminImage(file, 'campaign/banner');
            setBanner({ ...banner, mediaUrl: url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Show initialization screen if no data exists
    if (dataLoaded && !initialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-black mb-4">Campaign Management</h1>
                    <p className="text-gray-600 mb-8">
                        No campaign sections found. Click below to initialize with default content that you can customize.
                    </p>
                    <button
                        onClick={handleInitialize}
                        disabled={initializing}
                        className="w-full bg-black text-white px-6 py-4 text-sm font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {initializing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        {initializing ? 'Initializing...' : 'Initialize Campaign Sections'}
                    </button>
                </div>
            </div>
        );
    }

    if (!dataLoaded || !heroSection || !featureRow1 || !interactiveHero || !featureRow2 || !banner || !featureRow3) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
                    <p className="text-sm uppercase tracking-widest text-gray-500">Loading campaign sections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-black">Campaign Management</h1>
                        <p className="text-sm text-gray-600 mt-1">Customize your campaign page sections, media, and collection links</p>
                    </div>
                    <Link
                        href="/campaigns"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black text-sm font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        View Campaign Page
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'hero', label: 'Hero' },
                            { id: 'featureRow1', label: 'Feature Row 1' },
                            { id: 'interactiveHero', label: 'Interactive Hero' },
                            { id: 'featureRow2', label: 'Feature Row 2' },
                            { id: 'banner', label: 'Banner' },
                            { id: 'featureRow3', label: 'Feature Row 3' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-black'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero Section Editor */}
                {activeTab === 'hero' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Campaign Hero Content</h2>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                <input
                                    value={heroSection.title || ''}
                                    onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={heroSection.mediaUrl || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
                                        <Upload className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Upload</span>
                                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadHeroMedia(e.target.files[0])} />
                                    </label>
                                </div>
                                {heroSection.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        <img src={heroSection.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Decorative Image URL</label>
                                <input
                                    value={heroSection.decorativeImage || ''}
                                    onChange={(e) => setHeroSection({ ...heroSection, decorativeImage: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {heroSection.decorativeImage && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        <img src={heroSection.decorativeImage} alt="Preview" className="w-full h-full object-contain p-4" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSaveHero}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Hero Section
                        </button>
                    </div>
                )}

                {/* Feature Row 1 Editor */}
                {activeTab === 'featureRow1' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Feature Row 1 Items ({featureRow1.items?.length || 0})</h2>
                                <button 
                                    onClick={() => handleAddFeatureItem('campaign_feature_row_1', setFeatureRow1)}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featureRow1.items?.map((item: CampaignFeatureItem, index: number) => (
                                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-gray-500">Item {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_1', index, 'up', setFeatureRow1)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveUp className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_1', index, 'down', setFeatureRow1)} disabled={index === featureRow1.items.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveDown className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleRemoveFeatureItem('campaign_feature_row_1', item.id, setFeatureRow1)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Media URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={item.mediaUrl || ''}
                                                        onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_1', item.id, 'mediaUrl', e.target.value, setFeatureRow1)}
                                                        className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                    />
                                                    <CloudinaryUploader
                                                        label="Upload"
                                                        onUpload={(result) => handleUpdateFeatureItem('campaign_feature_row_1', item.id, 'mediaUrl', result.secure_url, setFeatureRow1)}
                                                        currentUrl={item.mediaUrl}
                                                        onRemove={() => handleUpdateFeatureItem('campaign_feature_row_1', item.id, 'mediaUrl', '', setFeatureRow1)}
                                                        accept="image/*,video/*"
                                                        maxSize={20}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Collection Link</label>
                                                <select
                                                    value={item.collectionId || ''}
                                                    onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_1', item.id, 'collectionId', e.target.value, setFeatureRow1)}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                >
                                                    <option value="">None</option>
                                                    {collections.map(col => (
                                                        <option key={col.id} value={col.id}>
                                                            {col.name} ({getCollectionCategory(col.id)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => handleSaveFeatureRow('campaign_feature_row_1', featureRow1)}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Feature Row 1
                        </button>
                    </div>
                )}

                {/* Interactive Hero Editor */}
                {activeTab === 'interactiveHero' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Interactive Hero Content</h2>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                <input
                                    value={interactiveHero.title || ''}
                                    onChange={(e) => setInteractiveHero({ ...interactiveHero, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={interactiveHero.mediaUrl || ''}
                                        onChange={(e) => setInteractiveHero({ ...interactiveHero, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
                                        <Upload className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Upload</span>
                                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadInteractiveMedia(e.target.files[0])} />
                                    </label>
                                </div>
                                {interactiveHero.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        <img src={interactiveHero.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Text</label>
                                    <input
                                        value={interactiveHero.primaryButtonText || ''}
                                        onChange={(e) => setInteractiveHero({ ...interactiveHero, primaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Collection</label>
                                    <select
                                        value={interactiveHero.primaryButtonCollectionId || ''}
                                        onChange={(e) => setInteractiveHero({ ...interactiveHero, primaryButtonCollectionId: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="">None</option>
                                        {collections.map(col => (
                                            <option key={col.id} value={col.id}>
                                                {col.name} ({getCollectionCategory(col.id)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Text</label>
                                    <input
                                        value={interactiveHero.secondaryButtonText || ''}
                                        onChange={(e) => setInteractiveHero({ ...interactiveHero, secondaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Collection</label>
                                    <select
                                        value={interactiveHero.secondaryButtonCollectionId || ''}
                                        onChange={(e) => setInteractiveHero({ ...interactiveHero, secondaryButtonCollectionId: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="">None</option>
                                        {collections.map(col => (
                                            <option key={col.id} value={col.id}>
                                                {col.name} ({getCollectionCategory(col.id)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveInteractiveHero}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Interactive Hero
                        </button>
                    </div>
                )}

                {/* Feature Row 2 Editor */}
                {activeTab === 'featureRow2' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Feature Row 2 Items ({featureRow2.items?.length || 0})</h2>
                                <button 
                                    onClick={() => handleAddFeatureItem('campaign_feature_row_2', setFeatureRow2)}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featureRow2.items?.map((item: CampaignFeatureItem, index: number) => (
                                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-gray-500">Item {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_2', index, 'up', setFeatureRow2)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveUp className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_2', index, 'down', setFeatureRow2)} disabled={index === featureRow2.items.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveDown className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleRemoveFeatureItem('campaign_feature_row_2', item.id, setFeatureRow2)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Media URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={item.mediaUrl || ''}
                                                        onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_2', item.id, 'mediaUrl', e.target.value, setFeatureRow2)}
                                                        className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                    />
                                                    <CloudinaryUploader
                                                        label="Upload"
                                                        onUpload={(result) => handleUpdateFeatureItem('campaign_feature_row_2', item.id, 'mediaUrl', result.secure_url, setFeatureRow2)}
                                                        currentUrl={item.mediaUrl}
                                                        onRemove={() => handleUpdateFeatureItem('campaign_feature_row_2', item.id, 'mediaUrl', '', setFeatureRow2)}
                                                        accept="image/*,video/*"
                                                        maxSize={20}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Collection Link</label>
                                                <select
                                                    value={item.collectionId || ''}
                                                    onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_2', item.id, 'collectionId', e.target.value, setFeatureRow2)}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                >
                                                    <option value="">None</option>
                                                    {collections.map(col => (
                                                        <option key={col.id} value={col.id}>
                                                            {col.name} ({getCollectionCategory(col.id)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => handleSaveFeatureRow('campaign_feature_row_2', featureRow2)}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Feature Row 2
                        </button>
                    </div>
                )}

                {/* Banner Editor */}
                {activeTab === 'banner' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Campaign Banner Content</h2>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                <input
                                    value={banner.title || ''}
                                    onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={banner.mediaUrl || ''}
                                        onChange={(e) => setBanner({ ...banner, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
                                        <Upload className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Upload</span>
                                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadBannerMedia(e.target.files[0])} />
                                    </label>
                                </div>
                                {banner.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        <img src={banner.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Show Buttons</label>
                                <select
                                    value={banner.showButtons ? 'true' : 'false'}
                                    onChange={(e) => setBanner({ ...banner, showButtons: e.target.value === 'true' })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            {banner.showButtons && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Text</label>
                                            <input
                                                value={banner.primaryButtonText || ''}
                                                onChange={(e) => setBanner({ ...banner, primaryButtonText: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Collection</label>
                                            <select
                                                value={banner.primaryButtonCollectionId || ''}
                                                onChange={(e) => setBanner({ ...banner, primaryButtonCollectionId: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            >
                                                <option value="">None</option>
                                                {collections.map(col => (
                                                    <option key={col.id} value={col.id}>
                                                        {col.name} ({getCollectionCategory(col.id)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Text</label>
                                            <input
                                                value={banner.secondaryButtonText || ''}
                                                onChange={(e) => setBanner({ ...banner, secondaryButtonText: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Collection</label>
                                            <select
                                                value={banner.secondaryButtonCollectionId || ''}
                                                onChange={(e) => setBanner({ ...banner, secondaryButtonCollectionId: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            >
                                                <option value="">None</option>
                                                {collections.map(col => (
                                                    <option key={col.id} value={col.id}>
                                                        {col.name} ({getCollectionCategory(col.id)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleSaveBanner}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Banner
                        </button>
                    </div>
                )}

                {/* Feature Row 3 Editor */}
                {activeTab === 'featureRow3' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Feature Row 3 Items ({featureRow3.items?.length || 0})</h2>
                                <button 
                                    onClick={() => handleAddFeatureItem('campaign_feature_row_3', setFeatureRow3)}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featureRow3.items?.map((item: CampaignFeatureItem, index: number) => (
                                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-gray-500">Item {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_3', index, 'up', setFeatureRow3)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveUp className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleMoveFeatureItem('campaign_feature_row_3', index, 'down', setFeatureRow3)} disabled={index === featureRow3.items.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveDown className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleRemoveFeatureItem('campaign_feature_row_3', item.id, setFeatureRow3)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Media URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={item.mediaUrl || ''}
                                                        onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_3', item.id, 'mediaUrl', e.target.value, setFeatureRow3)}
                                                        className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                    />
                                                    <CloudinaryUploader
                                                        label="Upload"
                                                        onUpload={(result) => handleUpdateFeatureItem('campaign_feature_row_3', item.id, 'mediaUrl', result.secure_url, setFeatureRow3)}
                                                        currentUrl={item.mediaUrl}
                                                        onRemove={() => handleUpdateFeatureItem('campaign_feature_row_3', item.id, 'mediaUrl', '', setFeatureRow3)}
                                                        accept="image/*,video/*"
                                                        maxSize={20}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Collection Link</label>
                                                <select
                                                    value={item.collectionId || ''}
                                                    onChange={(e) => handleUpdateFeatureItem('campaign_feature_row_3', item.id, 'collectionId', e.target.value, setFeatureRow3)}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                >
                                                    <option value="">None</option>
                                                    {collections.map(col => (
                                                        <option key={col.id} value={col.id}>
                                                            {col.name} ({getCollectionCategory(col.id)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => handleSaveFeatureRow('campaign_feature_row_3', featureRow3)}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Feature Row 3
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
