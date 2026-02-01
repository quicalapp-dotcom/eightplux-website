'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const bannersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
      
      setBanners(bannersData.sort((a, b) => a.sortOrder - b.sortOrder));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddBanner = async () => {
    if (!newBanner.title.trim()) return;
    
    try {
      await addDoc(collection(db, 'banners'), {
        ...newBanner,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewBanner({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        linkText: '',
        sortOrder: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };

  const handleUpdateBanner = async (id: string, updatedData: Partial<Banner>) => {
    try {
      const bannerRef = doc(db, 'banners', id);
      await updateDoc(bannerRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', id));
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  return (
    <div className="space-y-6 bg-white text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Banners</h1>
          <p className="text-sm text-gray-600">Manage homepage banners and promotional content.</p>
        </div>
      </div>

      {/* Add New Banner Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Title</label>
            <input
              type="text"
              value={newBanner.title}
              onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
              placeholder="Banner title"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Subtitle</label>
            <input
              type="text"
              value={newBanner.subtitle}
              onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})}
              placeholder="Banner subtitle"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
            <input
              type="text"
              value={newBanner.imageUrl}
              onChange={(e) => setNewBanner({...newBanner, imageUrl: e.target.value})}
              placeholder="URL to banner image"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Sort Order</label>
            <input
              type="number"
              value={newBanner.sortOrder}
              onChange={(e) => setNewBanner({...newBanner, sortOrder: Number(e.target.value)})}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={newBanner.description}
              onChange={(e) => setNewBanner({...newBanner, description: e.target.value})}
              placeholder="Banner description"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
            <input
              type="text"
              value={newBanner.linkUrl}
              onChange={(e) => setNewBanner({...newBanner, linkUrl: e.target.value})}
              placeholder="URL to link to"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link Text</label>
            <input
              type="text"
              value={newBanner.linkText}
              onChange={(e) => setNewBanner({...newBanner, linkText: e.target.value})}
              placeholder="Text for the link button"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setNewBanner({...newBanner, isActive: !newBanner.isActive})}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest ${
              newBanner.isActive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {newBanner.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            onClick={handleAddBanner}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Banners</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Sort Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading banners...</td>
                </tr>
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-black">{banner.title}</div>
                        <div className="text-xs text-gray-600 truncate max-w-xs">{banner.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === banner.id ? (
                        <input
                          type="number"
                          defaultValue={banner.sortOrder}
                          className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-black"
                          onBlur={(e) => handleUpdateBanner(banner.id, { sortOrder: Number(e.target.value) })}
                        />
                      ) : (
                        <span className="text-gray-600">{banner.sortOrder}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        banner.isActive 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => 
                            handleUpdateBanner(banner.id, { isActive: !banner.isActive })
                          }
                          className={`p-2 rounded-full transition-colors ${
                            banner.isActive 
                              ? 'hover:bg-red-50 text-red-500' 
                              : 'hover:bg-green-50 text-green-500'
                          }`}
                        >
                          {banner.isActive ? 'Disable' : 'Enable'}
                        </button>
                        
                        {editingId === banner.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Save className="w-4 h-4 text-green-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(banner.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No banners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}