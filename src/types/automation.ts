/* ==========================================================================
   PHASE 7 — AUTOMATION & NOTIFICATION CONTRACTS
   ========================================================================== */

export type NotificationType =
  | 'new_registration'
  | 'new_enquiry'
  | 'registration_status_changed'
  | 'event_reminder'
  | 'system_alert';

export type NotificationChannel = 'email' | 'whatsapp' | 'admin_dashboard';

export type RelatedEntityType = 'registration' | 'enquiry' | 'event' | 'lead' | 'system';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  relatedEntityType?: RelatedEntityType;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  idempotencyKey?: string;
  notificationType: string;
  recipient: string;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  channels: {
    dashboard: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  events: {
    newRegistration: boolean;
    newEnquiry: boolean;
    statusChange: boolean;
    eventReminder: boolean;
    systemAlert: boolean;
  };
  alertEmailRecipients: string[];
}

export interface EmailTemplateData {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: 'registration_confirmation' | 'registration_status' | 'enquiry_received' | 'admin_registration_alert' | 'admin_enquiry_alert';
  variables: Record<string, any>;
}

export interface WhatsAppTemplateData {
  recipientPhone: string;
  templateType: 'registration_confirmation' | 'registration_status' | 'enquiry_followup' | 'event_reminder';
  variables: Record<string, any>;
}
