'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/types/media';
import { Event } from '@/types/events';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, Image as ImageIcon, Save, Sparkles } from 'lucide-react';

interface GalleryItemModalProps {
  isOpen: boolean;
  initialData?: GalleryItem | null;
  eventsList: Event[];
  onSave: (data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function GalleryItemModal({
  isOpen,
  initialData,
  eventsList,
  onSave,
  onClose,
  isLoading = false,
}: GalleryItemModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    caption: initialData?.caption || '',
    imageUrl: initialData?.imageUrl || '',
    altText: initialData?.altText || '',
    category: initialData?.category || 'events',
    eventId: initialData?.eventId || '',
    displayOrder: initialData?.displayOrder || 0,
    isPublished: initialData?.isPublished ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { label: 'Expos & Events', value: 'events' },
    { label: 'Exhibitions & Stalls', value: 'exhibitions' },
    { label: 'Corporate Conclaves', value: 'corporate' },
    { label: 'Concerts & Entertainment', value: 'entertainment' },
    { label: 'Behind The Scenes', value: 'behind_the_scenes' },
  ];

  const eventOptions = [
    { label: 'None (General Gallery)', value: '' },
    ...eventsList.map((e) => ({ label: e.title, value: e.id })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      title: formData.title,
      caption: formData.caption,
      imageUrl: formData.imageUrl,
      altText: formData.altText || formData.title,
      category: formData.category,
      eventId: formData.eventId || undefined,
      displayOrder: Number(formData.displayOrder) || 0,
      isPublished: formData.isPublished,
      isFeatured: formData.isFeatured,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <Card className="max-w-xl w-full p-6 border-dark-800 bg-dark-950 space-y-5 my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
              </h2>
              <p className="text-xs text-dark-400">Manage high-resolution showcase image and metadata</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <CMSImageUploader
            label="Gallery Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            folder="gallery"
            aspectRatio="wide"
            showAltInput
            altValue={formData.altText}
            onAltChange={(alt) => setFormData((prev) => ({ ...prev, altText: alt }))}
            helperText="High-res photos (JPG, PNG, WebP). Alt text recommended for SEO."
          />
          {errors.imageUrl && <p className="text-[11px] text-red-400">{errors.imageUrl}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Photo Title *"
                placeholder="e.g. Grand Inauguration Gala 2026"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                error={errors.title}
              />
            </div>

            <div>
              <Select
                label="Album Category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                options={categoryOptions}
              />
            </div>
          </div>

          <Textarea
            label="Caption / Brief Story"
            placeholder="Brief background or highlight about this photo..."
            rows={2}
            value={formData.caption}
            onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Select
                label="Associated Event (Optional)"
                value={formData.eventId}
                onChange={(e) => setFormData((prev) => ({ ...prev, eventId: e.target.value }))}
                options={eventOptions}
              />
            </div>

            <div>
              <Input
                label="Display Sequence Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white">Public Visibility</span>
              <p className="text-[10px] text-dark-400">Controls whether photo appears on the public website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-dark-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
              {initialData ? 'Save Changes' : 'Publish to Gallery'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
