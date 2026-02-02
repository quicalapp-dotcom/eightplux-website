'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

interface PaletteItem {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function PalettesPage() {
  const [paletteItems, setPaletteItems] = useState<PaletteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    color: '',
    imageUrl: '',
    linkUrl: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'palettes'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaletteItem[];
      
      setPaletteItems(itemsData.sort((a, b) => a.sortOrder - b.sortOrder));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.color.trim() || !newItem.imageUrl.trim()) return;
    
    try {
      await addDoc(collection(db, 'palettes'), {
        ...newItem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewItem({
        name: '',
        color: '',
        imageUrl: '',
        linkUrl: '',
        sortOrder: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding palette item:', error);
    }
  };

  const handleUpdateItem = async (id: string, updatedData: Partial<PaletteItem>) => {
    try {
      const itemRef = doc(db, 'palettes', id);
      await updateDoc(itemRef, { ...updatedData, updatedAt: new Date() });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating palette item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this palette?')) {
      try {
        await deleteDoc(doc(db, 'palettes', id));
      } catch (error) {
        console.error('Error deleting palette item:', error);
      }
    }
  };

  return (
    <div className="space-y-6 bg-white text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Shop by Palettes</h1>
          <p className="text-sm text-gray-600">Manage the "Shop by Palettes" section on the homepage.</p>
        </div>
      </div>

      {/* Add New Palette Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-black">
        <h2 className="text-lg font-medium mb-4">Add New Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Palette name"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Color (Hex)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem.color}
                onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                placeholder="#000000"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black"
              />
              <div 
                className="w-10 h-10 rounded border border-gray-200"
                style={{ backgroundColor: newItem.color }}
              />
            </div>
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
              placeholder="URL to palette page"
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
            Add Palette
          </button>
        </div>
      </div>

      {/* Palettes List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Palette Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4">Sort Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading palettes...</td>
                </tr>
              ) : paletteItems.length > 0 ? (
                paletteItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.color}</span>
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No palettes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
