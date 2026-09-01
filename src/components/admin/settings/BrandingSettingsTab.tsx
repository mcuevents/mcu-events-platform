'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandingSettings } from '@/types/globalSettings';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Palette, Image as ImageIcon, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValidHexColor } from '@/services/globalSettings.service';

interface BrandingSettingsTabProps {
  initialData: BrandingSettings;
  onSave: (data: BrandingSettings) => Promise<{ success: boolean; error?: string }>;
}

export const BrandingSettingsTab: React.FC<BrandingSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<BrandingSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleColorChange = (key: keyof BrandingSettings['brandColors'], val: string) => {
    setData((prev) => ({
      ...prev,
      brandColors: {
        ...prev.brandColors,
        [key]: val,
      },
    }));
  };

  const handleReset = () => {
    setData(initialData);
    setFeedback(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!isValidHexColor(data.brandColors.primaryColor)) {
      newErrors.primaryColor = 'Must be a valid hex color code (e.g. #E6A817).';
    }
    if (!isValidHexColor(data.brandColors.secondaryColor)) {
      newErrors.secondaryColor = 'Must be a valid hex color code (e.g. #0B0F19).';
    }
    if (!isValidHexColor(data.brandColors.accentColor)) {
      newErrors.accentColor = 'Must be a valid hex color code (e.g. #3B82F6).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(data);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Branding logos, favicon, and brand color palette updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save branding settings.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-dark-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 1. Logo & Asset Uploads */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-brand-400" />
          Official Logo Assets & Favicon
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CMSImageUploader
            label="Primary Header Logo URL *"
            value={data.primaryLogoUrl}
            onChange={(val) => setData({ ...data, primaryLogoUrl: val })}
            helperText="Recommended: Transparent PNG, SVG, or high-res WebP"
          />

          <CMSImageUploader
            label="Footer Logo URL (Optional)"
            value={data.footerLogoUrl || ''}
            onChange={(val) => setData({ ...data, footerLogoUrl: val })}
            helperText="Used in the dark footer. Falls back to Primary Logo if empty."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-dark-800">
          <CMSImageUploader
            label="Website Browser Favicon (.ico, .png, .svg)"
            value={data.faviconUrl || ''}
            onChange={(val) => setData({ ...data, faviconUrl: val })}
            helperText="Square 32x32px or 64x64px icon shown on browser tabs"
          />

          <div className="p-4 rounded-xl bg-dark-950/60 border border-dark-800 flex flex-col justify-center space-y-2 text-xs">
            <span className="font-bold text-white block">Asset Upload Guidelines:</span>
            <ul className="space-y-1 text-dark-300 list-disc list-inside text-[11px]">
              <li>Supported file formats: PNG, SVG, WebP, JPEG</li>
              <li>Maximum recommended file size: 2MB</li>
              <li>Storage Bucket: <span className="font-mono text-brand-400">media-gallery</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Controlled Brand Color Tokens */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-400" />
          Controlled Brand Colors (Design Token Palette)
        </h3>
        <p className="text-xs text-dark-400">
          Control primary accents and highlight tones safely across buttons, badges, and gradients.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
          {/* Primary Color */}
          <div className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 space-y-2.5">
            <label className="block text-xs font-bold text-white">Primary Gold Accent</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={data.brandColors.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="h-9 w-9 rounded-lg border border-dark-700 bg-transparent cursor-pointer"
              />
              <Input
                placeholder="#E6A817"
                value={data.brandColors.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                error={errors.primaryColor}
              />
            </div>
            <span className="text-[10px] text-dark-400 block">Used for primary buttons, highlights & badges</span>
          </div>

          {/* Secondary Color */}
          <div className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 space-y-2.5">
            <label className="block text-xs font-bold text-white">Secondary Dark Base</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={data.brandColors.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="h-9 w-9 rounded-lg border border-dark-700 bg-transparent cursor-pointer"
              />
              <Input
                placeholder="#0B0F19"
                value={data.brandColors.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                error={errors.secondaryColor}
              />
            </div>
            <span className="text-[10px] text-dark-400 block">Used for dark slate backgrounds & card borders</span>
          </div>

          {/* Accent Color */}
          <div className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 space-y-2.5">
            <label className="block text-xs font-bold text-white">Accent Blue Highlight</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={data.brandColors.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="h-9 w-9 rounded-lg border border-dark-700 bg-transparent cursor-pointer"
              />
              <Input
                placeholder="#3B82F6"
                value={data.brandColors.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                error={errors.accentColor}
              />
            </div>
            <span className="text-[10px] text-dark-400 block">Used for links, information pills & verified tags</span>
          </div>
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Branding Settings
        </Button>
      </div>
    </form>
  );
};
