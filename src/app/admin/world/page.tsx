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
    <div className="space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">World of 8+ Management</h1>
          <p className="text-sm text-gray-600">Manage hero section and mosaic grid images.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/world/hero"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            Hero Section
          </Link>
          <Link
            href="/admin/world/mosaic"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            Mosaic Grid
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>
        <Link href="/world" className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          <Eye className="w-4 h-4" />
          View Live Page
        </Link>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-medium text-black mb-4">Hero Section</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Customize the hero section background image for the World of Eightplux page.
            </p>
            <Link
              href="/admin/world/hero"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Edit className="w-4 h-4" />
              Edit Hero Section
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-medium text-black mb-4">Mosaic Grid</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Manage the mosaic grid images and social media links for each image.
            </p>
            <Link
              href="/admin/world/mosaic"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Edit className="w-4 h-4" />
              Edit Mosaic Grid
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
