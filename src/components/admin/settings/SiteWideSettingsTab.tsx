'use client';

import React, { useState } from 'react';
import { MaintenanceSettings, AnnouncementSettings, GlobalCTASettings } from '@/types/globalSettings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Bell, Sparkles, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface SiteWideSettingsTabProps {
  maintenance: MaintenanceSettings;
  announcement: AnnouncementSettings;
  globalCta: GlobalCTASettings;
  onSaveMaintenance: (data: MaintenanceSettings) => Promise<{ success: boolean; error?: string }>;
  onSaveAnnouncement: (data: AnnouncementSettings) => Promise<{ success: boolean; error?: string }>;
  onSaveGlobalCta: (data: GlobalCTASettings) => Promise<{ success: boolean; error?: string }>;
}

export const SiteWideSettingsTab: React.FC<SiteWideSettingsTabProps> = ({
  maintenance: initialMaintenance,
  announcement: initialAnnouncement,
  globalCta: initialGlobalCta,
  onSaveMaintenance,
  onSaveAnnouncement,
  onSaveGlobalCta,
}) => {
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>(initialMaintenance);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(initialAnnouncement);
  const [globalCta, setGlobalCta] = useState<GlobalCTASettings>(initialGlobalCta);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const [resMaint, resAnn, resCta] = await Promise.all([
      onSaveMaintenance(maintenance),
      onSaveAnnouncement(announcement),
      onSaveGlobalCta(globalCta),
    ]);

    setIsSaving(false);

    if (resMaint.success && resAnn.success && resCta.success) {
      setFeedback({
        type: 'success',
        message: 'Site-wide maintenance mode, announcement banner, and global CTA settings saved.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: resMaint.error || resAnn.error || resCta.error || 'Failed to save site-wide settings.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmitAll} className="space-y-6">
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

      {/* 1. Maintenance Mode */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Platform Maintenance Mode</h3>
              <p className="text-xs text-dark-400">
                When enabled, public visitors see a maintenance notice. Administrators still have full /admin access.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(e) => setMaintenance({ ...maintenance, enabled: e.target.checked })}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-amber-500 focus:ring-amber-500"
            />
            <span className={maintenance.enabled ? 'text-amber-400 font-bold' : 'text-dark-500'}>
              {maintenance.enabled ? 'ACTIVE (PUBLIC LOCKED)' : 'DISABLED'}
            </span>
          </label>
        </div>

        {maintenance.enabled && (
          <div className="space-y-4 pt-2 border-t border-dark-800">
            <Input
              label="Maintenance Title"
              placeholder="Website Scheduled Maintenance"
              value={maintenance.title}
              onChange={(e) => setMaintenance({ ...maintenance, title: e.target.value })}
            />

            <Textarea
              label="Public Notice Description"
              rows={2}
              placeholder="We are upgrading our registration servers and will be back shortly..."
              value={maintenance.description}
              onChange={(e) => setMaintenance({ ...maintenance, description: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Support Contact Email"
                placeholder="info@mcucreations.com"
                value={maintenance.contactEmail || ''}
                onChange={(e) => setMaintenance({ ...maintenance, contactEmail: e.target.value })}
              />

              <Input
                label="Emergency Phone"
                placeholder="+91 98421 88900"
                value={maintenance.contactPhone || ''}
                onChange={(e) => setMaintenance({ ...maintenance, contactPhone: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Announcement Bar */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Top Alert & Announcement Bar</h3>
              <p className="text-xs text-dark-400">
                Displays a prominent promotional strip at the very top of all public pages.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={announcement.enabled}
              onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
            />
            <span className={announcement.enabled ? 'text-emerald-400 font-bold' : 'text-dark-500'}>
              {announcement.enabled ? 'Bar Visible' : 'Hidden'}
            </span>
          </label>
        </div>

        {announcement.enabled && (
          <div className="space-y-4 pt-2 border-t border-dark-800">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input
                label="Badge Tag"
                placeholder="HOT EVENT"
                value={announcement.badgeText || ''}
                onChange={(e) => setAnnouncement({ ...announcement, badgeText: e.target.value })}
              />

              <div className="sm:col-span-3">
                <Input
                  label="Announcement Message Text *"
                  placeholder="🔥 Tamil Nadu Franchise & Business Expo 2026 — Early Bird Visitor Passes Now Live!"
                  value={announcement.text}
                  onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Link Target Route (Optional)"
                placeholder="/events/tamil-nadu-franchise-expo-2026"
                value={announcement.linkUrl || ''}
                onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
              />

              <Input
                label="Link Button Text"
                placeholder="Book Tickets"
                value={announcement.linkText || ''}
                onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Global Floating CTA */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Global Header & Mobile Sticky CTA</h3>
              <p className="text-xs text-dark-400">
                Customizes primary action button in header and mobile drawer.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={globalCta.enabled}
              onChange={(e) => setGlobalCta({ ...globalCta, enabled: e.target.checked })}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
            />
            <span className={globalCta.enabled ? 'text-emerald-400 font-bold' : 'text-dark-500'}>
              {globalCta.enabled ? 'CTA Active' : 'Hidden'}
            </span>
          </label>
        </div>

        {globalCta.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
            <Input
              label="CTA Button Label"
              placeholder="Book an Exhibitor Stall"
              value={globalCta.text}
              onChange={(e) => setGlobalCta({ ...globalCta, text: e.target.value })}
            />

            <Input
              label="CTA Target Route"
              placeholder="/exhibitors"
              value={globalCta.url}
              onChange={(e) => setGlobalCta({ ...globalCta, url: e.target.value })}
            />

            <Input
              label="Subtext / Tagline"
              placeholder="Join 150+ national brands"
              value={globalCta.subtext || ''}
              onChange={(e) => setGlobalCta({ ...globalCta, subtext: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-end pt-4 border-t border-dark-800">
        <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Site-Wide Settings
        </Button>
      </div>
    </form>
  );
};
