'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

interface WhatsNewItem {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function WhatsNewPage() {
  const [whatsNewItems, setWhatsNewItems] = useState<WhatsNewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    imageUrl: '',
    linkUrl: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'whats_new'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WhatsNewItem[];
      
      setWhatsNewItems(itemsData.sort((a, b) => a.sortOrder - b.sortOrder));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.imageUrl.trim()) return;
    
    try {
      await addDoc(collection(db, 'whats_new'), {
        ...newItem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewItem({
        name: '',
        imageUrl: '',
        linkUrl: '',
        sortOrder: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding what\'s new item:', error);
    }
  };

  const handleUpdateItem = async (id: string, updatedData: Partial<WhatsNewItem>) => {
    try {
      const itemRef = doc(db, 'whats_new', id);
      await updateDoc(itemRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating what\'s new item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'whats_new', id));
      } catch (error) {
        console.error('Error deleting what\'s new item:', error);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">What's New at 8+</h1>
          <p className="text-sm text-gray-600">Manage the "What's New" section on the homepage.</p>
        </div>
      </div>

      {/* Add New Item Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Item name"
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
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
            <input
              type="text"
              value={newItem.linkUrl}
              onChange={(e) => setNewItem({...newItem, linkUrl: e.target.value})}
              placeholder="URL to item page"
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
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
            Add Item
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">What's New Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Sort Order</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">Loading items...</td>
                </tr>
              ) : whatsNewItems.length > 0 ? (
                whatsNewItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="font-bold text-black">{item.name}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                        item.isActive
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
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
                  <td colSpan={4} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
