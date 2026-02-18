'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface HomepageContent {
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

export default function HomepageContentPage() {
  const [contentItems, setContentItems] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({
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
    const unsubscribe = onSnapshot(collection(db, 'homepage_content'), (snapshot) => {
      const contentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HomepageContent[];
      
      setContentItems(contentData.sort((a, b) => a.sortOrder - b.sortOrder));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddContent = async () => {
    if (!newContent.title.trim()) return;
    
    try {
      await addDoc(collection(db, 'homepage_content'), {
        ...newContent,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewContent({
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
      console.error('Error adding homepage content:', error);
    }
  };

  const handleUpdateContent = async (id: string, updatedData: Partial<HomepageContent>) => {
    try {
      const contentRef = doc(db, 'homepage_content', id);
      await updateDoc(contentRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating homepage content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      try {
        await deleteDoc(doc(db, 'homepage_content', id));
      } catch (error) {
        console.error('Error deleting homepage content:', error);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Homepage Content</h1>
          <p className="text-sm text-gray-600">Manage content sections on the homepage.</p>
        </div>
      </div>

      {/* Add New Content Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Content Section</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Title</label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({...newContent, title: e.target.value})}
              placeholder="Section title"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Subtitle</label>
            <input
              type="text"
              value={newContent.subtitle}
              onChange={(e) => setNewContent({...newContent, subtitle: e.target.value})}
              placeholder="Section subtitle"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
            <input
              type="text"
              value={newContent.imageUrl}
              onChange={(e) => setNewContent({...newContent, imageUrl: e.target.value})}
              placeholder="URL to image"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Sort Order</label>
            <input
              type="number"
              value={newContent.sortOrder}
              onChange={(e) => setNewContent({...newContent, sortOrder: Number(e.target.value)})}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={newContent.description}
              onChange={(e) => setNewContent({...newContent, description: e.target.value})}
              placeholder="Section description"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
            <input
              type="text"
              value={newContent.linkUrl}
              onChange={(e) => setNewContent({...newContent, linkUrl: e.target.value})}
              placeholder="URL to link to"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link Text</label>
            <input
              type="text"
              value={newContent.linkText}
              onChange={(e) => setNewContent({...newContent, linkText: e.target.value})}
              placeholder="Text for the link button"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
          <button
            onClick={() => setNewContent({...newContent, isActive: !newContent.isActive})}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest ${
              newContent.isActive
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {newContent.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            onClick={handleAddContent}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Content Sections</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Title</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Sort Order</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">Loading content...</td>
                </tr>
              ) : contentItems.length > 0 ? (
                contentItems.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <div className="font-bold text-black">{content.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600 truncate max-w-xs">{content.description}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingId === content.id ? (
                        <input
                          type="number"
                          defaultValue={content.sortOrder}
                          className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-black"
                          onBlur={(e) => handleUpdateContent(content.id, { sortOrder: Number(e.target.value) })}
                        />
                      ) : (
                        <span className="text-gray-600">{content.sortOrder}</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                        content.isActive
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {content.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleUpdateContent(content.id, { isActive: !content.isActive })
                          }
                          className={`p-2 rounded-full transition-colors ${
                            content.isActive
                              ? 'hover:bg-red-50 text-red-500'
                              : 'hover:bg-green-50 text-green-500'
                          }`}
                        >
                          {content.isActive ? 'Disable' : 'Enable'}
                        </button>

                        {editingId === content.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Save className="w-4 h-4 text-green-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(content.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteContent(content.id)}
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
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">No content items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}