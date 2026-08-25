'use client';

import React, { useState } from 'react';
import { EntityPartner, PartnerTier } from '@/types/partners';
import { Event } from '@/types/events';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, Award, Save } from 'lucide-react';

interface SponsorModalProps {
  isOpen: boolean;
  initialData?: EntityPartner | null;
  eventsList: Event[];
  onSave: (data: Omit<EntityPartner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function SponsorModal({
  isOpen,
  initialData,
  eventsList,
  onSave,
  onClose,
  isLoading = false,
}: SponsorModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    logoUrl: initialData?.logoUrl || '',
    websiteUrl: initialData?.websiteUrl || '',
    description: initialData?.description || '',
    tier: (initialData?.tier || 'gold') as PartnerTier,
    category: 'sponsor' as const,
    eventId: initialData?.eventId || '',
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const tierOptions: { label: string; value: PartnerTier }[] = [
    { label: 'Title / Platinum Sponsor', value: 'platinum' },
    { label: 'Gold Sponsor', value: 'gold' },
    { label: 'Silver Sponsor', value: 'silver' },
    { label: 'Bronze Sponsor', value: 'bronze' },
    { label: 'Official Media Sponsor', value: 'media' },
  ];

  const eventOptions = [
    { label: 'Statewide / General Brand Sponsor', value: '' },
    ...eventsList.map((e) => ({ label: e.title, value: e.id })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Sponsor name is required.';
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Sponsor logo is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      category: 'sponsor',
      name: formData.name,
      logoUrl: formData.logoUrl,
      websiteUrl: formData.websiteUrl || undefined,
      description: formData.description || undefined,
      tier: formData.tier,
      eventId: formData.eventId || undefined,
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <Card className="max-w-xl w-full p-6 border-dark-800 bg-dark-950 space-y-5 my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Corporate Sponsor' : 'Add Corporate Sponsor'}
              </h2>
              <p className="text-xs text-dark-400">Configure sponsor tier, branding deliverable, and event linkage</p>
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
            label="Sponsor Brand Logo"
            value={formData.logoUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
            folder="sponsors"
            aspectRatio="square"
            helperText="High-res transparent PNG or SVG logo."
          />
          {errors.logoUrl && <p className="text-[11px] text-red-400">{errors.logoUrl}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Corporate Sponsor Name *"
                placeholder="e.g. Apex Financial Services"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
            </div>

            <div>
              <Select
                label="Sponsorship Level"
                value={formData.tier}
                onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value as PartnerTier }))}
                options={tierOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Official Website URL"
                placeholder="https://..."
                value={formData.websiteUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
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
            label="Sponsor Description / Deliverable ROI"
            placeholder="e.g. Powered the main stage and delegate kit distribution..."
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
                <span className="text-xs font-bold text-white">Active Sponsor</span>
                <p className="text-[10px] text-dark-400">Display on website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
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
              {initialData ? 'Save Changes' : 'Add Sponsor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
