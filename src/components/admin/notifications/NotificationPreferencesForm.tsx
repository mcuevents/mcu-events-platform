'use client';

import React, { useState } from 'react';
import { NotificationPreferences } from '@/types/automation';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Bell, Mail, MessageCircle, ShieldAlert, Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface NotificationPreferencesFormProps {
  initialPreferences: NotificationPreferences;
  onSave: (prefs: NotificationPreferences) => Promise<{ success: boolean }>;
}

export const NotificationPreferencesForm: React.FC<NotificationPreferencesFormProps> = ({
  initialPreferences,
  onSave,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPreferences);
  const [newEmail, setNewEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChannelToggle = (key: keyof NotificationPreferences['channels']) => {
    setPrefs((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [key]: !prev.channels[key],
      },
    }));
  };

  const handleEventToggle = (key: keyof NotificationPreferences['events']) => {
    setPrefs((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [key]: !prev.events[key],
      },
    }));
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim() && newEmail.includes('@') && !prefs.alertEmailRecipients.includes(newEmail.trim())) {
      setPrefs((prev) => ({
        ...prev,
        alertEmailRecipients: [...prev.alertEmailRecipients, newEmail.trim()],
      }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setPrefs((prev) => ({
      ...prev,
      alertEmailRecipients: prev.alertEmailRecipients.filter((e) => e !== emailToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(prefs);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Notification preferences saved successfully.' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to save notification preferences.' });
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

      {/* 1. Dispatch Channels */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Active Alert Dispatch Channels</h3>
        <p className="text-xs text-dark-400">
          Control which communication channels are used when new platform events occur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-800">
          <label className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Dashboard Inbox</span>
                <span className="text-[10px] text-dark-400">Bell badge & notification center</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.channels.dashboard}
              onChange={() => handleChannelToggle('dashboard')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>

          <label className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Email Dispatch</span>
                <span className="text-[10px] text-dark-400">Transactional alerts to admins</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.channels.email}
              onChange={() => handleChannelToggle('email')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>

          <label className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">WhatsApp Alerts</span>
                <span className="text-[10px] text-dark-400">Direct notifications via Meta API</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.channels.whatsapp}
              onChange={() => handleChannelToggle('whatsapp')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>
        </div>
      </div>

      {/* 2. Automated Event Triggers */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Event Notification Triggers</h3>

        <div className="space-y-3 pt-2 border-t border-dark-800">
          <label className="flex items-center justify-between p-3 rounded-xl bg-dark-950/60 border border-dark-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">New Delegate Registrations</span>
              <span className="text-[10px] text-dark-400">Triggered whenever a visitor books an event pass</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.events.newRegistration}
              onChange={() => handleEventToggle('newRegistration')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-dark-950/60 border border-dark-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Inbound Inquiries & Stall Requests</span>
              <span className="text-[10px] text-dark-400">Triggered when sponsor, exhibitor or contact forms are submitted</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.events.newEnquiry}
              onChange={() => handleEventToggle('newEnquiry')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-dark-950/60 border border-dark-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Registration Status Changes</span>
              <span className="text-[10px] text-dark-400">Triggered when passes are marked Confirmed, Cancelled, or Attended</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.events.statusChange}
              onChange={() => handleEventToggle('statusChange')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-dark-950/60 border border-dark-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Automated Event Reminders</span>
              <span className="text-[10px] text-dark-400">7-day and 1-day reminders dispatched to confirmed attendees</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.events.eventReminder}
              onChange={() => handleEventToggle('eventReminder')}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
          </label>
        </div>
      </div>

      {/* 3. Admin Recipient Email List */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Admin Alert Email Recipients</h3>

        <div className="flex gap-2">
          <Input
            placeholder="admin@mcucreations.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button type="button" variant="outline" size="md" onClick={handleAddEmail} leftIcon={<Plus className="h-4 w-4" />}>
            Add Email
          </Button>
        </div>

        <div className="space-y-2 pt-2">
          {prefs.alertEmailRecipients.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-3 rounded-xl bg-dark-950/60 border border-dark-800 text-xs"
            >
              <div className="flex items-center gap-2 text-white font-mono">
                <Mail className="h-3.5 w-3.5 text-brand-400" />
                {email}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveEmail(email)}
                className="text-dark-500 hover:text-red-400 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-dark-800">
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Notification Preferences
        </Button>
      </div>
    </form>
  );
};
