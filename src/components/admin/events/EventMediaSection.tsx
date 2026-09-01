'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { AdminEventFormData } from '@/types/events';
import { uploadEventImage } from '@/services/adminEvents.service';
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Plus,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface EventMediaSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
  errors?: Record<string, string>;
}

export function EventMediaSection({
  formData,
  onChange,
  errors = {},
}: EventMediaSectionProps) {
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    setMediaError(null);

    const res = await uploadEventImage(file, 'banners');
    setUploadingBanner(false);

    if (res.success && res.url) {
      onChange({ bannerImage: res.url });
    } else {
      setMediaError(res.error || 'Failed to upload hero banner image.');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setMediaError(null);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const res = await uploadEventImage(files[i], 'gallery');
      if (res.success && res.url) {
        uploadedUrls.push(res.url);
      }
    }

    setUploadingGallery(false);
    if (uploadedUrls.length > 0) {
      const currentGallery = formData.galleryImages || [];
      onChange({ galleryImages: [...currentGallery, ...uploadedUrls] });
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const current = [...(formData.galleryImages || [])];
    current.splice(index, 1);
    onChange({ galleryImages: current });
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <ImageIcon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white">Event Media & Gallery</h2>
          <p className="text-[11px] text-dark-400">Hero banner cover, card thumbnail, and photo album</p>
        </div>
      </div>

      {mediaError && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{mediaError}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-dark-200 block">
          Hero Banner Cover Image (16:9 / 21:9 Widescreen) *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              label="Banner Image URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.bannerImage}
              onChange={(e) => onChange({ bannerImage: e.target.value })}
              error={errors.bannerImage}
              required
            />

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-dark-800 text-xs font-semibold text-dark-300 hover:text-white hover:border-brand-500/40 transition-colors">
                <UploadCloud className="h-3.5 w-3.5 text-brand-400" />
                <span>{uploadingBanner ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerUpload}
                  className="hidden"
                  disabled={uploadingBanner}
                />
              </label>
              <span className="text-[10px] text-dark-500">Max 5MB (JPG, PNG, WebP)</span>
            </div>
          </div>

          {/* Banner Preview Box */}
          <div className="relative h-32 rounded-xl overflow-hidden bg-dark-950 border border-dark-800 flex items-center justify-center">
            {formData.bannerImage ? (
              <Image
                src={formData.bannerImage}
                alt="Banner Preview"
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : (
              <div className="text-center text-dark-500 space-y-1">
                <ImageIcon className="h-6 w-6 mx-auto opacity-50" />
                <span className="text-[11px] block">No banner image set</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Images Section */}
      <div className="space-y-3 pt-3 border-t border-dark-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-dark-200 block">
              Event Photo Gallery & Past Editions
            </label>
            <span className="text-[10px] text-dark-400">
              High-resolution photo moments rendered in the interactive lightbox
            </span>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 text-dark-950 text-xs font-bold hover:bg-brand-400 transition-colors shadow">
            <Plus className="h-3.5 w-3.5" />
            <span>{uploadingGallery ? 'Uploading...' : 'Add Gallery Photos'}</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryUpload}
              className="hidden"
              disabled={uploadingGallery}
            />
          </label>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {(formData.galleryImages || []).map((imgUrl, idx) => (
            <div
              key={idx}
              className="group relative h-24 rounded-xl overflow-hidden bg-dark-950 border border-dark-800"
            >
              <Image
                src={imgUrl}
                alt={`Gallery photo ${idx + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(idx)}
                title="Remove photo"
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-black/80 text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          {(!formData.galleryImages || formData.galleryImages.length === 0) && (
            <div className="col-span-full p-6 text-center rounded-xl bg-dark-950/60 border border-dark-800 text-xs text-dark-400">
              No gallery images uploaded yet. Click &quot;Add Gallery Photos&quot; to attach event moments.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
