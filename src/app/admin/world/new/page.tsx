'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { addWorldContent } from '@/lib/firebase/world';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

export default function NewWorldStoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [type, setType] = useState<'story' | 'event' | 'press' | 'popup'>('story');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    // Auto-generate slug
    const handleTitleChange = (val: string) => {
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    };

    const handleImageUpload = (result: any) => {
        setImage(result.secure_url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addWorldContent({
                title, slug, type, excerpt, content, image, isPublished,
                publishedAt: new Date(),
            });
            router.push('/admin/world');
        } catch (error) {
            alert('Failed to save story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/world" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">New World Story</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Story Title</label>
                            <input required value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter title..." className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Content Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md">
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
                            {image ? (
                                <>
                                    <Image src={image} alt="Featured" fill className="object-cover" />
                                    <button type="button" onClick={() => setImage('')} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-gray-300" /> : <Upload className="w-8 h-8 text-gray-300" />}
                                    <span className="text-xs text-gray-400 mt-2">Upload wide banner (2000x800 recommended)</span>
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Excerpt</label>
                        <textarea required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary of the story..." className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Full Content</label>
                        <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={12} placeholder="Write the full story here (Markdown supported)..." className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md font-serif text-lg" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setIsPublished(!isPublished)} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${isPublished ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-medium">Publish immediately</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/world" className="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium">Cancel</Link>
                        <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Launch Story
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
