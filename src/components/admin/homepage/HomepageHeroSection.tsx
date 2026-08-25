'use client';

import React from 'react';
import Link from 'next/link';
import { HeroSectionConfig } from '@/types/settings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Sparkles, ArrowRight, LayoutTemplate } from 'lucide-react';

interface HomepageHeroSectionProps {
  data: HeroSectionConfig;
  onChange: (updated: HeroSectionConfig) => void;
}

export const HomepageHeroSection: React.FC<HomepageHeroSectionProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof HeroSectionConfig>(field: K, val: HeroSectionConfig[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Hero Preview Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <LayoutTemplate className="h-4 w-4" /> Live Hero Banner Preview
          </span>
          <span className="text-[11px] text-dark-500">Updates in real-time as you edit below</span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-dark-700 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            {data.eyebrowBadge || 'South India’s #1 Business & Franchise Expos'}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            {data.title || 'Transforming Business Summits into'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
              {data.highlightWord || 'Unmatched Growth Engines'}
            </span>
          </h2>

          <p className="text-dark-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {data.subtitle ||
              'We curate, engineer, and promote mega-scale B2B trade exhibitions, franchise conclaves, and digital marketing funnels.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-5 py-2.5 rounded-xl bg-brand-500 text-dark-950 font-black text-xs shadow-lg shadow-brand-500/20 flex items-center gap-1.5">
              {data.primaryCtaText || 'Explore Upcoming Expos'}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-dark-900/80 border border-dark-700 text-white font-bold text-xs">
              {data.secondaryCtaText || 'Partner & Sponsor'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Configuration Form Fields */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-400" />
          Hero Headline Copy & Call-To-Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Eyebrow Badge Tag"
            placeholder="e.g. 🔥 South India’s #1 Business & Franchise Expos"
            value={data.eyebrowBadge}
            onChange={(e) => updateField('eyebrowBadge', e.target.value)}
          />

          <Input
            label="Highlight Words (Rendered in Gold Gradient)"
            placeholder="e.g. Unmatched Growth Engines"
            value={data.highlightWord}
            onChange={(e) => updateField('highlightWord', e.target.value)}
          />
        </div>

        <Input
          label="Main Headline Prefix"
          placeholder="e.g. Transforming Business Summits into"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
        />

        <Textarea
          label="Subtitle Description Paragraph"
          rows={3}
          placeholder="Comprehensive description of MCU Creations core value proposition..."
          value={data.subtitle}
          onChange={(e) => updateField('subtitle', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-800">
          <div className="space-y-2">
            <Input
              label="Primary CTA Button Label"
              placeholder="e.g. Explore Upcoming Expos"
              value={data.primaryCtaText}
              onChange={(e) => updateField('primaryCtaText', e.target.value)}
            />
            <Input
              label="Primary CTA Target Route"
              placeholder="/events"
              value={data.primaryCtaUrl}
              onChange={(e) => updateField('primaryCtaUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Secondary CTA Button Label"
              placeholder="e.g. Partner & Sponsor"
              value={data.secondaryCtaText}
              onChange={(e) => updateField('secondaryCtaText', e.target.value)}
            />
            <Input
              label="Secondary CTA Target Route"
              placeholder="/contact"
              value={data.secondaryCtaUrl}
              onChange={(e) => updateField('secondaryCtaUrl', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
