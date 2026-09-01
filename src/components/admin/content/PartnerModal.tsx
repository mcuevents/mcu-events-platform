'use client';

import React, { useState } from 'react';
import { EntityPartner, PartnerTier } from '@/types/partners';
import { Event } from '@/types/events';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, Handshake, Save } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  initialData?: EntityPartner | null;
  eventsList: Event[];
  onSave: (data: Omit<EntityPartner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function PartnerModal({
  isOpen,
  initialData,
  eventsList,
  onSave,
  onClose,
  isLoading = false,
}: PartnerModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    logoUrl: initialData?.logoUrl || '',
    websiteUrl: initialData?.websiteUrl || '',
    description: initialData?.description || '',
    tier: (initialData?.tier || 'general') as PartnerTier,
    category: 'partner' as const,
    eventId: initialData?.eventId || '',
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const tierOptions: { label: string; value: PartnerTier }[] = [
    { label: 'Platinum Alliance', value: 'platinum' },
    { label: 'Gold Partner', value: 'gold' },
    { label: 'Silver Associate', value: 'silver' },
    { label: 'Media & Outreach', value: 'media' },
    { label: 'General Chamber / Body', value: 'general' },
  ];

  const eventOptions = [
    { label: 'Institutional / Statewide Partner', value: '' },
    ...eventsList.map((e) => ({ label: e.title, value: e.id })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Partner name is required.';
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Partner logo is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      category: 'partner',
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
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Strategic Partner' : 'Add Strategic Partner'}
              </h2>
              <p className="text-xs text-dark-400">Manage institutional chambers, trade bodies, and alliances</p>
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
            label="Partner Logo"
            value={formData.logoUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
            folder="sponsors"
            aspectRatio="square"
            helperText="Transparent PNG or high-res SVG/JPG logo."
          />
          {errors.logoUrl && <p className="text-[11px] text-red-400">{errors.logoUrl}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Partner / Chamber Name *"
                placeholder="e.g. CODISSIA Trade Fair Complex"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
            </div>

            <div>
              <Select
                label="Partner Alliance Tier"
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
            label="Description / Partnership Scope"
            placeholder="Brief scope of institutional collaboration..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Sequence Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-800 self-end">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">Active Status</span>
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
              {initialData ? 'Save Changes' : 'Add Partner'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
