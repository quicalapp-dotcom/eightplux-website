'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, X, Loader2, Save, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { addCampaign, uploadAdminImage, subscribeToProducts } from '@/lib/firebase/admin';
import { Product } from '@/types';

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [story, setStory] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image');
    const [heroUrl, setHeroUrl] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToProducts(setProducts);
        return () => unsubscribe();
    }, []);

    // Generate slug from name
    useEffect(() => {
        if (name) {
            setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }, [name]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadAdminImage(file, 'campaigns');
            setHeroUrl(url);
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!heroUrl) return alert('Please upload a hero image/video');

        setLoading(true);
        try {
            await addCampaign({
                name,
                slug,
                story,
                isActive,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                heroMedia: {
                    type: heroMediaType,
                    url: heroUrl
                },
                products: selectedProducts,
                images: [], // Can add multiple images later if needed
                behindTheScenes: []
            });
            router.push('/admin/campaigns');
        } catch (error) {
            alert('Error creating campaign');
        } finally {
            setLoading(false);
        }
    };

    const filteredStoreProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 bg-white text-black">
            <div className="flex items-center gap-4">
                <Link href="/admin/campaigns" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-black">New Campaign</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Basic Information</h2>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Campaign Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Urban Decay Summer '24"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Slug (URL)</label>
                            <input
                                required
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none text-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">The Story (Description)</label>
                            <textarea
                                required
                                rows={6}
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                placeholder="Describe the mood, inspiration, and aesthetic of this campaign..."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none text-black"
                            />
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Hero Media</h2>

                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setHeroMediaType('image')}
                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${heroMediaType === 'image' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                Image
                            </button>
                            <button
                                type="button"
                                onClick={() => setHeroMediaType('video')}
                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${heroMediaType === 'video' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                Video (URL)
                            </button>
                        </div>

                        {heroMediaType === 'image' ? (
                            <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                                {heroUrl ? (
                                    <>
                                        <Image src={heroUrl} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setHeroUrl('')}
                                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {uploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-300 mb-2" />
                                                <p className="text-xs text-gray-500">Click to upload campaign banner</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <input
                                type="url"
                                value={heroUrl}
                                onChange={(e) => setHeroUrl(e.target.value)}
                                placeholder="Vimeo or Youtube URL"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none text-black"
                            />
                        )}
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Linked Products</h2>
                            <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                {selectedProducts.length} selected
                            </span>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredStoreProducts.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => toggleProduct(p.id)}
                                    className={`text-left p-3 rounded-md border transition-all text-xs flex flex-col gap-2 ${selectedProducts.includes(p.id)
                                            ? 'border-red-500 bg-red-50/10'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="font-bold truncate text-black">{p.name}</span>
                                    <span className="text-gray-500">{p.price.toLocaleString()} {p.currency}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Schedule & Status */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 sticky top-24 text-black">
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Status & Schedule</h2>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-black">Active Status</span>
                                <button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500">Launch Date</label>
                                <input
                                    required
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500">End Date (Optional)</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-3">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-md text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Launch Campaign
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
