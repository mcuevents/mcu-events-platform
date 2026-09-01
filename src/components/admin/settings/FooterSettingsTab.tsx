'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FooterSettings, FooterLinkGroup, FooterLinkItem } from '@/types/globalSettings';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { LayoutGrid, Save, Plus, Trash2, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface FooterSettingsTabProps {
  initialData: FooterSettings;
  onSave: (data: FooterSettings) => Promise<{ success: boolean; error?: string }>;
}

export const FooterSettingsTab: React.FC<FooterSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<FooterSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddLink = (groupId: string) => {
    const newLink: FooterLinkItem = {
      id: `lnk-${Date.now()}`,
      label: 'New Link',
      url: '/',
      displayOrder: 1,
      isPublished: true,
    };

    setData((prev) => ({
      ...prev,
      linkGroups: prev.linkGroups.map((g) => (g.id === groupId ? { ...g, links: [...g.links, newLink] } : g)),
    }));
  };

  const handleUpdateLink = (groupId: string, linkId: string, field: keyof FooterLinkItem, value: any) => {
    setData((prev) => ({
      ...prev,
      linkGroups: prev.linkGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          links: g.links.map((l) => (l.id === linkId ? { ...l, [field]: value } : l)),
        };
      }),
    }));
  };

  const handleRemoveLink = (groupId: string, linkId: string) => {
    setData((prev) => ({
      ...prev,
      linkGroups: prev.linkGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          links: g.links.filter((l) => l.id !== linkId),
        };
      }),
    }));
  };

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
      setFeedback({ type: 'success', message: 'Footer description, copyright notice, CTA and navigation links updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save footer settings.' });
    }
  };

  const dynamicCopyright = data.copyrightText.replace('{year}', new Date().getFullYear().toString());

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

      {/* 1. Live Footer Bottom Bar Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <LayoutGrid className="h-4 w-4" /> Live Footer Preview
          </span>
        </div>

        <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-4">
          {data.ctaEnabled && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-transparent border border-brand-500/30 flex items-center justify-between gap-4">
              <span className="font-bold text-white text-xs sm:text-sm">{data.ctaText}</span>
              <div className="px-3.5 py-1.5 rounded-lg bg-brand-500 text-dark-950 font-black text-xs shrink-0 flex items-center gap-1">
                Explore <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="space-y-1">
              <span className="font-bold text-white block">MCU CREATIONS</span>
              <p className="text-dark-400 text-[11px] leading-relaxed line-clamp-3">{data.footerDescription}</p>
            </div>

            {data.linkGroups.map((g) => (
              <div key={g.id} className="space-y-1.5">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">{g.groupTitle}</span>
                <ul className="space-y-1 text-dark-400 text-[11px]">
                  {g.links
                    .filter((l) => l.isPublished)
                    .map((l) => (
                      <li key={l.id} className="hover:text-brand-400 transition-colors">
                        {l.label}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-dark-900 text-[11px] text-dark-500 flex items-center justify-between">
            <span>{dynamicCopyright}</span>
            <span>Events & Digital Agency</span>
          </div>
        </div>
      </div>

      {/* 2. Footer Copy & Copyright */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Footer Copy & Copyright Template</h3>

        <Textarea
          label="Footer Mission Summary"
          rows={2}
          value={data.footerDescription}
          onChange={(e) => setData({ ...data, footerDescription: e.target.value })}
        />

        <div className="space-y-1">
          <Input
            label="Copyright Text ({year} dynamically inserts current year) *"
            placeholder="© {year} MCU Creations Private Limited. All rights reserved."
            value={data.copyrightText}
            onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
          />
        </div>

        {/* Footer CTA Banner */}
        <div className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Bottom CTA Banner Bar</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={data.ctaEnabled}
                onChange={(e) => setData({ ...data, ctaEnabled: e.target.checked })}
                className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
              />
              <span className={data.ctaEnabled ? 'text-emerald-400 font-bold' : 'text-dark-500'}>
                {data.ctaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {data.ctaEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Input
                label="CTA Headline Message"
                placeholder="Ready to Scale Your Brand at Our Next Mega Expo?"
                value={data.ctaText}
                onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              />
              <Input
                label="CTA Target Route"
                placeholder="/contact"
                value={data.ctaUrl}
                onChange={(e) => setData({ ...data, ctaUrl: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer Link Columns Builder */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-5">
        <h3 className="text-sm font-bold text-white">Footer Navigation Link Groups ({data.linkGroups.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.linkGroups.map((group) => (
            <div key={group.id} className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-dark-800">
                <span className="font-bold text-white text-xs">{group.groupTitle} Column</span>
                <button
                  type="button"
                  onClick={() => handleAddLink(group.id)}
                  className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Link
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {group.links.map((link) => (
                  <div key={link.id} className="p-2 rounded-lg bg-dark-900 border border-dark-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(group.id, link.id, 'label', e.target.value)}
                        placeholder="Link Label"
                        className="bg-transparent text-white font-medium focus:outline-none w-full border-b border-dark-700 py-0.5"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(group.id, link.id)}
                        className="text-dark-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(group.id, link.id, 'url', e.target.value)}
                        placeholder="/route"
                        className="bg-transparent text-dark-400 text-[11px] font-mono focus:outline-none flex-1"
                      />
                      <label className="flex items-center gap-1 text-[10px] text-dark-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isPublished}
                          onChange={(e) => handleUpdateLink(group.id, link.id, 'isPublished', e.target.checked)}
                          className="h-3 w-3 rounded bg-dark-950 border-dark-700 text-brand-500"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Footer Settings
        </Button>
      </div>
    </form>
  );
};
