'use client';

import React, { useState } from 'react';
import { SiteSEOConfig } from '@/types/settings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { Search, Globe, Tag, Image as ImageIcon } from 'lucide-react';

interface GlobalSeoFormProps {
  data: SiteSEOConfig['global'];
  onChange: (updated: SiteSEOConfig['global']) => void;
}

export const GlobalSeoForm: React.FC<GlobalSeoFormProps> = ({ data, onChange }) => {
  const [tagInput, setTagInput] = useState('');

  const updateField = <K extends keyof SiteSEOConfig['global']>(field: K, val: SiteSEOConfig['global'][K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !data.defaultKeywords.includes(val)) {
        updateField('defaultKeywords', [...data.defaultKeywords, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateField(
      'defaultKeywords',
      data.defaultKeywords.filter((k) => k !== keyword)
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Global SERP Google Snippet Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <Search className="h-4 w-4" /> Live Google Search Result Preview
          </span>
        </div>

        <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-1.5 max-w-2xl font-sans">
          <div className="flex items-center gap-2 text-[11px] text-dark-400">
            <Globe className="h-3 w-3 text-emerald-400" />
            <span className="text-dark-300">https://mcucreations.com</span>
          </div>
          <h4 className="text-base text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1">
            {data.titleTemplate ? data.titleTemplate.replace('%s', 'Home') : 'MCU Creations | Premier Event Management'}
          </h4>
          <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">
            {data.defaultDescription ||
              'MCU Creations delivers premier B2B trade expos, franchise summits, turnkey event management, and omnichannel digital marketing solutions.'}
          </p>
        </div>
      </div>

      {/* 2. Global Metadata Form */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-brand-400" />
          Global Title Templates & Meta Directives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Site Brand Name *"
            placeholder="MCU Creations"
            value={data.siteName}
            onChange={(e) => updateField('siteName', e.target.value)}
          />

          <Input
            label="Page Title Template Pattern (%s replaces page name) *"
            placeholder="%s | MCU Creations - Premier Event Management"
            value={data.titleTemplate}
            onChange={(e) => updateField('titleTemplate', e.target.value)}
          />
        </div>

        <Textarea
          label="Default Meta Description (Fallback for untargeted routes) *"
          rows={3}
          placeholder="Concise 150-160 character description of MCU Creations..."
          value={data.defaultDescription}
          onChange={(e) => updateField('defaultDescription', e.target.value)}
        />

        {/* Global Keywords */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-dark-300">
            Default Meta Keywords (Type keyword and press Enter)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-dark-950 border border-dark-700 rounded-xl min-h-[42px]">
            {data.defaultKeywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 text-xs bg-dark-800 text-white px-2.5 py-1 rounded-lg border border-dark-700"
              >
                <Tag className="h-2.5 w-2.5 text-brand-400" />
                {k}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(k)}
                  className="text-dark-400 hover:text-red-400 ml-1 font-bold text-xs"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder={data.defaultKeywords.length === 0 ? 'Type keyword and press Enter...' : 'Add more...'}
              className="bg-transparent text-xs text-white focus:outline-none flex-1 min-w-[140px]"
            />
          </div>
        </div>

        <CMSImageUploader
          label="Default OpenGraph / Social Share Card Image (1200x630px)"
          value={data.ogImageUrl || ''}
          onChange={(val) => updateField('ogImageUrl', val)}
          helperText="Image displayed when pages are shared on WhatsApp, LinkedIn, Twitter, and Facebook"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-800">
          <Input
            label="Official Twitter / X Handle"
            placeholder="@mcucreations"
            value={data.twitterHandle || ''}
            onChange={(e) => updateField('twitterHandle', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
