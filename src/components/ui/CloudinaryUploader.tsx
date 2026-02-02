'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUpload: (result: any) => void;
  onRemove?: () => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  isVideo?: boolean;
}

export default function CloudinaryUploader({
  onUpload,
  onRemove,
  currentUrl,
  accept = 'image/*,video/*',
  maxSize = 10,
  label = 'Upload File',
  isVideo = false,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      setIsUploading(false);
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64File,
          folder: isVideo ? 'eightplux/videos' : 'eightplux/images',
          resource_type: isVideo ? 'video' : 'image',
        }),
      });

      const result = await response.json();

      if (result.success) {
        onUpload(result.data);
      } else {
        throw new Error(result.error || 'Upload failed');
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

  if (currentUrl) {
    return (
      <div className="space-y-3">
        {isVideo ? (
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
              {isVideo ? (
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
