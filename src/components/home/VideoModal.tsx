'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const isGif = videoUrl.toLowerCase().endsWith('.gif');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-[80vw] max-h-[80vh] mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video/GIF Container */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl w-full h-full flex flex-col">
          {title && (
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white text-sm font-bold uppercase tracking-widest">
                {title}
              </h2>
            </div>
          )}
          <div className="flex-1 relative">
            {isGif ? (
              <img
                src={videoUrl}
                alt={title || 'Video'}
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
