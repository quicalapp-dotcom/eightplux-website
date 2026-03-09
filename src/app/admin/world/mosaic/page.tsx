'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';
import { 
  subscribeToWorldMosaic, 
  addWorldMosaicImage, 
  updateWorldMosaicImage, 
  deleteWorldMosaicImage 
} from '@/lib/firebase/world';
import { WorldMosaicImage } from '@/types';

const COL_SPAN_OPTIONS = [
  { value: 'col-span-4', label: '4' },
  { value: 'col-span-6', label: '6' },
  { value: 'col-span-8', label: '8' },
  { value: 'col-span-12', label: '12' }
];

const ROW_SPAN_OPTIONS = [
  { value: 'row-span-1', label: '1' },
  { value: 'row-span-2', label: '2' }
];

export default function WorldMosaicManagement() {
  const [images, setImages] = useState<WorldMosaicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToWorldMosaic((data) => {
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddImage = async () => {
    const newImage: Omit<WorldMosaicImage, 'id' | 'sortOrder'> = {
      src: '',
      alt: '',
      className: 'col-span-4 row-span-2',
      socialLink: '',
    };
    const id = await addWorldMosaicImage(newImage);
    setImages([...images, { ...newImage, id, sortOrder: images.length }]);
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm('Delete this mosaic image?')) {
      await deleteWorldMosaicImage(id);
      setImages(images.filter(img => img.id !== id));
    }
  };

  const handleUpdateImage = async (id: string, updates: Partial<WorldMosaicImage>) => {
    await updateWorldMosaicImage(id, updates);
    setImages(images.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const handleImageUpload = (id: string, result: any) => {
    handleUpdateImage(id, { src: result.secure_url });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save all images
      for (const image of images) {
        await updateWorldMosaicImage(image.id, {
          alt: image.alt,
          className: image.className,
          socialLink: image.socialLink,
          sortOrder: image.sortOrder
        });
      }
      alert('Mosaic images saved!');
    } catch (error) {
      alert('Error saving mosaic images');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">World Mosaic Management</h1>
          <p className="text-gray-600 mt-1">Manage the mosaic grid images and social media links</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddImage}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-black">Image {images.indexOf(image) + 1}</h3>
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                {image.src ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <p className="text-gray-500">No image uploaded</p>
                  </div>
                )}
                <CloudinaryUploader
                  label="Upload Image"
                  onUpload={(result) => handleImageUpload(image.id, result)}
                  currentUrl={image.src}
                  onRemove={() => handleUpdateImage(image.id, { src: '' })}
                  accept="image/*"
                  maxSize={20}
                />
              </div>

              {/* Image Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleUpdateImage(image.id, { alt: e.target.value })}
                  placeholder="Image description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              {/* Social Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Link
                </label>
                <input
                  type="url"
                  value={image.socialLink || ''}
                  onChange={(e) => handleUpdateImage(image.id, { socialLink: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to the artist's social media profile (optional)
                </p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Column Span
                  </label>
                  <select
                    value={image.className.split(' ').find(c => c.startsWith('col-span')) || 'col-span-4'}
                    onChange={(e) => {
                      const rowSpan = image.className.split(' ').find(c => c.startsWith('row-span')) || 'row-span-2';
                      handleUpdateImage(image.id, { className: `${e.target.value} ${rowSpan}` });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  >
                    {COL_SPAN_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} columns
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Row Span
                  </label>
                  <select
                    value={image.className.split(' ').find(c => c.startsWith('row-span')) || 'row-span-2'}
                    onChange={(e) => {
                      const colSpan = image.className.split(' ').find(c => c.startsWith('col-span')) || 'col-span-4';
                      handleUpdateImage(image.id, { className: `${colSpan} ${e.target.value}` });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  >
                    {ROW_SPAN_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} rows
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-black mb-4">Preview</h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-12 gap-2 auto-rows-[100px] md:auto-rows-[150px] grid-flow-dense">
            {images.map((image) => (
              <div 
                key={image.id} 
                className={`relative overflow-hidden bg-gray-200 ${image.className}`}
              >
                {image.src && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                )}
                {image.socialLink && (
                  <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs">
                    Social Link
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
