/* ==========================================================================
   PHASE 8 — CRM & LEAD MANAGEMENT CONTRACTS
   ========================================================================== */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';

export type LeadType =
  | 'event_enquiry'
  | 'exhibitor'
  | 'sponsor'
  | 'digital_marketing'
  | 'partnership'
  | 'general';

export type LeadSource =
  | 'website'
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'google'
  | 'referral'
  | 'event'
  | 'direct'
  | 'other';

export type ConversionType =
  | 'event_registration'
  | 'exhibitor'
  | 'sponsor'
  | 'digital_marketing_client'
  | 'partnership';

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  designation?: string;
  leadType: LeadType;
  leadSource: LeadSource;
  status: LeadStatus;
  assignedTo?: string; // Admin Name or UUID
  relatedEventId?: string;
  conversionDate?: string;
  conversionType?: ConversionType;
  estimatedValue?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CRMNote {
  id: string;
  leadId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CRMFollowUp {
  id: string;
  leadId: string;
  followupDate: string; // YYYY-MM-DD
  followupTime?: string; // HH:MM
  note: string;
  status: 'pending' | 'completed' | 'cancelled';
  assignedTo?: string;
  createdAt: string;
  completedAt?: string;
}

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'note_added'
  | 'followup_created'
  | 'followup_completed'
  | 'email_sent'
  | 'whatsapp_sent'
  | 'converted';

export interface CRMActivity {
  id: string;
  leadId: string;
  activityType: ActivityType;
  description: string;
  performerName: string;
  createdAt: string;
}

export interface CRMLeadDetail extends CRMLead {
  notes: CRMNote[];
  followups: CRMFollowUp[];
  activities: CRMActivity[];
  relatedEventTitle?: string;
}

export interface AdminLeadFilters {
  status?: LeadStatus | 'all';
  leadType?: LeadType | 'all';
  leadSource?: LeadSource | 'all';
  assignedTo?: string;
  eventId?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateLeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  designation?: string;
  leadType: LeadType;
  leadSource: LeadSource;
  assignedTo?: string;
  relatedEventId?: string;
  estimatedValue?: number;
  initialNote?: string;
  tags?: string[];
}

export interface CRMStats {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  qualified: number;
  proposal: number;
  converted: number;
  lost: number;
  upcomingFollowups: number;
  conversionRate: number;
}
