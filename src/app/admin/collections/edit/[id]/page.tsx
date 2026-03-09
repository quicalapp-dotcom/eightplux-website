'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Upload, X, Search, Grid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCollectionById, updateCollection } from '@/lib/firebase/collections';
import { subscribeToProducts } from '@/lib/firebase/products';
import { Product, Collection } from '@/types';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function EditCollectionPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCollectionById(id);
            if (data) setCollection(data);
            setLoading(false);
        };
        fetchData();
        const unsubscribe = subscribeToProducts(setProducts);
        return () => unsubscribe();
    }, [id]);

    const handleImageUpload = (result: any) => {
        if (!collection) return;
        setCollection({ ...collection, image: result.secure_url });
    };

    const toggleProduct = (pid: string) => {
        if (!collection) return;
        const current = collection.products || [];
        const next = current.includes(pid) ? current.filter(p => p !== pid) : [...current, pid];
        setCollection({ ...collection, products: next });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!collection) return;
        setSaving(true);
        try {
            const { id: _, createdAt: __, ...updateData } = collection as any;
            await updateCollection(id, updateData);
            router.push('/admin/collections');
        } catch (error) {
            alert('Failed to update collection');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (!collection) return <div className="text-center py-20"><p>Collection not found.</p></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/collections" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Edit Collection</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Name</label>
                            <input required value={collection.name} onChange={(e) => setCollection({ ...collection, name: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Slug</label>
                            <input required value={collection.slug} onChange={(e) => setCollection({ ...collection, slug: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                        <textarea required value={collection.description} onChange={(e) => setCollection({ ...collection, description: e.target.value })} rows={3} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setCollection({ ...collection, category: 'women' } as any)}
                                className={`p-4 border-2 rounded-md font-bold uppercase tracking-widest transition-all ${
                                    collection.category === 'women'
                                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                                        : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-gray-300'
                                }`}
                            >
                                Shop XX (Women)
                            </button>
                            <button
                                type="button"
                                onClick={() => setCollection({ ...collection, category: 'men' } as any)}
                                className={`p-4 border-2 rounded-md font-bold uppercase tracking-widest transition-all ${
                                    collection.category === 'men'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-gray-300'
                                }`}
                            >
                                Shop XY (Men)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold uppercase text-gray-400">Cover Media</h2>
                    <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden group">
                        {collection.image ? (
                            <>
                                <Image src={collection.image} alt="" fill className="object-cover" />
                                <button type="button" onClick={() => setCollection({ ...collection, image: '' })} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
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

                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase text-gray-400">Selected Products ({collection.products?.length || 0})</h2>
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-2 py-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded text-[10px]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                            <button key={p.id} type="button" onClick={() => toggleProduct(p.id)} className={`p-2 text-left rounded border transition-all ${collection.products?.includes(p.id) ? 'border-red-500 bg-red-50/10' : 'border-gray-100 dark:border-gray-800'}`}>
                                <p className="text-[10px] font-bold truncate">{p.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setCollection({ ...collection, isActive: !collection.isActive })} className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${collection.isActive ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'}`}>
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${collection.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex gap-4">
                        <Link href="/admin/collections" className="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium">Cancel</Link>
                        <button type="submit" disabled={saving || uploading} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Update Collection
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
