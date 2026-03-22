'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, Grid, ChevronRight } from 'lucide-react';
import { subscribeToSubCollections, deleteSubCollection, updateSubCollection } from '@/lib/firebase/subCollections';
import { subscribeToCollections } from '@/lib/firebase/collections';
import { SubCollection, Collection } from '@/types';

function Loader2({ className }: { className?: string }) {
    return <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
}

export default function SubCollectionsManagementPage() {
    const [subCollections, setSubCollections] = useState<SubCollection[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribeSub = subscribeToSubCollections((data) => {
            setSubCollections(data);
            setLoading(false);
        });

        const unsubscribeCol = subscribeToCollections((data) => {
            setCollections(data);
        });

        return () => {
            unsubscribeSub();
            unsubscribeCol();
        };
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete sub-collection "${name}"?`)) {
            try {
                await deleteSubCollection(id);
            } catch (error) {
                alert('Error deleting sub-collection');
            }
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            await updateSubCollection(id, { isActive: !current });
        } catch (error) {
            alert('Error updating status');
        }
    };

    const getCollectionName = (collectionId: string) => {
        const collection = collections.find(c => c.id === collectionId);
        return collection?.name || 'Unknown Collection';
    };

    const filteredSubCollections = subCollections.filter(sc =>
        sc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group sub-collections by parent collection
    const groupedSubCollections = filteredSubCollections.reduce((acc, sc) => {
        const collectionName = getCollectionName(sc.collectionId);
        if (!acc[collectionName]) {
            acc[collectionName] = [];
        }
        acc[collectionName].push(sc);
        return acc;
    }, {} as Record<string, SubCollection[]>);

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black">Sub-Collections</h1>
                    <p className="text-sm text-gray-600">Organize products within your collections.</p>
                </div>
                <Link
                    href="/admin/sub-collections/new"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Sub-Collection
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search sub-collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : filteredSubCollections.length === 0 ? (
                <div className="py-16 sm:py-24 text-center bg-white rounded-lg border border-gray-200">
                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black">No sub-collections found</h3>
                    <p className="text-gray-600 mt-2">Create sub-collections to organize products within collections.</p>
                    <Link
                        href="/admin/sub-collections/new"
                        className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Create Sub-Collection
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSubCollections).map(([collectionName, subCols]) => (
                        <div key={collectionName} className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <h2 className="text-lg font-bold text-black">{collectionName}</h2>
                                <span className="text-sm text-gray-500">({subCols.length})</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {subCols.map((subCollection) => (
                                    <div key={subCollection.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group text-black">
                                        <div className="aspect-[4/3] relative bg-gray-100">
                                            {subCollection.image ? (
                                                <Image src={subCollection.image} alt={subCollection.name} fill className="object-cover" />
                                            ) : (
                                                <Grid className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <button
                                                    onClick={() => toggleStatus(subCollection.id, subCollection.isActive)}
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${subCollection.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                                        }`}
                                                >
                                                    {subCollection.isActive ? 'Active' : 'Draft'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <h3 className="font-bold text-base sm:text-lg mb-1 text-black">{subCollection.name}</h3>
                                            <p className="text-xs text-gray-600 mb-4">Belongs to: {collectionName}</p>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 gap-2 sm:gap-0">
                                                <div className="flex gap-2 text-gray-400">
                                                    <Link href={`/shop/collections/${subCollection.slug}`} target="_blank" className="p-2 hover:text-blue-500 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(subCollection.id, subCollection.name)} className="p-2 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}