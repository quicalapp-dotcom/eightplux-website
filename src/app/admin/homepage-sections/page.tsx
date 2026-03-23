'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Video, Plus, X, Trash2, MoveUp, MoveDown, Upload, Home } from 'lucide-react';
import Link from 'next/link';
import {
    subscribeToHeroSection,
    subscribeToSportSection,
    subscribeToCasualSection,
    subscribeToStyleSection,
    subscribeToWorldSection,
    subscribeToStageSection,
    updateHeroSection,
    updateSportSection,
    updateCasualSection,
    updateStyleSection,
    updateWorldSection,
    updateStageSection,
    updateHeroSlides,
    updateStyleCards,
    initializeAllHomepageSections
} from '@/lib/firebase/homepage-sections';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { HeroSlide, StyleCard, Collection } from '@/types';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function HomepageManagementPage() {
    const [saving, setSaving] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'sport' | 'casual' | 'style' | 'world' | 'stage'>('hero');
    const [collections, setCollections] = useState<Collection[]>([]);
    const [initialized, setInitialized] = useState(false);

    // Hero Section State
    const [heroSection, setHeroSection] = useState<any>(null);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

    // Sport Section State
    const [sportSection, setSportSection] = useState<any>(null);

    // Casual Section State
    const [casualSection, setCasualSection] = useState<any>(null);

    // Style Section State
    const [styleSection, setStyleSection] = useState<any>(null);
    const [styleCards, setStyleCards] = useState<StyleCard[]>([]);

    // World Section State
    const [worldSection, setWorldSection] = useState<any>(null);

    // Stage Section State
    const [stageSection, setStageSection] = useState<any>(null);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const unsubscribeCollections = subscribeToCollections(setCollections);

        const unsubscribeHero = subscribeToHeroSection((data) => {
            if (data) {
                setHeroSection(data);
                setHeroSlides(data.slides?.sort((a, b) => a.sortOrder - b.sortOrder) || []);
                setInitialized(true);
            }
        });

        const unsubscribeSport = subscribeToSportSection((data) => {
            if (data) {
                setSportSection(data);
                setInitialized(true);
            }
        });

        const unsubscribeCasual = subscribeToCasualSection((data) => {
            if (data) {
                setCasualSection(data);
                setInitialized(true);
            }
        });

        const unsubscribeStyle = subscribeToStyleSection((data) => {
            if (data) {
                setStyleSection(data);
                setStyleCards(data.cards?.sort((a, b) => a.sortOrder - b.sortOrder) || []);
                setInitialized(true);
            }
        });

        const unsubscribeWorld = subscribeToWorldSection((data) => {
            if (data) {
                setWorldSection(data);
                setInitialized(true);
            }
        });

        const unsubscribeStage = subscribeToStageSection((data) => {
            if (data) {
                setStageSection(data);
                setInitialized(true);
            }
        });

        // Mark as loaded after a short delay to allow subscriptions to fire
        const timer = setTimeout(() => setDataLoaded(true), 1000);

        return () => {
            clearTimeout(timer);
            unsubscribeCollections();
            unsubscribeHero();
            unsubscribeSport();
            unsubscribeCasual();
            unsubscribeStyle();
            unsubscribeWorld();
            unsubscribeStage();
        };
    }, []);

    const handleInitialize = async () => {
        setInitializing(true);
        try {
            await initializeAllHomepageSections();
            alert('Homepage sections initialized with default content! You can now customize them.');
            setInitialized(true);
        } catch (error) {
            alert('Failed to initialize homepage sections');
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
        return collection ? (collection.superCollection === 'casual' ? 'Eightplux Casual' : 'Eightplux Sport') : '';
    };

    // Hero Section Handlers
    const handleSaveHero = async () => {
        setSaving(true);
        try {
            await updateHeroSection({
                title: heroSection?.title,
                subtitle: heroSection?.subtitle,
                primaryButtonText: heroSection?.primaryButtonText,
                secondaryButtonText: heroSection?.secondaryButtonText,
                primaryButtonCollectionId: heroSection?.primaryButtonCollectionId,
                secondaryButtonCollectionId: heroSection?.secondaryButtonCollectionId,
                decorativeImage: heroSection?.decorativeImage,
            });
            await updateHeroSlides(heroSlides);
            alert('Hero section saved!');
        } catch (error) {
            alert('Failed to save hero section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSlide = () => {
        const newSlide: HeroSlide = {
            id: Date.now().toString(),
            src: '',
            mediaType: 'image',
            isActive: true,
            sortOrder: heroSlides.length
        };
        setHeroSlides([...heroSlides, newSlide]);
    };

    const handleUpdateSlide = (id: string, field: keyof HeroSlide, value: any) => {
        setHeroSlides(heroSlides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide));
    };

    const handleRemoveSlide = (id: string) => {
        setHeroSlides(heroSlides.filter(slide => slide.id !== id));
    };

    const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...heroSlides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSlides.length) return;
        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
        newSlides.forEach((slide, i) => slide.sortOrder = i);
        setHeroSlides(newSlides);
    };

    const handleUploadSlideMedia = (id: string, result: any) => {
        try {
            handleUpdateSlide(id, 'src', result.secure_url);
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Sport Section Handlers
    const handleSaveSport = async () => {
        setSaving(true);
        try {
            await updateSportSection(sportSection);
            alert('Sport section saved!');
        } catch (error) {
            alert('Failed to save sport section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadSportMedia = (result: any) => {
        try {
            setSportSection({ ...sportSection, mediaUrl: result.secure_url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Casual Section Handlers
    const handleSaveCasual = async () => {
        setSaving(true);
        try {
            await updateCasualSection(casualSection);
            alert('Casual section saved!');
        } catch (error) {
            alert('Failed to save casual section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadCasualMedia = (result: any) => {
        try {
            setCasualSection({ ...casualSection, mediaUrl: result.secure_url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Style Section Handlers
    const handleSaveStyle = async () => {
        setSaving(true);
        try {
            await updateStyleSection({
                badgeText: styleSection?.badgeText,
                title: styleSection?.title,
            });
            await updateStyleCards(styleCards);
            alert('Style section saved!');
        } catch (error) {
            alert('Failed to save style section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddCard = () => {
        const newCard: StyleCard = {
            id: Date.now().toString(),
            mediaUrl: '',
            mediaType: 'image',
            label: '',
            sortOrder: styleCards.length,
            isActive: true
        };
        setStyleCards([...styleCards, newCard]);
    };

    const handleUpdateCard = (id: string, field: keyof StyleCard, value: any) => {
        setStyleCards(styleCards.map(card => card.id === id ? { ...card, [field]: value } : card));
    };

    const handleRemoveCard = (id: string) => {
        setStyleCards(styleCards.filter(card => card.id !== id));
    };

    const handleUploadCardMedia = (id: string, result: any) => {
        try {
            handleUpdateCard(id, 'mediaUrl', result.secure_url);
        } catch (error) {
            alert('Upload failed');
        }
    };

    // World Section Handlers
    const handleSaveWorld = async () => {
        setSaving(true);
        try {
            await updateWorldSection(worldSection);
            alert('World section saved!');
        } catch (error) {
            alert('Failed to save world section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadWorldMedia = (result: any) => {
        try {
            setWorldSection({ ...worldSection, mediaUrl: result.secure_url });
        } catch (error) {
            alert('Upload failed');
        }
    };

    // Stage Section Handlers
    const handleSaveStage = async () => {
        setSaving(true);
        try {
            await updateStageSection(stageSection);
            alert('Stage section saved!');
        } catch (error) {
            alert('Failed to save stage section');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadStageMedia = (result: any) => {
        try {
            setStageSection({ ...stageSection, mediaUrl: result.secure_url });
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
                    <h1 className="text-2xl font-bold text-black mb-4">Homepage Management</h1>
                    <p className="text-gray-600 mb-8">
                        No homepage sections found. Click below to initialize with default content that you can customize.
                    </p>
                    <button
                        onClick={handleInitialize}
                        disabled={initializing}
                        className="w-full bg-black text-white px-6 py-4 text-sm font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {initializing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        {initializing ? 'Initializing...' : 'Initialize Homepage Sections'}
                    </button>
                </div>
            </div>
        );
    }

    if (!dataLoaded || !heroSection || !sportSection || !casualSection || !styleSection || !worldSection || !stageSection) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
                    <p className="text-sm uppercase tracking-widest text-gray-500">Loading homepage sections...</p>
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
                        <h1 className="text-2xl font-bold text-black">Homepage Management</h1>
                        <p className="text-sm text-gray-600 mt-1">Customize your homepage sections, media, and collection links</p>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black text-sm font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        View Site
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'hero', label: 'Hero Slideshow' },
                            { id: 'sport', label: 'Sport' },
                            { id: 'casual', label: 'Casual' },
                            { id: 'style', label: 'Style' },
                            { id: 'world', label: 'World' },
                            { id: 'stage', label: 'Stage' }
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
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Hero Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Main Title</label>
                                    <input
                                        value={heroSection.title || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Decorative Image URL</label>
                                    <input
                                        value={heroSection.decorativeImage || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, decorativeImage: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Text</label>
                                    <input
                                        value={heroSection.primaryButtonText || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, primaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Collection</label>
                                    <select
                                        value={heroSection.primaryButtonCollectionId || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, primaryButtonCollectionId: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="">None (links to /shop/women)</option>
                                        {collections.map(col => (
                                            <option key={col.id} value={col.id}>
                                                {col.name} ({getCollectionCategory(col.id)})
                                            </option>
                                        ))}
                                    </select>
                                    {heroSection.primaryButtonCollectionId && (
                                        <p className="text-xs text-gray-500 mt-2">Link: /shop/collections/{collections.find(c => c.id === heroSection.primaryButtonCollectionId)?.slug}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Text</label>
                                    <input
                                        value={heroSection.secondaryButtonText || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, secondaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Collection</label>
                                    <select
                                        value={heroSection.secondaryButtonCollectionId || ''}
                                        onChange={(e) => setHeroSection({ ...heroSection, secondaryButtonCollectionId: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="">None (links to /shop/men)</option>
                                        {collections.map(col => (
                                            <option key={col.id} value={col.id}>
                                                {col.name} ({getCollectionCategory(col.id)})
                                            </option>
                                        ))}
                                    </select>
                                    {heroSection.secondaryButtonCollectionId && (
                                        <p className="text-xs text-gray-500 mt-2">Link: /shop/collections/{collections.find(c => c.id === heroSection.secondaryButtonCollectionId)?.slug}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Hero Slides ({heroSlides.length})</h2>
                                <button onClick={handleAddSlide} className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity">
                                    <Plus className="w-4 h-4" /> Add Slide
                                </button>
                            </div>
                            <div className="space-y-4">
                                {heroSlides.map((slide, index) => (
                                    <div key={slide.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-gray-500">Slide {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleMoveSlide(index, 'up')} disabled={index === 0} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveUp className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleMoveSlide(index, 'down')} disabled={index === heroSlides.length - 1} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30">
                                                    <MoveDown className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleRemoveSlide(slide.id)} className="p-2 hover:bg-red-50 rounded text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Media Type</label>
                                                <select
                                                    value={slide.mediaType}
                                                    onChange={(e) => handleUpdateSlide(slide.id, 'mediaType', e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">Video</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Active</label>
                                                <select
                                                    value={slide.isActive ? 'true' : 'false'}
                                                    onChange={(e) => handleUpdateSlide(slide.id, 'isActive', e.target.value === 'true')}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                                                >
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Media URL</label>
                                                <CloudinaryUploader
                                                    onUpload={(result) => handleUpdateSlide(slide.id, 'src', result.secure_url)}
                                                    currentUrl={slide.src}
                                                    accept={slide.mediaType === 'image' ? 'image/*' : 'video/*'}
                                                    maxSize={10}
                                                    isVideo={slide.mediaType === 'video'}
                                                    label={slide.mediaType === 'image' ? 'Upload Image' : 'Upload Video'}
                                                />
                                            {slide.src && (
                                                <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                                    {slide.mediaType === 'image' ? (
                                                        <img src={slide.src} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <video src={slide.src} className="w-full h-full object-cover" controls />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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

                {/* Sport Section Editor */}
                {activeTab === 'sport' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Sport Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Badge Text</label>
                                    <input
                                        value={sportSection.badgeText || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, badgeText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                    <input
                                        value={sportSection.title || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={sportSection.mediaUrl || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <CloudinaryUploader
                                        label="Upload"
                                        onUpload={handleUploadSportMedia}
                                        currentUrl={sportSection.mediaUrl}
                                        onRemove={() => setSportSection({ ...sportSection, mediaUrl: '' })}
                                        accept="image/*,video/*"
                                        maxSize={20}
                                    />
                                </div>
                                {sportSection.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(sportSection.mediaUrl) ? (
                                            <video src={sportSection.mediaUrl} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={sportSection.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Text</label>
                                    <input
                                        value={sportSection.primaryButtonText || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, primaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Collection</label>
                                    <select
                                        value={sportSection.primaryButtonCollectionId || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, primaryButtonCollectionId: e.target.value })}
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
                                        value={sportSection.secondaryButtonText || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, secondaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Collection</label>
                                    <select
                                        value={sportSection.secondaryButtonCollectionId || ''}
                                        onChange={(e) => setSportSection({ ...sportSection, secondaryButtonCollectionId: e.target.value })}
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
                            onClick={handleSaveSport}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Sport Section
                        </button>
                    </div>
                )}

                {/* Casual Section Editor */}
                {activeTab === 'casual' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Casual Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Badge Text</label>
                                    <input
                                        value={casualSection.badgeText || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, badgeText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                    <input
                                        value={casualSection.title || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={casualSection.mediaUrl || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <CloudinaryUploader
                                        label="Upload"
                                        onUpload={handleUploadCasualMedia}
                                        currentUrl={casualSection.mediaUrl}
                                        onRemove={() => setCasualSection({ ...casualSection, mediaUrl: '' })}
                                        accept="image/*,video/*"
                                        maxSize={20}
                                    />
                                </div>
                                {casualSection.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(casualSection.mediaUrl) ? (
                                            <video src={casualSection.mediaUrl} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={casualSection.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Text</label>
                                    <input
                                        value={casualSection.primaryButtonText || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, primaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Button Collection</label>
                                    <select
                                        value={casualSection.primaryButtonCollectionId || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, primaryButtonCollectionId: e.target.value })}
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
                                        value={casualSection.secondaryButtonText || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, secondaryButtonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Secondary Button Collection</label>
                                    <select
                                        value={casualSection.secondaryButtonCollectionId || ''}
                                        onChange={(e) => setCasualSection({ ...casualSection, secondaryButtonCollectionId: e.target.value })}
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
                            onClick={handleSaveCasual}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Casual Section
                        </button>
                    </div>
                )}

                {/* Style Section Editor */}
                {activeTab === 'style' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Style Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Badge Text</label>
                                    <input
                                        value={styleSection.badgeText || ''}
                                        onChange={(e) => setStyleSection({ ...styleSection, badgeText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                    <input
                                        value={styleSection.title || ''}
                                        onChange={(e) => setStyleSection({ ...styleSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Style Cards ({styleCards.length})</h2>
                                <button onClick={handleAddCard} className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity">
                                    <Plus className="w-4 h-4" /> Add Card
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {styleCards.map((card, index) => (
                                    <div key={card.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-gray-500">Card {index + 1}</span>
                                            <button onClick={() => handleRemoveCard(card.id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label</label>
                                                <input
                                                    value={card.label}
                                                    onChange={(e) => handleUpdateCard(card.id, 'label', e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Collection Link</label>
                                                <select
                                                    value={card.collectionId || ''}
                                                    onChange={(e) => handleUpdateCard(card.id, 'collectionId', e.target.value)}
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
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Media URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={card.mediaUrl}
                                                        onChange={(e) => handleUpdateCard(card.id, 'mediaUrl', e.target.value)}
                                                        className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-black text-sm"
                                                    />
                                            <CloudinaryUploader
                                                label="Upload"
                                                onUpload={(result) => handleUploadCardMedia(card.id, result)}
                                                currentUrl={card.mediaUrl}
                                                onRemove={() => handleUpdateCard(card.id, 'mediaUrl', '')}
                                                accept="image/*"
                                                maxSize={20}
                                            />
                                                </div>
                                                {card.mediaUrl && (
                                                    <div className="mt-2 aspect-[3/4] relative rounded overflow-hidden bg-gray-100">
                                                        <img src={card.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveStyle}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Style Section
                        </button>
                    </div>
                )}

                {/* World Section Editor */}
                {activeTab === 'world' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">World Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                    <input
                                        value={worldSection.title || ''}
                                        onChange={(e) => setWorldSection({ ...worldSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subtitle</label>
                                    <input
                                        value={worldSection.subtitle || ''}
                                        onChange={(e) => setWorldSection({ ...worldSection, subtitle: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={worldSection.mediaUrl || ''}
                                        onChange={(e) => setWorldSection({ ...worldSection, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <CloudinaryUploader
                                        label="Upload"
                                        onUpload={handleUploadWorldMedia}
                                        currentUrl={worldSection.mediaUrl}
                                        onRemove={() => setWorldSection({ ...worldSection, mediaUrl: '' })}
                                        accept="image/*,video/*"
                                        maxSize={20}
                                    />
                                </div>
                                {worldSection.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(worldSection.mediaUrl) ? (
                                            <video src={worldSection.mediaUrl} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={worldSection.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Button Text</label>
                                    <input
                                        value={worldSection.buttonText || ''}
                                        onChange={(e) => setWorldSection({ ...worldSection, buttonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Button Collection</label>
                                    <select
                                        value={worldSection.buttonCollectionId || ''}
                                        onChange={(e) => setWorldSection({ ...worldSection, buttonCollectionId: e.target.value })}
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
                            onClick={handleSaveWorld}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save World Section
                        </button>
                    </div>
                )}

                {/* Stage Section Editor */}
                {activeTab === 'stage' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Stage Section Content</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                                    <input
                                        value={stageSection.title || ''}
                                        onChange={(e) => setStageSection({ ...stageSection, title: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subtitle</label>
                                    <input
                                        value={stageSection.subtitle || ''}
                                        onChange={(e) => setStageSection({ ...stageSection, subtitle: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Background Media URL</label>
                                <div className="flex gap-2">
                                    <input
                                        value={stageSection.mediaUrl || ''}
                                        onChange={(e) => setStageSection({ ...stageSection, mediaUrl: e.target.value })}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <CloudinaryUploader
                                        label="Upload"
                                        onUpload={handleUploadStageMedia}
                                        currentUrl={stageSection.mediaUrl}
                                        onRemove={() => setStageSection({ ...stageSection, mediaUrl: '' })}
                                        accept="image/*,video/*"
                                        maxSize={20}
                                    />
                                </div>
                                {stageSection.mediaUrl && (
                                    <div className="mt-2 aspect-video relative rounded overflow-hidden bg-gray-100">
                                        {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(stageSection.mediaUrl) ? (
                                            <video src={stageSection.mediaUrl} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={stageSection.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Button Text</label>
                                    <input
                                        value={stageSection.buttonText || ''}
                                        onChange={(e) => setStageSection({ ...stageSection, buttonText: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Button Collection</label>
                                    <select
                                        value={stageSection.buttonCollectionId || ''}
                                        onChange={(e) => setStageSection({ ...stageSection, buttonCollectionId: e.target.value })}
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
                            onClick={handleSaveStage}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Stage Section
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


