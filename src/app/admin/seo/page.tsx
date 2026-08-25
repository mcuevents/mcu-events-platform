'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SiteSEOConfig } from '@/types/settings';
import { getSiteSEOConfig, updateSiteSEOConfig, defaultSiteSEOConfig } from '@/services/adminSettings.service';
import { GlobalSeoForm } from '@/components/admin/seo/GlobalSeoForm';
import { PageSeoOverridesTable } from '@/components/admin/seo/PageSeoOverridesTable';
import { AnalyticsTrackingForm } from '@/components/admin/seo/AnalyticsTrackingForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Save, RefreshCw, CheckCircle2, AlertCircle, Globe, FileCode, BarChart3 } from 'lucide-react';

export default function AdminSeoPage() {
  const [config, setConfig] = useState<SiteSEOConfig>(defaultSiteSEOConfig);
  const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'analytics'>('global');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const cfg = await getSiteSEOConfig();
      setConfig(cfg);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load SEO configuration.' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateSiteSEOConfig(config);
    setIsSaving(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'SEO metadata, page rules, and analytics tracking IDs updated successfully.',
      });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save SEO configuration.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Search className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              SEO Engine & Metadata Management
            </h1>
            <Badge variant="green" size="sm">
              Search Indexing
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Configure global meta titles, OpenGraph sharing cards, route-by-route SEO overrides, and analytics pixels.
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
            Save SEO Settings
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
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'global'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Globe className="h-4 w-4" />
          Global Defaults & OpenGraph
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pages'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <FileCode className="h-4 w-4" />
          Page Overrides ({config.pages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          GA4 & Meta Pixel Tags
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'global' && (
        <GlobalSeoForm
          data={config.global}
          onChange={(global) => setConfig({ ...config, global })}
        />
      )}

      {activeTab === 'pages' && (
        <PageSeoOverridesTable
          pages={config.pages}
          onChange={(pages) => setConfig({ ...config, pages })}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTrackingForm
          data={config.global}
          onChange={(global) => setConfig({ ...config, global })}
        />
      )}

      <div className="flex justify-end pt-4 border-t border-dark-800">
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save All SEO Changes
        </Button>
      </div>
    </div>
  );
}
