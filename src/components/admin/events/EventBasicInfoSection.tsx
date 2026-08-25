'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { AdminEventFormData, EventCategory } from '@/types/events';
import { FileText, Sparkles, RefreshCw } from 'lucide-react';

interface EventBasicInfoSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
  errors?: Record<string, string>;
}

export function EventBasicInfoSection({
  formData,
  onChange,
  errors = {},
}: EventBasicInfoSectionProps) {
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = generateSlug(val);
    onChange({
      title: val,
      slug: formData.slug ? formData.slug : autoSlug,
    });
  };

  const handleAutoSlug = () => {
    if (formData.title) {
      onChange({ slug: generateSlug(formData.title) });
    }
  };

  const categories: { label: string; value: EventCategory }[] = [
    { label: 'Exhibition & Trade Expo', value: 'exhibition' },
    { label: 'Conference & Summit', value: 'conference' },
    { label: 'Workshop & Masterclass', value: 'workshop' },
    { label: 'Concert & Gala Night', value: 'concert' },
    { label: 'Corporate Summit', value: 'corporate' },
    { label: 'Marketing & Digital Event', value: 'marketing' },
    { label: 'Other Business Event', value: 'other' },
  ];

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white">Basic Event Information</h2>
          <p className="text-[11px] text-dark-400">Core headline, category, URL slug and synopsis</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <Input
          label="Event Title *"
          placeholder="e.g. Tamil Nadu Franchise & Business Expo 2026"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          error={errors.title}
          required
        />

        {/* Slug Generator & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-dark-200">
                Public URL Slug *
              </label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Regenerate from Title</span>
              </button>
            </div>
            <div className="flex items-center rounded-xl bg-dark-950 border border-dark-800 focus-within:border-brand-500 px-3">
              <span className="text-xs text-dark-500 font-mono select-none">/events/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => onChange({ slug: generateSlug(e.target.value) })}
                placeholder="tamil-nadu-franchise-expo-2026"
                className="w-full bg-transparent py-2.5 px-1 text-xs text-white placeholder:text-dark-500 focus:outline-none font-mono"
                required
              />
            </div>
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
          </div>

          <Select
            label="Event Category *"
            value={formData.category}
            onChange={(e) => onChange({ category: e.target.value as EventCategory })}
            options={categories}
          />
        </div>

        {/* Short Description */}
        <Textarea
          label="Short Synopsis / Elevator Pitch *"
          placeholder="A brief 1-2 sentence teaser for cards, search results, and OpenGraph previews..."
          rows={2}
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          error={errors.description}
          required
        />

        {/* Detailed Description */}
        <Textarea
          label="Detailed Event Overview & Agenda"
          placeholder="Comprehensive event description, daily schedule highlights, speaker panels, and delegate value propositions..."
          rows={6}
          value={formData.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      </div>
    </Card>
  );
}
