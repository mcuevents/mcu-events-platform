'use client';

import React, { useState } from 'react';
import { GeneralSettings } from '@/types/globalSettings';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Globe, Save, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { isValidUrl } from '@/services/globalSettings.service';

interface GeneralSettingsTabProps {
  initialData: GeneralSettings;
  onSave: (data: GeneralSettings) => Promise<{ success: boolean; error?: string }>;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<GeneralSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof GeneralSettings>(field: K, value: GeneralSettings[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleReset = () => {
    setData(initialData);
    setFeedback(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!data.siteName.trim()) newErrors.siteName = 'Site name is required.';
    if (!data.websiteUrl.trim() || !isValidUrl(data.websiteUrl)) {
      newErrors.websiteUrl = 'Please provide a valid production URL (e.g. https://mcucreations.com).';
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
      setFeedback({ type: 'success', message: 'General site settings and production domain saved.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save general settings.' });
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

      {/* Production Domain Notice */}
      <div className="p-4 bg-brand-500/10 border border-brand-500/30 rounded-2xl flex items-start gap-3">
        <Info className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white block">Centralized Production Website URL</span>
          <p className="text-dark-300">
            This URL is used across the entire platform for canonical links, sitemaps, Open Graph social share cards,
            and email notifications. Update this when deploying to your live custom domain.
          </p>
        </div>
      </div>

      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-brand-400" />
          Site Identity & Domain Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Site Name *"
            placeholder="MCU Creations"
            value={data.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            error={errors.siteName}
          />

          <Input
            label="Registered Company Name"
            placeholder="MCU Creations Private Limited"
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </div>

        <Input
          label="Production Website URL (Canonical base domain) *"
          placeholder="https://mcucreations.com"
          value={data.websiteUrl}
          onChange={(e) => handleChange('websiteUrl', e.target.value)}
          error={errors.websiteUrl}
        />

        <Textarea
          label="Site Tagline & High-Level Description"
          rows={3}
          placeholder="Concise overview of MCU Creations core business..."
          value={data.siteDescription}
          onChange={(e) => handleChange('siteDescription', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-800">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Default Platform Language</label>
            <select
              value={data.defaultLanguage}
              onChange={(e) => handleChange('defaultLanguage', e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="en">English (India) — en</option>
              <option value="ta">Tamil — ta</option>
              <option value="hi">Hindi — hi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Default Timezone</label>
            <select
              value={data.defaultTimezone}
              onChange={(e) => handleChange('defaultTimezone', e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+08:00)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save General Settings
        </Button>
      </div>
    </form>
  );
};
