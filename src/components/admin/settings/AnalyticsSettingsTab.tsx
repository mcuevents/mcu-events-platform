'use client';

import React, { useState } from 'react';
import { AnalyticsSettings } from '@/types/globalSettings';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { BarChart3, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalyticsSettingsTabProps {
  initialData: AnalyticsSettings;
  onSave: (data: AnalyticsSettings) => Promise<{ success: boolean; error?: string }>;
}

export const AnalyticsSettingsTab: React.FC<AnalyticsSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<AnalyticsSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleReset = () => {
    setData(initialData);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(data);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Analytics and conversion tracking tags configuration updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save analytics settings.' });
    }
  };

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

      {/* Privacy Notice */}
      <div className="p-4 bg-dark-900/80 border border-dark-800 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white block">Strict Privacy & Zero PII Policy</span>
          <p className="text-dark-300">
            Visitor names, email addresses, phone numbers, and registration inquiries are NEVER transmitted to Google
            Analytics or Meta Pixels. Only anonymized page views and ticket conversions are measured.
          </p>
        </div>
      </div>

      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand-400" />
            Controlled Analytics & Pixel Tracking
          </h3>

          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(e) => setData({ ...data, enabled: e.target.checked })}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
            />
            <span className={data.enabled ? 'text-emerald-400 font-bold' : 'text-dark-500'}>
              {data.enabled ? 'Scripts Active' : 'Scripts Disabled'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
          <div className="space-y-1">
            <Input
              label="Google Analytics 4 ID (GA4)"
              placeholder="G-XXXXXXXXXX"
              value={data.googleAnalyticsId || ''}
              onChange={(e) => setData({ ...data, googleAnalyticsId: e.target.value })}
              disabled={!data.enabled}
            />
            <span className="text-[10px] text-dark-500 block">Streams real-time event analytics</span>
          </div>

          <div className="space-y-1">
            <Input
              label="Google Tag Manager ID (GTM)"
              placeholder="GTM-XXXXXXX"
              value={data.googleTagManagerId || ''}
              onChange={(e) => setData({ ...data, googleTagManagerId: e.target.value })}
              disabled={!data.enabled}
            />
            <span className="text-[10px] text-dark-500 block">For custom conversion triggers</span>
          </div>

          <div className="space-y-1">
            <Input
              label="Meta / Facebook Pixel ID"
              placeholder="1092837465928172"
              value={data.metaPixelId || ''}
              onChange={(e) => setData({ ...data, metaPixelId: e.target.value })}
              disabled={!data.enabled}
            />
            <span className="text-[10px] text-dark-500 block">For social ad remarketing</span>
          </div>
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Analytics Settings
        </Button>
      </div>
    </form>
  );
};
