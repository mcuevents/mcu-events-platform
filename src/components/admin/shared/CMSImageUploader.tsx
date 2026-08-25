'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { uploadEventImage } from '@/services/adminEvents.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCloud, Trash2, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';

interface CMSImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'banners' | 'gallery' | 'speakers' | 'sponsors';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  showAltInput?: boolean;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  helperText?: string;
}

export function CMSImageUploader({
  label = 'Asset Image',
  value,
  onChange,
  folder = 'gallery',
  aspectRatio = 'square',
  showAltInput = false,
  altValue = '',
  onAltChange,
  helperText = 'Accepts JPG, PNG, WebP (Max 5MB)',
}: CMSImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const res = await uploadEventImage(file, folder);
    setIsUploading(false);

    if (res.success && res.url) {
      onChange(res.url);
    } else {
      setError(res.error || 'Failed to upload image.');
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'h-36 sm:h-44 w-full';
      case 'wide':
        return 'h-28 sm:h-36 w-full';
      case 'portrait':
        return 'h-40 w-32';
      default:
        return 'h-28 w-28';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-dark-200">
          {label}
        </label>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Preview Container */}
        <div
          className={`relative rounded-xl overflow-hidden bg-dark-950 border border-dark-800 shrink-0 flex items-center justify-center group ${getAspectClass()}`}
        >
          {value ? (
            <>
              <Image
                src={value}
                alt={altValue || 'Uploaded asset'}
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="cursor-pointer p-2 rounded-lg bg-dark-900/90 text-white hover:text-brand-400 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-2 rounded-lg bg-dark-900/90 text-red-400 hover:text-white transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-dark-500 space-y-1 p-2">
              <ImageIcon className="h-6 w-6 mx-auto opacity-50" />
              <span className="text-[10px] block">No image selected</span>
            </div>
          )}
        </div>

        {/* Upload Controls & URL Input */}
        <div className="flex-1 w-full space-y-2.5">
          <Input
            placeholder="https://images.unsplash.com/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-dark-800 text-xs font-semibold text-dark-300 hover:text-white hover:border-brand-500/40 transition-colors">
              <UploadCloud className="h-3.5 w-3.5 text-brand-400" />
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            <span className="text-[10px] text-dark-500">{helperText}</span>
          </div>

          {showAltInput && (
            <Input
              placeholder="Descriptive alt text for accessibility..."
              value={altValue}
              onChange={(e) => onAltChange && onAltChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
