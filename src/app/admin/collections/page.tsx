'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Edit, Trash2, Eye, Grid } from 'lucide-react';
import { subscribeToCollections, deleteCollection, updateCollection } from '@/lib/firebase/collections';
import { Collection } from '@/types';

export default function CollectionsManagementPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToCollections((data) => {
            setCollections(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete collection "${name}"?`)) {
            try {
                await deleteCollection(id);
            } catch (error) {
                alert('Error deleting collection');
            }
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            await updateCollection(id, { isActive: !current });
        } catch (error) {
            alert('Error updating status');
        }
    };

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black">Collections</h1>
                    <p className="text-sm text-gray-600">Organize your products into curations and drops.</p>
                </div>
                <Link
                    href="/admin/collections/new"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Collection
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
                ) : filteredCollections.map((collection) => (
                    <div key={collection.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group text-black">
                        <div className="aspect-[4/3] relative bg-gray-100">
                            {collection.image ? (
                                <Image src={collection.image} alt={collection.name} fill className="object-cover" />
                            ) : (
                                <Grid className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                            )}
                            <div className="absolute top-4 left-4">
                                <button
                                    onClick={() => toggleStatus(collection.id, collection.isActive)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${collection.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                        }`}
                                >
                                    {collection.isActive ? 'Active' : 'Draft'}
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <h3 className="font-bold text-base sm:text-lg mb-1 text-black">{collection.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    collection.category === 'women' 
                                        ? 'bg-pink-50 text-pink-600 border border-pink-100' 
                                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                    {collection.category === 'women' ? 'Women' : 'Men'}
                                </span>
                                <span className="text-xs text-gray-600">{collection.products?.length || 0} Products</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 gap-2 sm:gap-0">
                                <div className="flex gap-2 text-gray-400">
                                    <Link href={`/admin/collections/edit/${collection.id}`} className="p-2 hover:text-blue-500 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(collection.id, collection.name)} className="p-2 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <Link href={`/collections/${collection.slug}`} target="_blank" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                                    <Eye className="w-4 h-4" />
                                    View Live
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && filteredCollections.length === 0 && (
                    <div className="col-span-full py-16 sm:py-24 text-center bg-white rounded-lg border border-gray-200">
                        <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-black">No collections found</h3>
                        <p className="text-gray-600 mt-2">Create drops to organize your inventory better.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple internal loader for this file
function Loader2({ className }: { className?: string }) {
    return <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
}
