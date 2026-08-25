'use client';

import React from 'react';
import { SpotlightConfig, SectionsVisibilityConfig } from '@/types/settings';
import { Input } from '@/components/ui/Input';
import { Star, Eye, Layers } from 'lucide-react';

interface HomepageSpotlightSectionProps {
  spotlight: SpotlightConfig;
  visibility: SectionsVisibilityConfig;
  eventsList: { id: string; title: string; city: string }[];
  onSpotlightChange: (updated: SpotlightConfig) => void;
  onVisibilityChange: (updated: SectionsVisibilityConfig) => void;
}

const SECTION_DESCRIPTIONS: Record<keyof SectionsVisibilityConfig, { title: string; desc: string }> = {
  hero: { title: 'Hero Banner & CTAs', desc: 'Main headline, gradient highlights, and primary registration CTAs' },
  featuredEvents: { title: 'Featured Summits Grid', desc: 'Active trade show carousel and upcoming dates' },
  whyChooseUs: { title: 'Why Choose Us / USPs', desc: 'Infrastructure, B2B matchmaking, and turnout assurances' },
  services: { title: 'Core Services Showcase', desc: 'Turnkey fabrication, performance marketing & reels' },
  videos: { title: 'Video Reels & Highlights', desc: 'Embedded YouTube event sizzle reels' },
  testimonials: { title: 'Client Testimonials', desc: 'Verified CEO quotes and star ratings' },
  partners: { title: 'Partner & Sponsor Logos', desc: 'Marquee alliance logos carousel' },
  ctaBanner: { title: 'Bottom Conversion Banner', desc: 'Call to book stalls or register delegate passes' },
};

export const HomepageSpotlightSection: React.FC<HomepageSpotlightSectionProps> = ({
  spotlight,
  visibility,
  eventsList,
  onSpotlightChange,
  onVisibilityChange,
}) => {
  const toggleVisibility = (key: keyof SectionsVisibilityConfig) => {
    onVisibilityChange({
      ...visibility,
      [key]: !visibility[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Spotlight Event Configuration */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Star className="h-4 w-4 text-gold-400" />
            Spotlight Summit Banner (Top of Homepage)
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={spotlight.enabled}
              onChange={(e) => onSpotlightChange({ ...spotlight, enabled: e.target.checked })}
              className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-xs font-bold text-white">Enable Spotlight</span>
          </label>
        </div>

        {spotlight.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Select Spotlight Expo *</label>
              <select
                value={spotlight.eventId || ''}
                onChange={(e) => onSpotlightChange({ ...spotlight, eventId: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.city})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Spotlight Badge Copy"
              placeholder="e.g. FLAGSHIP UPCOMING EXPO"
              value={spotlight.customBadge || ''}
              onChange={(e) => onSpotlightChange({ ...spotlight, customBadge: e.target.value })}
            />

            <Input
              label="CTA Button Copy"
              placeholder="e.g. Book VIP Pass Now"
              value={spotlight.customCtaText || ''}
              onChange={(e) => onSpotlightChange({ ...spotlight, customCtaText: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* 2. Homepage Sections Visibility Matrix */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-400" />
          Homepage Section Visibility Matrix
        </h3>
        <p className="text-xs text-dark-400">
          Toggle individual homepage sections on or off to adjust layout during special campaigns.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dark-800">
          {(Object.keys(visibility) as Array<keyof SectionsVisibilityConfig>).map((secKey) => {
            const isVisible = visibility[secKey];
            const info = SECTION_DESCRIPTIONS[secKey] || { title: secKey, desc: '' };

            return (
              <div
                key={secKey}
                onClick={() => toggleVisibility(secKey)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isVisible
                    ? 'bg-dark-950/80 border-brand-500/40 text-white'
                    : 'bg-dark-950/30 border-dark-800/80 text-dark-500 opacity-60'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold">{info.title}</div>
                  <div className="text-[11px] text-dark-400 truncate">{info.desc}</div>
                </div>

                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                    isVisible ? 'bg-brand-500' : 'bg-dark-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isVisible ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
