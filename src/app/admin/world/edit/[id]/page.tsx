'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getWorldContentById, updateWorldContent } from '@/lib/firebase/world';
import { uploadAdminImage } from '@/lib/firebase/storage';
import { WorldContent } from '@/types';

export default function EditWorldStoryPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<WorldContent | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            const data = await getWorldContentById(id);
            if (data) setContent(data);
            setLoading(false);
        };
        fetchContent();
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !content) return;
        setUploading(true);
        try {
            const url = await uploadAdminImage(file, 'world');
            setContent({ ...content, image: url });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        setSaving(true);
        try {
            const { id: _, createdAt: __, ...updateData } = content as any;
            await updateWorldContent(id, updateData);
            router.push('/admin/world');
        } catch (error) {
            alert('Failed to update story');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (!content) return <div className="text-center py-20"><p>Content not found.</p></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/world" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Edit World Story</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Story Title</label>
                            <input required value={content.title} onChange={(e) => setContent({ ...content, title: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Content Type</label>
                            <select value={content.type} onChange={(e) => setContent({ ...content, type: e.target.value as any })} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md">
                                <option value="story">Editorial Story</option>
                                <option value="event">Global Event</option>
                                <option value="press">Press Release</option>
                                <option value="popup">Pop-up Experience</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Featured Image</label>
                        <div className="relative aspect-[16/6] bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden group">
                            {content.image ? (
                                <>
                                    <Image src={content.image} alt="" fill className="object-cover" />
                                    <button type="button" onClick={() => setContent({ ...content, image: '' })} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-gray-300" /> : <Upload className="w-8 h-8 text-gray-300" />}
                                    <span className="text-xs text-gray-400 mt-2">Upload wide banner</span>
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Excerpt</label>
                        <textarea required value={content.excerpt} onChange={(e) => setContent({ ...content, excerpt: e.target.value })} rows={2} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Full Content</label>
                        <textarea required value={content.content} onChange={(e) => setContent({ ...content, content: e.target.value })} rows={12} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md font-serif text-lg" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setContent({ ...content, isPublished: !content.isPublished })} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${content.isPublished ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${content.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-medium">Published</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/world" className="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium">Cancel</Link>
                        <button type="submit" disabled={saving || uploading} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Update Story
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
