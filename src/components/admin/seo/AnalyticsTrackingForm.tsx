'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSEOConfig } from '@/types/settings';
import { Input } from '@/components/ui';
import { BarChart3, ExternalLink, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface AnalyticsTrackingFormProps {
  data: SiteSEOConfig['global'];
  onChange: (updated: SiteSEOConfig['global']) => void;
}

export const AnalyticsTrackingForm: React.FC<AnalyticsTrackingFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof SiteSEOConfig['global']>(field: K, val: SiteSEOConfig['global'][K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Analytics IDs Form */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-400" />
          Analytics & Conversion Tracking Tags
        </h3>
        <p className="text-xs text-dark-400">
          Inject tracking scripts across public pages to measure visitor behavior, lead submissions, and ad conversions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-300">
              Google Analytics 4 ID (GA4)
            </label>
            <Input
              placeholder="G-XXXXXXXXXX"
              value={data.googleAnalyticsId || ''}
              onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
            />
            <span className="text-[10px] text-dark-500 block">Streams real-time events & visitor demographics</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-300">
              Google Tag Manager (GTM)
            </label>
            <Input
              placeholder="GTM-XXXXXXX"
              value={data.googleTagManagerId || ''}
              onChange={(e) => updateField('googleTagManagerId', e.target.value)}
            />
            <span className="text-[10px] text-dark-500 block">For dynamic custom trigger tags & remarketing</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-300">
              Meta / Facebook Pixel ID
            </label>
            <Input
              placeholder="1092837465928172"
              value={data.metaPixelId || ''}
              onChange={(e) => updateField('metaPixelId', e.target.value)}
            />
            <span className="text-[10px] text-dark-500 block">Tracks visitor ticket bookings for Meta ad retargeting</span>
          </div>
        </div>
      </div>

      {/* 2. Technical SEO Health & Sitemap Links */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          Search Engine Crawlers & XML Sitemap Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Dynamic XML Sitemap</span>
                <span className="text-[11px] text-dark-400">Auto-indexes all events & blog posts</span>
              </div>
            </div>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="flex items-center gap-1 text-xs text-brand-400 hover:underline font-mono"
            >
              /sitemap.xml <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Robots Directives</span>
                <span className="text-[11px] text-dark-400">Protects /admin from crawler indexing</span>
              </div>
            </div>
            <Link
              href="/robots.txt"
              target="_blank"
              className="flex items-center gap-1 text-xs text-brand-400 hover:underline font-mono"
            >
              /robots.txt <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
