'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Upload, X, Search, Grid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createCollection } from '@/lib/firebase/collections';
import { subscribeToProducts } from '@/lib/firebase/products';
import { Product } from '@/types';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function NewCollectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [superCollection, setSuperCollection] = useState<'casual' | 'sport'>('casual');
    const [isActive, setIsActive] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToProducts(setProducts);
        return () => unsubscribe();
    }, []);

    // Generate slug
    useEffect(() => {
        if (name) {
            setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }, [name]);

    const handleImageUpload = (result: any) => {
        setImage(result.secure_url);
    };

    const toggleProduct = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('Creating collection with data:', {
                name, slug, description, image, superCollection, isActive,
                products: selectedProducts,
            });
            await createCollection({
                name, slug, description, image, superCollection, isActive,
                products: selectedProducts,
            });
            router.push('/admin/collections');
        } catch (error) {
            console.error('Error creating collection:', error);
            alert('Failed to create collection');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 bg-white text-black">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/collections" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-black">New Collection</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 text-black">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Name</label>
                            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Genesis Drop" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none text-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Slug</label>
                            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Super Collection</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSuperCollection('casual')}
                                className={`p-4 border-2 rounded-md font-bold uppercase tracking-widest transition-all ${
                                    superCollection === 'casual'
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                }`}
                            >
                                Eightplux Casual
                            </button>
                            <button
                                type="button"
                                onClick={() => setSuperCollection('sport')}
                                className={`p-4 border-2 rounded-md font-bold uppercase tracking-widest transition-all ${
                                    superCollection === 'sport'
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                }`}
                            >
                                Eightplux Sport
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Cover Media</h2>
                    <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group">
                        {image ? (
                            <>
                                <Image src={image} alt="" fill className="object-cover" />
                                <button type="button" onClick={() => setImage('')} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                            </>
                        ) : (
                            <CloudinaryUploader
                                onUpload={handleImageUpload}
                                label="Upload collection banner"
                                accept="image/*"
                            />
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Products ({selectedProducts.length})</h2>
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-black" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                            <button key={p.id} type="button" onClick={() => toggleProduct(p.id)} className={`p-2 text-left rounded border transition-all ${selectedProducts.includes(p.id) ? 'border-red-500 bg-red-50/10' : 'border-gray-100 opacity-60 hover:opacity-100'}`}>
                                <p className="text-[10px] font-bold truncate text-black">{p.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-medium text-black">Activate Collection</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/collections" className="px-6 py-3 border border-gray-200 rounded-md text-sm font-medium text-black">Cancel</Link>
                        <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-black text-white rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Create Collection
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
