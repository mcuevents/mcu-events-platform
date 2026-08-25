'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HomepageConfig } from '@/types/settings';
import { getHomepageConfig, updateHomepageConfig, defaultHomepageConfig } from '@/services/adminSettings.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { HomepageHeroSection } from '@/components/admin/homepage/HomepageHeroSection';
import { HomepageStatsSection } from '@/components/admin/homepage/HomepageStatsSection';
import { HomepageSpotlightSection } from '@/components/admin/homepage/HomepageSpotlightSection';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Home, Save, RefreshCw, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Star } from 'lucide-react';

export default function AdminHomepagePage() {
  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [eventsList, setEventsList] = useState<{ id: string; title: string; city: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'spotlight'>('hero');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [cfg, evts] = await Promise.all([getHomepageConfig(), getAdminEvents()]);
      setConfig(cfg);
      setEventsList(
        evts.events.map((e) => ({
          id: e.id,
          title: e.title,
          city: e.city,
        }))
      );
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load homepage configuration.' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    const res = await updateHomepageConfig(config);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Homepage sections and banner settings saved successfully.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save homepage settings.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Home className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Homepage Layout & Hero CMS
            </h1>
            <Badge variant="gold" size="sm">
              Live Customizer
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Customize hero headlines, numeric statistics counters, spotlight event banner, and section visibility.
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
            onClick={handleSaveAll}
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Homepage Changes
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
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hero'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Hero Headline & CTAs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stats'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Metric Counters ({config.stats.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spotlight')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'spotlight'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Star className="h-4 w-4" />
          Spotlight & Sections Matrix
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'hero' && (
        <HomepageHeroSection
          data={config.hero}
          onChange={(hero) => setConfig({ ...config, hero })}
        />
      )}

      {activeTab === 'stats' && (
        <HomepageStatsSection
          stats={config.stats}
          onChange={(stats) => setConfig({ ...config, stats })}
        />
      )}

      {activeTab === 'spotlight' && (
        <HomepageSpotlightSection
          spotlight={config.spotlight}
          visibility={config.sectionsVisibility}
          eventsList={eventsList}
          onSpotlightChange={(spotlight) => setConfig({ ...config, spotlight })}
          onVisibilityChange={(sectionsVisibility) => setConfig({ ...config, sectionsVisibility })}
        />
      )}

      {/* Bottom Save Float */}
      <div className="flex justify-end pt-4 border-t border-dark-800">
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveAll}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save All Homepage Changes
        </Button>
      </div>
    </div>
  );
}
