'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Edit, Trash2, Eye, FileText, Calendar, Globe } from 'lucide-react';
import { subscribeToWorldContent, deleteWorldContent } from '@/lib/firebase/world';
import { WorldContent } from '@/types';
import { format } from 'date-fns';

export default function WorldManagementPage() {
    const [contents, setContents] = useState<WorldContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToWorldContent((data) => {
            setContents(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Delete this article/event permanently?')) {
            try {
                await deleteWorldContent(id);
            } catch (error) {
                alert('Error deleting content');
            }
        }
    };

    const filteredContents = contents.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black">World of 8+ Content</h1>
                    <p className="text-sm text-gray-600">Manage editorial stories, events, and press releases.</p>
                </div>
                <Link
                    href="/admin/world/new"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Create Story
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'Total Stories', value: contents.length, icon: FileText },
                    { label: 'Published', value: contents.filter(c => c.isPublished).length, icon: Globe },
                    { label: 'Events', value: contents.filter(c => c.type === 'event').length, icon: Calendar },
                    { label: 'Drafts', value: contents.filter(c => !c.isPublished).length, icon: Edit },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-black">
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon className="w-4 h-4 text-gray-400" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search and List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-black">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="relative max-w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4">Title / Type</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4">Date</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">Loading content...</td></tr>
                            ) : filteredContents.map((content) => (
                                <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                {content.image ? (
                                                    <Image src={content.image} alt="" fill className="object-cover" />
                                                ) : (
                                                    <FileText className="w-4 sm:w-5 h-4 sm:h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black line-clamp-1">{content.title}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">{content.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${content.isPublished
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {content.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-gray-600">
                                        {format(new Date(content.publishedAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <Link href={`/world/${content.slug}`} target="_blank" className="p-2 hover:text-black transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/world/edit/${content.id}`} className="p-2 hover:text-blue-500 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(content.id)} className="p-2 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredContents.length === 0 && (
                                <tr><td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">No content items found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
