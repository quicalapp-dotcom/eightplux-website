'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      setCategories(categoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory.name,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: newCategory.description,
        isActive: newCategory.isActive,
        createdAt: new Date()
      });
      
      setNewCategory({ name: '', description: '', isActive: true });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (id: string, updatedData: Partial<Category>) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, updatedData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Categories</h1>
          <p className="text-sm text-gray-600">Manage product categories for your store.</p>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Category</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              placeholder="e.g. T-shirts, Jackets, Accessories"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Brief description of the category"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
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
                <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Description</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          defaultValue={category.name}
                          className="w-full p-1 bg-gray-50 border border-gray-200 rounded text-black"
                          onBlur={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                        />
                      ) : (
                        <span className="font-bold text-black">{category.name}</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          defaultValue={category.description || ''}
                          className="w-full p-1 bg-gray-50 border border-gray-200 rounded text-black"
                          onBlur={(e) => handleUpdateCategory(category.id, { description: e.target.value })}
                        />
                      ) : (
                        <span className="text-gray-600">{category.description || '-'}</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                        category.isActive
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleUpdateCategory(category.id, { isActive: !category.isActive })
                          }
                          className={`p-2 rounded-full transition-colors ${
                            category.isActive
                              ? 'hover:bg-red-50 text-red-500'
                              : 'hover:bg-green-50 text-green-500'
                          }`}
                        >
                          {category.isActive ? 'Disable' : 'Enable'}
                        </button>

                        {editingId === category.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Save className="w-4 h-4 text-green-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(category.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}