'use client';

import React from 'react';
import Link from 'next/link';
import { SocialChannelsConfig } from '@/types/settings';
import { Input } from '@/components/ui';
import {
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Hash,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface SocialChannelsFormProps {
  data: SocialChannelsConfig;
  onChange: (updated: SocialChannelsConfig) => void;
}

export const SocialChannelsForm: React.FC<SocialChannelsFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof SocialChannelsConfig>(field: K, val: SocialChannelsConfig[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Social Links Bar Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <Share2 className="h-4 w-4" /> Live Header & Footer Social Icons Preview
          </span>
        </div>

        <div className="bg-dark-950/80 p-4 rounded-2xl border border-dark-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {data.instagramUrl && (
              <Link
                href={data.instagramUrl}
                target="_blank"
                className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-500/20 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            )}

            {data.youtubeUrl && (
              <Link
                href={data.youtubeUrl}
                target="_blank"
                className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                title="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            )}

            {data.linkedinUrl && (
              <Link
                href={data.linkedinUrl}
                target="_blank"
                className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            )}

            {data.facebookUrl && (
              <Link
                href={data.facebookUrl}
                target="_blank"
                className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            )}

            {data.twitterUrl && (
              <Link
                href={data.twitterUrl}
                target="_blank"
                className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            )}
          </div>

          {data.activeCampaignHashtag && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-700 text-xs text-brand-400 font-mono font-bold">
              <Hash className="h-3.5 w-3.5" />
              {data.activeCampaignHashtag}
            </div>
          )}
        </div>
      </div>

      {/* 2. Form Inputs */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Share2 className="h-4 w-4 text-brand-400" />
          Official Social Media Account URLs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Instagram className="h-4 w-4 text-pink-400" /> Instagram Profile URL
            </label>
            <Input
              placeholder="https://instagram.com/mcucreations"
              value={data.instagramUrl}
              onChange={(e) => updateField('instagramUrl', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Youtube className="h-4 w-4 text-red-400" /> YouTube Channel URL
            </label>
            <Input
              placeholder="https://youtube.com/@mcucreations"
              value={data.youtubeUrl}
              onChange={(e) => updateField('youtubeUrl', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Linkedin className="h-4 w-4 text-blue-400" /> LinkedIn Company URL
            </label>
            <Input
              placeholder="https://linkedin.com/company/mcucreations"
              value={data.linkedinUrl}
              onChange={(e) => updateField('linkedinUrl', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Facebook className="h-4 w-4 text-indigo-400" /> Facebook Page URL
            </label>
            <Input
              placeholder="https://facebook.com/mcucreations"
              value={data.facebookUrl}
              onChange={(e) => updateField('facebookUrl', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Twitter className="h-4 w-4 text-sky-400" /> Twitter / X Handle URL
            </label>
            <Input
              placeholder="https://x.com/mcucreations"
              value={data.twitterUrl}
              onChange={(e) => updateField('twitterUrl', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-dark-300">
              <Hash className="h-4 w-4 text-brand-400" /> Viral Campaign Hashtag
            </label>
            <Input
              placeholder="#TNFranchiseExpo2026"
              value={data.activeCampaignHashtag}
              onChange={(e) => updateField('activeCampaignHashtag', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
