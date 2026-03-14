'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getProductById, updateProduct } from '@/lib/firebase/products';
import { uploadAdminImage } from '@/lib/firebase/storage';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { Product, Collection } from '@/types';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            if (data) {
                setProduct(data);
                setExistingImages(data.images || []);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const unsubscribe = subscribeToCollections((data) => {
            setCollections(data.filter(c => c.isActive));
        });

        return () => unsubscribe();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url: string) => {
        setExistingImages(existingImages.filter(img => img !== url));
    };

     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setSaving(true);
        try {
            // 1. Upload new images if any
            const uploadedUrls = [];
            for (const file of newImages) {
                const url = await uploadAdminImage(file, 'products');
                uploadedUrls.push(url);
            }

            // 2. Prepare data
            const finalImages = [...existingImages, ...uploadedUrls];
             const updatedData: Partial<Product> = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price as any),
                category: product.category,
                inventory: parseInt(product.inventory as any),
                images: finalImages,
                sizes: typeof product.sizes === 'string' ? (product.sizes as any).split(',').map((s: string) => s.trim()) : product.sizes,
                sizeFit: product.sizeFit,
                isComingSoon: product.isComingSoon,
                // Handle colors similarly if needed
            };

            // Check if we're marking the product as available
            const isMarkingAsAvailable = product.isComingSoon === true && updatedData.isComingSoon === false;

            await updateProduct(id, updatedData);

            // If product is being marked as available, send notifications
            if (isMarkingAsAvailable) {
                await fetch(`/api/products/${id}/notify`, {
                    method: 'POST',
                });
            }

            router.push('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <p>Product not found.</p>
                <Link href="/admin/products" className="text-red-500 font-bold hover:underline">Back to products</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 bg-white text-black">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-black">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Product Name</label>
                            <input
                                required
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Collection</label>
                            <select
                                required
                                value={product.collectionId || ''}
                                onChange={(e) => {
                                    const collection = collections.find(c => c.id === e.target.value);
                                    setProduct({ 
                                        ...product, 
                                        collectionId: e.target.value
                                    });
                                }}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            >
                                <option value="">Select Collection</option>
                                {collections.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.name} ({col.superCollection === 'casual' ? 'Casual' : 'Sport'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Category</label>
                            <select
                                required
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value as 'male' | 'female' | 'unisex', gender: e.target.value as 'male' | 'female' | 'unisex' })}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unisex">Unisex</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-gray-500">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <h2 className="text-lg font-medium mb-4 text-black">Media</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((url, i) => (
                            <div key={url} className="aspect-square relative rounded-md overflow-hidden bg-gray-100 group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                        {newImages.map((file, i) => (
                            <div key={i} className="aspect-square relative rounded-md overflow-hidden bg-gray-100 ring-2 ring-red-500">
                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-2 right-2 p-1 bg-black text-white rounded-full"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg border border-gray-200 grid grid-cols-2 gap-4 text-black">
                      <div className="space-y-2">
                          <label className="text-xs uppercase font-bold text-gray-500">Price</label>
                          <input type="number" step="0.01" value={product.price} onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase font-bold text-gray-500">Inventory</label>
                          <input type="number" value={product.inventory} onChange={(e) => setProduct({ ...product, inventory: parseInt(e.target.value) })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black" />
                      </div>
                  </div>

                  {/* Product Status */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                      <h2 className="text-lg font-medium mb-4 text-black">Product Status</h2>
                      <div className="flex items-center gap-3">
                          <input
                              type="checkbox"
                              id="isComingSoon"
                              checked={product.isComingSoon || false}
                              onChange={(e) => setProduct({ ...product, isComingSoon: e.target.checked })}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                          />
                          <label htmlFor="isComingSoon" className="text-sm font-medium text-black">
                              Mark as Coming Soon
                          </label>
                      </div>
                      <p className="text-xs text-gray-500">
                          When checked, the product will be visible in the shop with a "Coming Soon" badge and customers can sign up for notifications when it's available.
                      </p>
                  </div>

                 <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                     <h2 className="text-lg font-medium mb-4 text-black">Size & Fit</h2>
                     <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-gray-500">Size & Fit Information</label>
                         <textarea
                             rows={4}
                             value={product.sizeFit || ''}
                             onChange={(e) => setProduct({ ...product, sizeFit: e.target.value })}
                             className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
                             placeholder="e.g. Take your usual size. Our studio model is 5'9&quot; / 178 cm and wears a size S. Our campaign model is 5'9&quot; / 176 cm and wears a size S."
                         />
                     </div>
                 </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/products" className="px-6 py-3 border border-gray-200 rounded-md text-sm font-medium text-black">Cancel</Link>
                    <button type="submit" disabled={saving} className="px-6 py-3 bg-black text-white rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
