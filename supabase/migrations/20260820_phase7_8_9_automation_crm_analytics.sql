-- ============================================================================
-- MCU CREATIONS — PHASE 7, 8 & 9 MIGRATION
-- Automation Notifications, CRM Leads Pipeline & Business Analytics
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. NOTIFICATIONS TABLE (Admin Inbox)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('new_registration', 'new_enquiry', 'registration_status_changed', 'event_reminder', 'system_alert')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_entity_type TEXT CHECK (related_entity_type IN ('registration', 'enquiry', 'event', 'lead', 'system')),
    related_entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- ============================================================================
-- 2. NOTIFICATION LOGS TABLE (Automation Delivery Audit & Idempotency)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key TEXT UNIQUE,
    notification_type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'admin_dashboard')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON public.notification_logs (status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON public.notification_logs (channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs (created_at DESC);

-- ============================================================================
-- 3. CRM LEADS TABLE (Inbound Prospects & Business Pipeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    designation TEXT,
    lead_type TEXT NOT NULL DEFAULT 'general' CHECK (lead_type IN ('event_enquiry', 'exhibitor', 'sponsor', 'digital_marketing', 'partnership', 'general')),
    lead_source TEXT NOT NULL DEFAULT 'website' CHECK (lead_source IN ('website', 'instagram', 'facebook', 'whatsapp', 'google', 'referral', 'event', 'direct', 'other')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
    assigned_to TEXT,
    related_event_id TEXT,
    conversion_date TIMESTAMP WITH TIME ZONE,
    conversion_type TEXT CHECK (conversion_type IN ('event_registration', 'exhibitor', 'sponsor', 'digital_marketing_client', 'partnership')),
    estimated_value NUMERIC(12, 2) DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_lead_type ON public.crm_leads (lead_type);
CREATE INDEX IF NOT EXISTS idx_crm_leads_lead_source ON public.crm_leads (lead_source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON public.crm_leads (assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON public.crm_leads (created_at DESC);

-- ============================================================================
-- 4. CRM NOTES TABLE (Private Admin Notes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_notes_lead_id ON public.crm_notes (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created_at ON public.crm_notes (created_at DESC);

-- ============================================================================
-- 5. CRM FOLLOW-UPS TABLE (Task Reminders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    followup_date DATE NOT NULL,
    followup_time TEXT,
    note TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_crm_followups_lead_id ON public.crm_followups (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_followups_status ON public.crm_followups (status);
CREATE INDEX IF NOT EXISTS idx_crm_followups_date ON public.crm_followups (followup_date);

-- ============================================================================
-- 6. CRM ACTIVITIES TABLE (Audit Trail & Activity Timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'status_changed', 'assigned', 'note_added', 'followup_created', 'followup_completed', 'email_sent', 'whatsapp_sent', 'converted')),
    description TEXT NOT NULL,
    performer_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON public.crm_activities (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON public.crm_activities (created_at DESC);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- Notifications Policies (Admin Only)
CREATE POLICY "Admins can view and manage notifications"
    ON public.notifications
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Notification Logs Policies (Admin Only)
CREATE POLICY "Admins can view and manage notification logs"
    ON public.notification_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Leads Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM leads"
    ON public.crm_leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Notes Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM notes"
    ON public.crm_notes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Followups Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM followups"
    ON public.crm_followups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Activities Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM activities"
    ON public.crm_activities
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
