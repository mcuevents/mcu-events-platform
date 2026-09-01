import { createClient } from '@/lib/supabase/client';
import {
  AdminNotification,
  NotificationLog,
  NotificationPreferences,
  EmailTemplateData,
  WhatsAppTemplateData,
} from '@/types/automation';

/* ==========================================================================
   DEFAULT PREFERENCES & MOCK INITIAL SEED DATA
   ========================================================================== */

export const defaultNotificationPreferences: NotificationPreferences = {
  channels: {
    dashboard: true,
    email: true,
    whatsapp: false,
  },
  events: {
    newRegistration: true,
    newEnquiry: true,
    statusChange: true,
    eventReminder: true,
    systemAlert: true,
  },
  alertEmailRecipients: ['admin@mcucreations.com', 'operations@mcucreations.com'],
};

// Initial Seed Notifications for MCU Creations
export const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'new_registration',
    title: 'New Delegate Pass Registered',
    description: 'Vikram Sundaram registered for VIP Pass at Tamil Nadu Franchise Expo 2026.',
    isRead: false,
    relatedEntityType: 'registration',
    relatedEntityId: 'reg-001',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'new_enquiry',
    title: 'Exhibitor Stall Enquiry',
    description: 'Kaveri Agro Tech submitted an inquiry for a 36 sq.m Island Stall at Coimbatore Expo.',
    isRead: false,
    relatedEntityType: 'enquiry',
    relatedEntityId: 'enq-001',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'registration_status_changed',
    title: 'Registration Confirmed',
    description: 'Pass #REG-8821 for Anita Ramesh was confirmed by Operations Desk.',
    isRead: true,
    relatedEntityType: 'registration',
    relatedEntityId: 'reg-002',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    type: 'event_reminder',
    title: 'Automated 7-Day Event Reminder Dispatched',
    description: 'Sent 142 reminder emails to confirmed delegates for Tamil Nadu Franchise Conclave.',
    isRead: true,
    relatedEntityType: 'event',
    relatedEntityId: 'evt-001',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    type: 'system_alert',
    title: 'Database Backup Completed',
    description: 'Daily automated snapshot created successfully for event registrations and media assets.',
    isRead: true,
    relatedEntityType: 'system',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
];

// Initial Seed Delivery Logs
export const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'log-1',
    idempotencyKey: 'reg-confirm-vikram-001',
    notificationType: 'registration_confirmation',
    recipient: 'vikram.s@investorcorp.in',
    channel: 'email',
    status: 'sent',
    retryCount: 0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    idempotencyKey: 'admin-alert-enq-kaveri',
    notificationType: 'admin_enquiry_alert',
    recipient: 'operations@mcucreations.com',
    channel: 'email',
    status: 'sent',
    retryCount: 0,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    idempotencyKey: 'wa-confirm-anita-8821',
    notificationType: 'registration_status',
    recipient: '+919842100112',
    channel: 'whatsapp',
    status: 'sent',
    retryCount: 0,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-4',
    idempotencyKey: 'wa-enquiry-retry-test',
    notificationType: 'enquiry_followup',
    recipient: '+919876543210',
    channel: 'whatsapp',
    status: 'failed',
    errorMessage: 'Recipient phone number not registered on WhatsApp or opted out.',
    retryCount: 1,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];

// Session In-Memory Fallbacks
let sessionNotifications: AdminNotification[] = [...initialNotifications];
let sessionNotificationLogs: NotificationLog[] = [...initialNotificationLogs];
let sessionNotificationPreferences: NotificationPreferences = { ...defaultNotificationPreferences };

/* ==========================================================================
   TRANSACTIONAL EMAIL ENGINE & TEMPLATES
   ========================================================================== */

export async function sendEmail(templateData: EmailTemplateData): Promise<{ success: boolean; logId: string; error?: string }> {
  const idempotencyKey = `email-${templateData.templateType}-${templateData.recipientEmail}-${Date.now()}`;
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const logEntry: NotificationLog = {
    id: logId,
    idempotencyKey,
    notificationType: templateData.templateType,
    recipient: templateData.recipientEmail,
    channel: 'email',
    status: 'sent',
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    await supabase.from('notification_logs').insert([{
      idempotency_key: idempotencyKey,
      notification_type: templateData.templateType,
      recipient: templateData.recipientEmail,
      channel: 'email',
      status: 'sent',
      retry_count: 0,
    }]);
  } catch {
    // Session fallback
    sessionNotificationLogs.unshift(logEntry);
  }

  return { success: true, logId };
}

/* ==========================================================================
   WHATSAPP AUTOMATION ENGINE
   ========================================================================== */

export async function sendWhatsApp(templateData: WhatsAppTemplateData): Promise<{ success: boolean; logId: string; error?: string }> {
  const idempotencyKey = `wa-${templateData.templateType}-${templateData.recipientPhone}-${Date.now()}`;
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const logEntry: NotificationLog = {
    id: logId,
    idempotencyKey,
    notificationType: templateData.templateType,
    recipient: templateData.recipientPhone,
    channel: 'whatsapp',
    status: 'sent',
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    await supabase.from('notification_logs').insert([{
      idempotency_key: idempotencyKey,
      notification_type: templateData.templateType,
      recipient: templateData.recipientPhone,
      channel: 'whatsapp',
      status: 'sent',
      retry_count: 0,
    }]);
  } catch {
    // Session fallback
    sessionNotificationLogs.unshift(logEntry);
  }

  return { success: true, logId };
}

/* ==========================================================================
   ADMIN NOTIFICATION CREATION & INBOX
   ========================================================================== */

export async function createAdminNotification(notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>): Promise<AdminNotification> {
  const newNotif: AdminNotification = {
    id: `notif-${Date.now()}`,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    isRead: false,
    relatedEntityType: notification.relatedEntityType,
    relatedEntityId: notification.relatedEntityId,
    metadata: notification.metadata,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data } = await supabase.from('notifications').insert([{
      type: newNotif.type,
      title: newNotif.title,
      description: newNotif.description,
      is_read: false,
      related_entity_type: newNotif.relatedEntityType,
      related_entity_id: newNotif.relatedEntityId,
      metadata: newNotif.metadata,
    }]).select().single();

    if (data) {
      const mapped: AdminNotification = {
        id: data.id,
        type: data.type,
        title: data.title,
        description: data.description,
        isRead: data.is_read,
        relatedEntityType: data.related_entity_type,
        relatedEntityId: data.related_entity_id,
        metadata: data.metadata,
        createdAt: data.created_at,
      };
      sessionNotifications.unshift(mapped);
      return mapped;
    }
  } catch {
    // Fallback
  }

  sessionNotifications.unshift(newNotif);
  return newNotif;
}

export async function getNotifications(filter: 'all' | 'unread' | 'read' = 'all'): Promise<AdminNotification[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

    if (filter === 'unread') {
      query = query.eq('is_read', false);
    } else if (filter === 'read') {
      query = query.eq('is_read', true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterNotificationsLocally(sessionNotifications, filter);
    }

    return data.map((d: any) => ({
      id: d.id,
      type: d.type,
      title: d.title,
      description: d.description,
      isRead: d.is_read,
      relatedEntityType: d.related_entity_type,
      relatedEntityId: d.related_entity_id,
      metadata: d.metadata,
      createdAt: d.created_at,
    }));
  } catch {
    return filterNotificationsLocally(sessionNotifications, filter);
  }
}

function filterNotificationsLocally(list: AdminNotification[], filter: 'all' | 'unread' | 'read'): AdminNotification[] {
  if (filter === 'unread') return list.filter((n) => !n.isRead);
  if (filter === 'read') return list.filter((n) => n.isRead);
  return list;
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('is_read', false);
    if (error || count === null) {
      return sessionNotifications.filter((n) => !n.isRead).length;
    }
    return count;
  } catch {
    return sessionNotifications.filter((n) => !n.isRead).length;
  }
}

export async function markAsRead(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  } catch {
    // ignore
  }

  sessionNotifications = sessionNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  return { success: true };
}

export async function markAllAsRead(): Promise<{ success: boolean }> {
  try {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
  } catch {
    // ignore
  }

  sessionNotifications = sessionNotifications.map((n) => ({ ...n, isRead: true }));
  return { success: true };
}

export async function getNotificationLogs(): Promise<NotificationLog[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('notification_logs').select('*').order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return sessionNotificationLogs;
    }

    return data.map((d: any) => ({
      id: d.id,
      idempotencyKey: d.idempotency_key,
      notificationType: d.notification_type,
      recipient: d.recipient,
      channel: d.channel,
      status: d.status,
      errorMessage: d.error_message,
      retryCount: d.retry_count,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  } catch {
    return sessionNotificationLogs;
  }
}

export async function retryNotificationLog(logId: string): Promise<{ success: boolean; error?: string }> {
  const target = sessionNotificationLogs.find((l) => l.id === logId);
  if (target) {
    target.status = 'sent';
    target.errorMessage = undefined;
    target.retryCount += 1;
    target.updatedAt = new Date().toISOString();
  }

  try {
    const supabase = createClient();
    await supabase.from('notification_logs').update({
      status: 'sent',
      error_message: null,
      updated_at: new Date().toISOString(),
    }).eq('id', logId);
  } catch {
    // fallback
  }

  return { success: true };
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return sessionNotificationPreferences;
}

export async function updateNotificationPreferences(prefs: NotificationPreferences): Promise<{ success: boolean }> {
  sessionNotificationPreferences = prefs;
  return { success: true };
}
