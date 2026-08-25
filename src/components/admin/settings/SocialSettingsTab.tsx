'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SocialAccountItem, SocialPlatform } from '@/types/globalSettings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle,
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { isValidUrl } from '@/services/globalSettings.service';

interface SocialSettingsTabProps {
  initialData: SocialAccountItem[];
  onSave: (data: SocialAccountItem[]) => Promise<{ success: boolean; error?: string }>;
}

const PLATFORM_ICONS: Record<SocialPlatform, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  whatsapp: MessageCircle,
  threads: Share2,
  other: Share2,
};

export const SocialSettingsTab: React.FC<SocialSettingsTabProps> = ({ initialData, onSave }) => {
  const [items, setItems] = useState<SocialAccountItem[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUpdateItem = (id: string, field: keyof SocialAccountItem, value: any) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddItem = () => {
    const newItem: SocialAccountItem = {
      id: `soc-${Date.now()}`,
      platform: 'instagram',
      platformName: 'Instagram',
      url: 'https://instagram.com/',
      enabled: true,
      displayOrder: items.length + 1,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleReset = () => {
    setItems(initialData);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const item of items) {
      if (item.enabled && item.url) {
        if (!isValidUrl(item.url)) {
          setFeedback({
            type: 'error',
            message: `Invalid URL format for ${item.platformName}. Only safe HTTP/HTTPS URLs are permitted.`,
          });
          return;
        }
      }
    }

    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(items);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Social media channels and public account links updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save social media settings.' });
    }
  };

  const enabledItems = items.filter((i) => i.enabled && i.url);

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

      {/* 1. Live Public Social Bar Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <Share2 className="h-4 w-4" /> Live Public Header & Footer Social Icons ({enabledItems.length})
          </span>
          <span className="text-[11px] text-dark-500">Only enabled channels with valid URLs are displayed</span>
        </div>

        <div className="bg-dark-950/80 p-4 rounded-2xl border border-dark-800 flex flex-wrap items-center gap-3">
          {enabledItems.map((item) => {
            const IconComp = PLATFORM_ICONS[item.platform] || Share2;
            return (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                className="h-10 px-3.5 rounded-xl bg-dark-900 border border-dark-700/80 text-dark-200 hover:text-white hover:border-brand-500/50 flex items-center gap-2 text-xs font-semibold transition-all"
              >
                <IconComp className="h-4 w-4 text-brand-400" />
                <span>{item.platformName}</span>
                <ExternalLink className="h-3 w-3 text-dark-500 ml-1" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Social Accounts List Editor */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-brand-400" />
            Configured Social Media Profiles ({items.length})
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus className="h-4 w-4" />}>
            Add Channel
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const IconComp = PLATFORM_ICONS[item.platform] || Share2;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-dark-950/60 border border-dark-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-1/3">
                  <div className="h-9 w-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Input
                      placeholder="e.g. Instagram"
                      value={item.platformName}
                      onChange={(e) => handleUpdateItem(item.id, 'platformName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <Input
                    placeholder="https://..."
                    value={item.url}
                    onChange={(e) => handleUpdateItem(item.id, 'url', e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleUpdateItem(item.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
                    />
                    <span className={item.enabled ? 'text-emerald-400 font-bold' : 'text-dark-500'}>
                      {item.enabled ? 'Enabled' : 'Hidden'}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Social Settings
        </Button>
      </div>
    </form>
  );
};
