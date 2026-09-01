'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/types/cms';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, MessageSquareQuote, Save, Star } from 'lucide-react';

interface TestimonialModalProps {
  isOpen: boolean;
  initialData?: Testimonial | null;
  onSave: (data: Omit<Testimonial, 'id'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function TestimonialModal({
  isOpen,
  initialData,
  onSave,
  onClose,
  isLoading = false,
}: TestimonialModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    clientTitle: initialData?.clientTitle || '',
    companyName: initialData?.companyName || '',
    content: initialData?.content || '',
    rating: initialData?.rating || 5,
    avatarUrl: initialData?.avatarUrl || '',
    displayOrder: initialData?.displayOrder || 0,
    isPublished: initialData?.isPublished ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required.';
    if (!formData.content.trim()) newErrors.content = 'Testimonial quote is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      clientName: formData.clientName,
      clientTitle: formData.clientTitle || undefined,
      companyName: formData.companyName || undefined,
      content: formData.content,
      rating: Number(formData.rating) || 5,
      avatarUrl: formData.avatarUrl || undefined,
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
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h2>
              <p className="text-xs text-dark-400">Manage client endorsements, verified quotes, and star ratings</p>
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
            label="Client Avatar Photo"
            value={formData.avatarUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
            folder="speakers"
            aspectRatio="square"
            helperText="Square headshot (JPG, PNG, WebP)."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Client / Endorser Name *"
                placeholder="e.g. Senthil Nathan"
                value={formData.clientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                error={errors.clientName}
              />
            </div>

            <div>
              <Input
                label="Job Designation / Title"
                placeholder="e.g. Managing Director"
                value={formData.clientTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientTitle: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Company / Brand"
                placeholder="e.g. Kovai BioTech Equipments"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <Select
                label="Star Rating"
                value={formData.rating.toString()}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                options={[
                  { label: '★★★★★ (5 Stars - Exceptional)', value: '5' },
                  { label: '★★★★☆ (4 Stars - Highly Satisfied)', value: '4' },
                  { label: '★★★☆☆ (3 Stars - Good)', value: '3' },
                ]}
              />
            </div>
          </div>

          <Textarea
            label="Testimonial Quote *"
            placeholder="Direct quote detailing event turnout, stall ROI, or marketing campaign success..."
            rows={3}
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            error={errors.content}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Sequence Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-800 self-end">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">Public Display</span>
                <p className="text-[10px] text-dark-400">Show in homepage carousel</p>
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

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-dark-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
              {initialData ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
