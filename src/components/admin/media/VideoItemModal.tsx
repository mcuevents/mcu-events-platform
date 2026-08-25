'use client';

import React, { useState } from 'react';
import { VideoItem } from '@/types/media';
import { Event } from '@/types/events';
import { validateVideoUrl, getSafeEmbedUrl } from '@/services/adminMedia.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, Video as VideoIcon, Save, Play } from 'lucide-react';

interface VideoItemModalProps {
  isOpen: boolean;
  initialData?: VideoItem | null;
  eventsList: Event[];
  onSave: (data: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function VideoItemModal({
  isOpen,
  initialData,
  eventsList,
  onSave,
  onClose,
  isLoading = false,
}: VideoItemModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    videoUrl: initialData?.videoUrl || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    category: initialData?.category || 'events',
    eventId: initialData?.eventId || '',
    displayOrder: initialData?.displayOrder || 0,
    isPublished: initialData?.isPublished ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { label: 'Expos & Highlights', value: 'events' },
    { label: 'Keynote & Speeches', value: 'keynotes' },
    { label: 'Exhibitor Interviews', value: 'interviews' },
    { label: 'Corporate Showreels', value: 'showreels' },
  ];

  const eventOptions = [
    { label: 'None (General Brand Reel)', value: '' },
    ...eventsList.map((e) => ({ label: e.title, value: e.id })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required.';
    } else {
      const validation = validateVideoUrl(formData.videoUrl);
      if (!validation.isValid) {
        newErrors.videoUrl = validation.error || 'Invalid video URL.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const validation = validateVideoUrl(formData.videoUrl);

    await onSave({
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      platform: validation.platform as any,
      category: formData.category,
      eventId: formData.eventId || undefined,
      displayOrder: Number(formData.displayOrder) || 0,
      isPublished: formData.isPublished,
      isFeatured: formData.isFeatured,
    });
  };

  const safeEmbed = formData.videoUrl ? getSafeEmbedUrl(formData.videoUrl, 'youtube') : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <Card className="max-w-xl w-full p-6 border-dark-800 bg-dark-950 space-y-5 my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <VideoIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Video Feature' : 'Add Video Feature'}
              </h2>
              <p className="text-xs text-dark-400">Embed YouTube, Vimeo, or external event showreels</p>
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
          <div>
            <Input
              label="Video Title *"
              placeholder="e.g. Tamil Nadu Franchise Expo 2026 Official Aftermovie"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              error={errors.title}
            />
          </div>

          <div>
            <Input
              label="Video Link (YouTube / Vimeo / HTTPS) *"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
              error={errors.videoUrl}
            />
            <p className="text-[10px] text-dark-500 mt-1">
              Supports standard YouTube, Shorts, and Vimeo links. Auto-converts to safe embed player.
            </p>
          </div>

          {/* Live Preview Embed */}
          {safeEmbed && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-dark-400">Live Embed Preview</span>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-dark-900 border border-dark-800">
                <iframe
                  src={safeEmbed}
                  title="Video Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <CMSImageUploader
            label="Custom Video Poster / Thumbnail (Optional)"
            value={formData.thumbnailUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
            folder="gallery"
            aspectRatio="video"
            helperText="Overrides video platform default thumbnail"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Select
                label="Video Category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                options={categoryOptions}
              />
            </div>

            <div>
              <Select
                label="Associated Event (Optional)"
                value={formData.eventId}
                onChange={(e) => setFormData((prev) => ({ ...prev, eventId: e.target.value }))}
                options={eventOptions}
              />
            </div>
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="Brief overview of event highlights covered in this video..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Display Order Sequence"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-800 self-end">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">Public Video</span>
                <p className="text-[10px] text-dark-400">Show on public media page</p>
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
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-dark-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
              {initialData ? 'Save Video' : 'Add to Video Showcase'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
