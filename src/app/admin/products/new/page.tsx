'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { addProduct, uploadAdminImage, subscribeToCollections } from '@/lib/firebase/admin';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Collection } from '@/types';

interface CategoryOption {
    value: string;
    label: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);

    // Form Stats
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        collectionId: '',
        inventory: '',
        colors: '', // Comma separated for MVP
        sizes: '', // Comma separated for MVP
    });

    useEffect(() => {
        const unsubscribe = subscribeToCollections((data) => {
            setCollections(data.filter(c => c.isActive));
        });

        return () => unsubscribe();
    }, []);

    const selectedCollection = collections.find(c => c.id === formData.collectionId);
    const categoryOptions: CategoryOption[] = [
        { value: 'men', label: 'Men' },
        { value: 'women', label: 'Women' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images using our admin service
            const imageUrls: string[] = [];
            // In a real app we'd parallelize this carefully, for now sequential is safer to debug
            for (const file of images) {
                const url = await uploadAdminImage(file, 'products');
                imageUrls.push(url);
            }

            // 2. Prepare Data
            const productData = {
                name: formData.name,
                slug: formData.name.toLowerCase().replace(/ /g, '-'),
                description: formData.description,
                price: parseFloat(formData.price),
                category: selectedCollection?.category || 'women',
                inventory: parseInt(formData.inventory),
                currency: 'USD' as const,
                images: imageUrls,
                gender: selectedCollection?.category || 'women',
                sizes: formData.sizes.split(',').map(s => s.trim()),
                colors: formData.colors.split(',').map(c => ({ name: c.trim(), hex: '#000000' })), // Simplification
                tags: [],
                collectionId: formData.collectionId,
                isActive: true
            };

            // 3. Save to Firestore
            await addProduct(productData);

            router.push('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 bg-white text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-black">New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Product Name</label>
                            <input
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                                placeholder="e.g. The Void Trench"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Collection</label>
                            <select
                                name="collectionId"
                                required
                                value={formData.collectionId}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            >
                                <option value="">Select Collection</option>
                                {collections.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.name} ({col.category === 'women' ? 'Women' : 'Men'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-gray-500">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            placeholder="Product description..."
                        />
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Media</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((file, i) => (
                            <div key={i} className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Upload Image</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Pricing & Inventory</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Price (USD)</label>
                            <input
                                name="price"
                                type="number"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Inventory Count</label>
                            <input
                                name="inventory"
                                type="number"
                                required
                                value={formData.inventory}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Variants</h2>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-gray-500">Sizes (Comma separated)</label>
                        <input
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            placeholder="S, M, L, XL"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-gray-500">Colors (Comma separated)</label>
                        <input
                            name="colors"
                            value={formData.colors}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            placeholder="Black, White, Olive"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 text-black"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-black text-white rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
