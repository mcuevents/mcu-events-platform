'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GlobalSiteSettings } from '@/types/globalSettings';
import { AdminUser, InviteAdminFormData } from '@/types/settings';
import { AdminRole } from '@/types/auth';
import {
  getGlobalSettings,
  updateGeneralSettings,
  updateContactSettings,
  updateSocialSettings,
  updateBrandingSettings,
  updateFooterSettings,
  updateSEOSettings,
  updateAnalyticsSettings,
  updateMaintenanceSettings,
  updateAnnouncementSettings,
  updateGlobalCTASettings,
  defaultCompleteGlobalSettings,
} from '@/services/globalSettings.service';
import {
  getAdminUsers,
  inviteAdminUser,
  updateAdminUserRole,
  removeAdminUser,
} from '@/services/adminSettings.service';
import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { ContactSettingsTab } from '@/components/admin/settings/ContactSettingsTab';
import { SocialSettingsTab } from '@/components/admin/settings/SocialSettingsTab';
import { BrandingSettingsTab } from '@/components/admin/settings/BrandingSettingsTab';
import { FooterSettingsTab } from '@/components/admin/settings/FooterSettingsTab';
import { SEOSettingsTab } from '@/components/admin/settings/SEOSettingsTab';
import { AnalyticsSettingsTab } from '@/components/admin/settings/AnalyticsSettingsTab';
import { SiteWideSettingsTab } from '@/components/admin/settings/SiteWideSettingsTab';
import { TeamAccountsSection } from '@/components/admin/settings/TeamAccountsSection';
import { StorageBucketsSection } from '@/components/admin/settings/StorageBucketsSection';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Settings,
  Globe,
  Phone,
  Share2,
  Palette,
  LayoutGrid,
  Search,
  BarChart3,
  ShieldAlert,
  Users,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type SettingsTabKey =
  | 'general'
  | 'contact'
  | 'social'
  | 'branding'
  | 'footer'
  | 'seo'
  | 'analytics'
  | 'sitewide'
  | 'team';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSiteSettings>(defaultCompleteGlobalSettings);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('general');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [glob, users] = await Promise.all([getGlobalSettings(), getAdminUsers()]);
      setSettings(glob);
      setAdminUsers(users);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load platform settings.' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Admin user actions
  const handleInviteUser = async (data: InviteAdminFormData) => {
    const res = await inviteAdminUser(data);
    if (res.success) {
      setFeedback({ type: 'success', message: `Invitation sent to ${data.email}.` });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to invite administrator.' });
    }
  };

  const handleUpdateRole = async (userId: string, role: AdminRole) => {
    const res = await updateAdminUserRole(userId, role);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Admin role updated.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update user role.' });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const res = await removeAdminUser(userId);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Admin account removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to remove user account.' });
    }
  };

  const TABS: { key: SettingsTabKey; label: string; icon: React.ElementType }[] = [
    { key: 'general', label: 'General & Domain', icon: Globe },
    { key: 'contact', label: 'Contact & Hours', icon: Phone },
    { key: 'social', label: 'Social Accounts', icon: Share2 },
    { key: 'branding', label: 'Logos & Colors', icon: Palette },
    { key: 'footer', label: 'Footer CMS', icon: LayoutGrid },
    { key: 'seo', label: 'SEO & Metadata', icon: Search },
    { key: 'analytics', label: 'Analytics Tags', icon: BarChart3 },
    { key: 'sitewide', label: 'Site-Wide Alerts', icon: ShieldAlert },
    { key: 'team', label: 'Team & Storage', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Global Website & SEO Settings CMS
            </h1>
            <Badge variant="gold" size="sm">
              Phase 6.9
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Centrally manage company branding, contact numbers, social accounts, footer navigation, SEO metadata, and site behavior.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh All
        </Button>
      </div>

      {/* Global Feedback Banner */}
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

      {/* 2. Professional Tabbed Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-dark-800 scrollbar-none">
        {TABS.map(({ key, label, icon: TabIcon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-dark-900 border border-transparent hover:border-dark-800'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents Rendering */}
      {activeTab === 'general' && (
        <GeneralSettingsTab initialData={settings.general} onSave={updateGeneralSettings} />
      )}

      {activeTab === 'contact' && (
        <ContactSettingsTab initialData={settings.contact} onSave={updateContactSettings} />
      )}

      {activeTab === 'social' && (
        <SocialSettingsTab initialData={settings.social} onSave={updateSocialSettings} />
      )}

      {activeTab === 'branding' && (
        <BrandingSettingsTab initialData={settings.branding} onSave={updateBrandingSettings} />
      )}

      {activeTab === 'footer' && (
        <FooterSettingsTab initialData={settings.footer} onSave={updateFooterSettings} />
      )}

      {activeTab === 'seo' && (
        <SEOSettingsTab initialData={settings.seo} onSave={updateSEOSettings} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsSettingsTab initialData={settings.analytics} onSave={updateAnalyticsSettings} />
      )}

      {activeTab === 'sitewide' && (
        <SiteWideSettingsTab
          maintenance={settings.maintenance}
          announcement={settings.announcement}
          globalCta={settings.globalCta}
          onSaveMaintenance={updateMaintenanceSettings}
          onSaveAnnouncement={updateAnnouncementSettings}
          onSaveGlobalCta={updateGlobalCTASettings}
        />
      )}

      {activeTab === 'team' && (
        <div className="space-y-8">
          <TeamAccountsSection
            users={adminUsers}
            onInviteUser={handleInviteUser}
            onUpdateRole={handleUpdateRole}
            onRemoveUser={handleRemoveUser}
          />
          <StorageBucketsSection />
        </div>
      )}
    </div>
  );
}
