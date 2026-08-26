'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface LightboxImage {
  url: string;
  title?: string;
  caption?: string;
}

export interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function ImageLightboxModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: ImageLightboxModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    },
    [isOpen, onClose, currentIndex, images.length, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 bg-dark-950/80 border border-dark-800 px-3 py-1.5 rounded-full text-xs font-mono text-dark-300">
          <Maximize2 className="h-3.5 w-3.5 text-brand-400" />
          <span>
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Lightbox"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-950/80 border border-dark-800 text-dark-300 hover:text-white hover:border-brand-500/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation: Prev Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + images.length) % images.length);
          }}
          aria-label="Previous Image"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-dark-950/80 border border-dark-800 text-white hover:bg-dark-900 hover:border-brand-500/50 transition-all shadow-xl"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-h-[85vh] max-w-5xl w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImg.url}
          alt={currentImg.title || `Gallery view ${currentIndex + 1}`}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-dark-800"
        />

        {(currentImg.title || currentImg.caption) && (
          <div className="mt-4 text-center max-w-2xl px-4">
            {currentImg.title && (
              <h4 className="text-sm font-bold text-white">{currentImg.title}</h4>
            )}
            {currentImg.caption && (
              <p className="text-xs text-dark-300 mt-1">{currentImg.caption}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation: Next Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % images.length);
          }}
          aria-label="Next Image"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-dark-950/80 border border-dark-800 text-white hover:bg-dark-900 hover:border-brand-500/50 transition-all shadow-xl"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
