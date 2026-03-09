'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Video, X } from 'lucide-react';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';
import { subscribeToWorldHero, updateWorldHero } from '@/lib/firebase/world';
import { WorldHeroData } from '@/types';

export default function WorldHeroManagementPage() {
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState<WorldHeroData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToWorldHero((data) => {
      setHeroData(data);
      setDataLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!heroData) return;
    
    setSaving(true);
    try {
      await updateWorldHero(heroData);
      alert('World hero updated successfully!');
    } catch (error) {
      alert('Failed to update world hero');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadMedia = (result: any) => {
    try {
      setHeroData({
        ...heroData!,
        mediaUrl: result.secure_url,
        mediaType: result.format === 'mp4' || result.format === 'webm' || result.format === 'mov' ? 'video' : 'image'
      });
    } catch (error) {
      alert('Upload failed');
    }
  };

  const handleRemoveMedia = () => {
    setHeroData({
      ...heroData!,
      mediaUrl: '/whero.jpg',
      mediaType: 'image'
    });
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-sm uppercase tracking-widest text-gray-500">Loading world hero section...</p>
        </div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">World hero section not initialized</p>
          <div className="text-sm text-gray-500">
            Please initialize the world hero section from the world management page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">World Hero Management</h1>
            <p className="text-sm text-gray-600 mt-1">Customize the hero section for the World of Eightplux page</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Media Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Hero Background</h2>
            
            {heroData.mediaUrl && heroData.mediaUrl !== '/whero.jpg' && (
              <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-200">
                {heroData.mediaType === 'video' ? (
                  <video
                    src={heroData.mediaUrl}
                    controls
                    className="w-full h-auto"
                  />
                ) : (
                  <img
                    src={heroData.mediaUrl}
                    alt="World hero"
                    className="w-full h-auto"
                  />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <CloudinaryUploader
              onUpload={handleUploadMedia}
              onRemove={handleRemoveMedia}
              currentUrl={heroData.mediaUrl !== '/whero.jpg' ? heroData.mediaUrl : undefined}
              accept="image/*,video/*"
              label="Upload Hero Image/Video"
            />

            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPG, PNG, WebP for images; MP4, WebM for videos
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Section Status</h2>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroData.isActive}
                  onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm">Show hero section</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
