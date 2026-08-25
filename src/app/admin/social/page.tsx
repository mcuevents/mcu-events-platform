'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SocialChannelsConfig } from '@/types/settings';
import {
  getSocialChannelsConfig,
  updateSocialChannelsConfig,
  defaultSocialConfig,
} from '@/services/adminSettings.service';
import { SocialChannelsForm } from '@/components/admin/social/SocialChannelsForm';
import { WhatsAppHotlineForm } from '@/components/admin/social/WhatsAppHotlineForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Share2, Save, RefreshCw, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

export default function AdminSocialPage() {
  const [config, setConfig] = useState<SocialChannelsConfig>(defaultSocialConfig);
  const [activeTab, setActiveTab] = useState<'social' | 'whatsapp'>('social');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const cfg = await getSocialChannelsConfig();
      setConfig(cfg);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load social settings.' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateSocialChannelsConfig(config);
    setIsSaving(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'Social channels and WhatsApp hotline configuration updated.',
      });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save social settings.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Share2 className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Social Media Channels & WhatsApp Hotline
            </h1>
            <Badge variant="blue" size="sm">
              Multi-Channel
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Synchronize official social media profiles, campaign hashtags, and instant WhatsApp enquiry hotlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Social Changes
          </Button>
        </div>
      </div>

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
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-dark-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'social'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          Social Profiles & Hashtags
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp Hotline & Floating Bubble
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'social' ? (
        <SocialChannelsForm data={config} onChange={setConfig} />
      ) : (
        <WhatsAppHotlineForm data={config} onChange={setConfig} />
      )}

      <div className="flex justify-end pt-4 border-t border-dark-800">
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save All Social Settings
        </Button>
      </div>
    </div>
  );
}
