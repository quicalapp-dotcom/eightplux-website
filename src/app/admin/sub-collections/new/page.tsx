'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { createSubCollection } from '@/lib/firebase/subCollections';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { Collection } from '@/types';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function NewSubCollectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string>('');
    const [collections, setCollections] = useState<Collection[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        collectionId: '',
        isActive: true,
    });

    useEffect(() => {
        const unsubscribe = subscribeToCollections((data) => {
            setCollections(data.filter(c => c.isActive));
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleImageUpload = (result: { secure_url: string }) => {
        console.log('Image uploaded successfully:', result);
        setImage(result.secure_url);
    };

    const removeImage = () => {
        setImage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name.trim()) {
            alert('Please enter a sub-collection name');
            setLoading(false);
            return;
        }

        if (!formData.collectionId) {
            alert('Please select a parent collection');
            setLoading(false);
            return;
        }

        try {
            // Prepare Data
            const subCollectionData = {
                name: formData.name,
                slug: formData.name.toLowerCase().replace(/ /g, '-'),
                collectionId: formData.collectionId,
                image: image || undefined,
                isActive: formData.isActive,
            };

            console.log('Sub-collection data to save:', subCollectionData);

            // Save to Firestore
            await createSubCollection(subCollectionData);

            router.push('/admin/collections');
        } catch (error) {
            console.error('Error creating sub-collection:', error);
            alert('Error creating sub-collection');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link 
                    href="/admin/collections" 
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collections
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h1 className="text-2xl font-bold mb-6">Create Sub-Collection</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sub-Collection Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Sub-Collection Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Summer Collection, Limited Edition"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Parent Collection Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Parent Collection *</label>
                        <select
                            name="collectionId"
                            value={formData.collectionId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            required
                        >
                            <option value="">Select a parent collection</option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            This sub-collection will be associated with the selected parent collection
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Image (Optional)</label>
                        <CloudinaryUploader
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                            currentUrl={image}
                            label="Upload sub-collection image"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                            Active (visible on storefront)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link
                            href="/admin/collections"
                            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating...' : 'Create Sub-Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}