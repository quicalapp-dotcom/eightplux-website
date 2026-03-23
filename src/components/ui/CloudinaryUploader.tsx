'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUpload: (result: any) => void;
  onRemove?: () => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  isVideo?: boolean;
  compact?: boolean;
}

export default function CloudinaryUploader({
  onUpload,
  onRemove,
  currentUrl,
  accept = 'image/*,video/*',
  maxSize = 10,
  label = 'Upload File',
  isVideo = false,
  compact = false,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect if currentUrl is a video based on extension
  const isVideoUrl = currentUrl ? /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(currentUrl) : false;
  const displayAsVideo = isVideo || isVideoUrl;

  // Upload directly to Cloudinary (bypasses Vercel's payload limit)
  const uploadDirectToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'eightplux');
    formData.append('folder', resourceType === 'video' ? 'eightplux/videos' : 'eightplux/images');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }
    
    return await response.json();
  };

  // Upload via API route (for smaller files like images)
  const uploadViaApi = async (base64File: string, resourceType: 'image' | 'video') => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64File,
        folder: resourceType === 'video' ? 'eightplux/videos' : 'eightplux/images',
        resource_type: resourceType,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    
    return result.data;
  };

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      setIsUploading(false);
      return;
    }

    try {
      const resourceType = displayAsVideo ? 'video' : 'image';
      
      // For videos (large files), use direct upload to Cloudinary
      // For images (smaller files), use the API route
      let result;
      if (resourceType === 'video' || file.size > 2 * 1024 * 1024) {
        // Files > 2MB or videos: upload directly to Cloudinary
        console.log('Using direct Cloudinary upload for:', file.name, file.size);
        result = await uploadDirectToCloudinary(file, resourceType);
        onUpload({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      } else {
        // Smaller files: use API route
        const reader = new FileReader();
        const base64File = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        result = await uploadViaApi(base64File, resourceType);
        onUpload(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Generate a stable unique id
  const uploadId = React.useId();

  if (compact) {
    return (
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          id={`compact-upload-input-${uploadId}`}
        />
        <label
          htmlFor={`compact-upload-input-${uploadId}`}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
          title={label}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : displayAsVideo ? (
            <Video className="w-4 h-4" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </label>
        {error && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (currentUrl) {
    return (
      <div className="space-y-3">
        {displayAsVideo ? (
          <video
            src={currentUrl}
            controls
            className="w-full max-w-md h-64 object-cover rounded-lg"
          />
        ) : (
          <img
            src={currentUrl}
            alt="Preview"
            className="w-full max-w-md h-64 object-cover rounded-lg"
          />
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        id="upload-input"
      />
      <label
        htmlFor="upload-input"
        className="flex flex-col items-center gap-3 cursor-pointer"
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {displayAsVideo ? (
                <Video className="w-6 h-6 text-gray-600" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-500">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-gray-400">
                Max size: {maxSize}MB
              </p>
            </div>
          </>
        )}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
