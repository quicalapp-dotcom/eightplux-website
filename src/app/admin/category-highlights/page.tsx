'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface CategoryHighlight {
  id: string;
  categoryId: string; // Reference to the category
  description: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export default function CategoryHighlightsPage() {
  const [highlights, setHighlights] = useState<CategoryHighlight[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState({
    categoryId: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'category_highlights'), (snapshot) => {
      const highlightsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CategoryHighlight[];

      setHighlights(highlightsData.sort((a, b) => a.sortOrder - b.sortOrder));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      setCategories(categoriesData.filter(cat => cat.isActive)); // Only show active categories
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddHighlight = async () => {
    if (!newHighlight.categoryId) return; // Need to select a category

    try {
      await addDoc(collection(db, 'category_highlights'), {
        ...newHighlight,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setNewHighlight({
        categoryId: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        sortOrder: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding category highlight:', error);
    }
  };

  const handleUpdateHighlight = async (id: string, updatedData: Partial<CategoryHighlight>) => {
    try {
      const highlightRef = doc(db, 'category_highlights', id);
      await updateDoc(highlightRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating category highlight:', error);
    }
  };

  const handleDeleteHighlight = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category highlight?')) {
      try {
        await deleteDoc(doc(db, 'category_highlights', id));
      } catch (error) {
        console.error('Error deleting category highlight:', error);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Category Highlights</h1>
          <p className="text-sm text-gray-600">Manage featured categories on the homepage.</p>
        </div>
      </div>

      {/* Add New Highlight Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Category Highlight</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Category</label>
            <select
              value={newHighlight.categoryId}
              onChange={(e) => setNewHighlight({...newHighlight, categoryId: e.target.value})}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
            <input
              type="text"
              value={newHighlight.linkUrl}
              onChange={(e) => setNewHighlight({...newHighlight, linkUrl: e.target.value})}
              placeholder="URL to category page"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
            <input
              type="text"
              value={newHighlight.imageUrl}
              onChange={(e) => setNewHighlight({...newHighlight, imageUrl: e.target.value})}
              placeholder="URL to category image"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Sort Order</label>
            <input
              type="number"
              value={newHighlight.sortOrder}
              onChange={(e) => setNewHighlight({...newHighlight, sortOrder: Number(e.target.value)})}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={newHighlight.description}
              onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
              placeholder="Category description"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
              rows={3}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
          <button
            onClick={() => setNewHighlight({...newHighlight, isActive: !newHighlight.isActive})}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest ${
              newHighlight.isActive
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {newHighlight.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            onClick={handleAddHighlight}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>
      </div>

      {/* Highlights List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Category Highlights</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Category</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Sort Order</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">Loading highlights...</td>
                </tr>
              ) : highlights.length > 0 ? (
                highlights.map((highlight) => {
                  const associatedCategory = categories.find(cat => cat.id === highlight.categoryId);
                  return (
                    <tr key={highlight.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <div className="font-bold text-black">{associatedCategory?.name || 'Unknown Category'}</div>
                          <div className="text-xs sm:text-sm text-gray-600 truncate max-w-xs">{highlight.description}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {editingId === highlight.id ? (
                          <input
                            type="number"
                            defaultValue={highlight.sortOrder}
                            className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-black"
                            onBlur={(e) => handleUpdateHighlight(highlight.id, { sortOrder: Number(e.target.value) })}
                          />
                        ) : (
                          <span className="text-gray-600">{highlight.sortOrder}</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                          highlight.isActive
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          {highlight.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleUpdateHighlight(highlight.id, { isActive: !highlight.isActive })
                            }
                            className={`p-2 rounded-full transition-colors ${
                              highlight.isActive
                                ? 'hover:bg-red-50 text-red-500'
                                : 'hover:bg-green-50 text-green-500'
                            }`}
                          >
                            {highlight.isActive ? 'Disable' : 'Enable'}
                          </button>

                          {editingId === highlight.id ? (
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Save className="w-4 h-4 text-green-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingId(highlight.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteHighlight(highlight.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">No category highlights found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}