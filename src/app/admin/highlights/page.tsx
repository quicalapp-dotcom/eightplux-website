'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

interface HighlightItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function HighlightsPage() {
  const [highlightItems, setHighlightItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'highlights'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HighlightItem[];
      
      setHighlightItems(itemsData.sort((a, b) => a.sortOrder - b.sortOrder));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.description.trim() || !newItem.imageUrl.trim()) return;
    
    try {
      await addDoc(collection(db, 'highlights'), {
        ...newItem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewItem({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        linkText: '',
        sortOrder: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding highlight item:', error);
    }
  };

  const handleUpdateItem = async (id: string, updatedData: Partial<HighlightItem>) => {
    try {
      const itemRef = doc(db, 'highlights', id);
      await updateDoc(itemRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating highlight item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        await deleteDoc(doc(db, 'highlights', id));
      } catch (error) {
        console.error('Error deleting highlight item:', error);
      }
    }
  };

  return (
    <div className="space-y-6 bg-white text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Catch the Highlights</h1>
          <p className="text-sm text-gray-600">Manage the "Catch the Highlights" section on the homepage.</p>
        </div>
      </div>

      {/* Add New Highlight Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Highlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Title</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              placeholder="Highlight title"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image</label>
            <CloudinaryUploader
              onUpload={(result) => setNewItem({...newItem, imageUrl: result.secure_url})}
              onRemove={() => setNewItem({...newItem, imageUrl: ''})}
              currentUrl={newItem.imageUrl}
              label="Upload Image"
              maxSize={5}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Highlight description"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
            <input
              type="text"
              value={newItem.linkUrl}
              onChange={(e) => setNewItem({...newItem, linkUrl: e.target.value})}
              placeholder="URL to highlight page"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link Text</label>
            <input
              type="text"
              value={newItem.linkText}
              onChange={(e) => setNewItem({...newItem, linkText: e.target.value})}
              placeholder="Text for the link button"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Sort Order</label>
            <input
              type="number"
              value={newItem.sortOrder}
              onChange={(e) => setNewItem({...newItem, sortOrder: Number(e.target.value)})}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setNewItem({...newItem, isActive: !newItem.isActive})}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest ${
              newItem.isActive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {newItem.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>
      </div>

      {/* Highlights List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Highlight Items</h2>
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
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading highlights...</td>
                </tr>
              ) : highlightItems.length > 0 ? (
                highlightItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-black">{item.title}</div>
                        <div className="text-xs text-gray-600 truncate max-w-xs">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          defaultValue={item.sortOrder}
                          className="w-16 p-1 bg-gray-50 border border-gray-200 rounded text-black"
                          onBlur={(e) => handleUpdateItem(item.id, { sortOrder: Number(e.target.value) })}
                        />
                      ) : (
                        <span className="text-gray-600">{item.sortOrder}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        item.isActive 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => 
                            handleUpdateItem(item.id, { isActive: !item.isActive })
                          }
                          className={`p-2 rounded-full transition-colors ${
                            item.isActive 
                              ? 'hover:bg-red-50 text-red-500' 
                              : 'hover:bg-green-50 text-green-500'
                          }`}
                        >
                          {item.isActive ? 'Disable' : 'Enable'}
                        </button>
                        
                        {editingId === item.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Save className="w-4 h-4 text-green-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No highlights found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
