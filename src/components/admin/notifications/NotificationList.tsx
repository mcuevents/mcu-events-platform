'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminNotification, NotificationType } from '@/types/automation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Ticket,
  Mail,
  CheckCircle2,
  Bell,
  ShieldAlert,
  Clock,
  Check,
  CheckCheck,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface NotificationListProps {
  notifications: AdminNotification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
}

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  new_registration: Ticket,
  new_enquiry: Mail,
  registration_status_changed: CheckCircle2,
  event_reminder: Bell,
  system_alert: ShieldAlert,
};

const TYPE_LABELS: Record<NotificationType, { label: string; variant: 'gold' | 'blue' | 'green' | 'amber' | 'gray' }> = {
  new_registration: { label: 'Registration', variant: 'gold' },
  new_enquiry: { label: 'Enquiry', variant: 'blue' },
  registration_status_changed: { label: 'Status Update', variant: 'green' },
  event_reminder: { label: 'Reminder', variant: 'amber' },
  system_alert: { label: 'System', variant: 'gray' },
};

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = notifications.filter((item) => {
    if (filterTab === 'unread' && item.isRead) return false;
    if (filterTab === 'read' && !item.isRead) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Action & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-dark-900/60 rounded-2xl border border-dark-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'unread'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="h-4 px-1.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('read')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'read'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            Read
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-dark-950 border border-dark-700 rounded-xl px-2.5 py-1">
            <Filter className="h-3 w-3 text-dark-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none"
            >
              <option value="all">All Notification Types</option>
              <option value="new_registration">Registrations</option>
              <option value="new_enquiry">Enquiries</option>
              <option value="registration_status_changed">Status Changes</option>
              <option value="event_reminder">Event Reminders</option>
              <option value="system_alert">System Alerts</option>
            </select>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-dark-900/40 rounded-2xl border border-dark-800/80 space-y-2">
          <Bell className="h-8 w-8 text-dark-600 mx-auto" />
          <p className="text-sm font-semibold text-white">No notifications found</p>
          <p className="text-xs text-dark-400">All alerts have been reviewed or no items match your filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const IconComp = TYPE_ICONS[item.type] || Bell;
            const typeConfig = TYPE_LABELS[item.type] || { label: 'Notification', variant: 'gray' };

            let linkUrl = '';
            if (item.relatedEntityType === 'registration') linkUrl = '/admin/registrations';
            if (item.relatedEntityType === 'enquiry') linkUrl = '/admin/enquiries';
            if (item.relatedEntityType === 'event') linkUrl = '/admin/events';
            if (item.relatedEntityType === 'lead') linkUrl = '/admin/crm';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !item.isRead
                    ? 'bg-dark-900/90 border-brand-500/30 shadow-sm shadow-brand-500/5'
                    : 'bg-dark-950/60 border-dark-800 hover:border-dark-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      !item.isRead
                        ? 'bg-brand-500/10 border border-brand-500/30 text-brand-400'
                        : 'bg-dark-900 border border-dark-800 text-dark-400'
                    }`}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={typeConfig.variant} size="sm">
                        {typeConfig.label}
                      </Badge>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                      )}
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>

                    <p className="text-xs text-dark-300 leading-relaxed max-w-2xl">{item.description}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-dark-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-center">
                  {linkUrl && (
                    <Link href={linkUrl}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                        View Details
                      </Button>
                    </Link>
                  )}

                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(item.id)}
                      className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 text-dark-300 hover:text-emerald-400 border border-dark-800 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
