'use client';

import React, { useState } from 'react';
import { TeamMember } from '@/types/cms';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { X, Users, Save } from 'lucide-react';

interface TeamMemberModalProps {
  isOpen: boolean;
  initialData?: TeamMember | null;
  onSave: (data: Omit<TeamMember, 'id'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function TeamMemberModal({
  isOpen,
  initialData,
  onSave,
  onClose,
  isLoading = false,
}: TeamMemberModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
    imageUrl: initialData?.imageUrl || '',
    email: initialData?.email || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.role.trim()) newErrors.role = 'Role / Designation is required.';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Profile photo is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave({
      name: formData.name,
      role: formData.role,
      bio: formData.bio || undefined,
      imageUrl: formData.imageUrl,
      email: formData.email || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      instagramUrl: formData.instagramUrl || undefined,
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
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <p className="text-xs text-dark-400">Manage executive leadership and organizing committee profiles</p>
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
            label="Executive Headshot Photo"
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            folder="speakers"
            aspectRatio="portrait"
            helperText="High-quality portrait photo (JPG, PNG, WebP)."
          />
          {errors.imageUrl && <p className="text-[11px] text-red-400">{errors.imageUrl}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Full Name *"
                placeholder="e.g. M. Ragul"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
            </div>

            <div>
              <Input
                label="Designation / Role *"
                placeholder="e.g. Founder & Managing Director"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                error={errors.role}
              />
            </div>
          </div>

          <Textarea
            label="Executive Bio"
            placeholder="Brief professional background and career achievements..."
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Input
              label="Work Email"
              placeholder="name@mcucreations.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedinUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
            />
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/..."
              value={formData.instagramUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))}
            />
          </div>

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
                <span className="text-xs font-bold text-white">Active Profile</span>
                <p className="text-[10px] text-dark-400">Show on public About page</p>
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
              {initialData ? 'Save Profile' : 'Add Team Member'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
