'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminNotification, NotificationLog, NotificationPreferences } from '@/types/automation';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationLogs,
  retryNotificationLog,
  getNotificationPreferences,
  updateNotificationPreferences,
  defaultNotificationPreferences,
} from '@/services/notification.service';
import { NotificationList } from '@/components/admin/notifications/NotificationList';
import { AutomationLogsTable } from '@/components/admin/notifications/AutomationLogsTable';
import { NotificationPreferencesForm } from '@/components/admin/notifications/NotificationPreferencesForm';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { Bell, Activity, Sliders, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

type NotificationTab = 'inbox' | 'logs' | 'preferences';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [activeTab, setActiveTab] = useState<NotificationTab>('inbox');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [notifs, logList, prefs] = await Promise.all([
        getNotifications('all'),
        getNotificationLogs(),
        getNotificationPreferences(),
      ]);
      setNotifications(notifs);
      setLogs(logList);
      setPreferences(prefs);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load notifications and delivery logs.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setFeedback({ type: 'success', message: 'All notifications marked as read.' });
  };

  const handleRetryLog = async (logId: string) => {
    const res = await retryNotificationLog(logId);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Automation log retry dispatched successfully.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to retry notification.' });
    }
  };

  const handleSavePreferences = async (newPrefs: NotificationPreferences) => {
    const res = await updateNotificationPreferences(newPrefs);
    if (res.success) {
      setPreferences(newPrefs);
    }
    return res;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* 1. Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Bell className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Automation & Notification Center
            </h1>
            <Badge variant="gold" size="sm">
              Phase 7
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Real-time event notifications, transactional email/WhatsApp dispatch history, and alert triggers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
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

      {/* 2. Top Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inbox'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-900'
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          <span>Notifications Inbox</span>
          {unreadCount > 0 && (
            <span className="h-4 px-1.5 rounded-full bg-dark-950/40 text-brand-950 font-black text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-900'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Delivery & Automation Logs ({logs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preferences'
              ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
              : 'text-dark-400 hover:text-white hover:bg-dark-900'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Alert Preferences</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'inbox' && (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}

      {activeTab === 'logs' && <AutomationLogsTable logs={logs} onRetry={handleRetryLog} />}

      {activeTab === 'preferences' && (
        <NotificationPreferencesForm
          initialPreferences={preferences}
          onSave={handleSavePreferences}
        />
      )}
    </div>
  );
}
