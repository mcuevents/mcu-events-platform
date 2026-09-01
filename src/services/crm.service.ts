import { createClient } from '@/lib/supabase/client';
import {
  CRMLead,
  CRMNote,
  CRMFollowUp,
  CRMActivity,
  CRMLeadDetail,
  AdminLeadFilters,
  CreateLeadFormData,
  CRMStats,
  ConversionType,
} from '@/types/crm';

/* ==========================================================================
   INITIAL SEED DATA FOR CRM LEADS PIPELINE
   ========================================================================== */

export const initialCRMLeads: CRMLead[] = [
  {
    id: 'lead-1',
    name: 'Rajesh Kannan',
    email: 'rajesh@kannanelectronics.in',
    phone: '+91 98421 11223',
    company: 'Kannan Electronics & IoT',
    designation: 'Managing Director',
    leadType: 'exhibitor',
    leadSource: 'website',
    status: 'proposal',
    assignedTo: 'Admin (Ragul)',
    relatedEventId: 'evt-001',
    estimatedValue: 180000,
    tags: ['VIP Exhibitor', 'IoT Pavilion', '36sqm'],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Deepa Sundar',
    email: 'deepa@organictreats.com',
    phone: '+91 97890 55443',
    company: 'Pure Harvest Organic Franchise',
    designation: 'Franchise Head',
    leadType: 'partnership',
    leadSource: 'instagram',
    status: 'qualified',
    assignedTo: 'Operations Desk',
    relatedEventId: 'evt-001',
    estimatedValue: 250000,
    tags: ['Franchise Master', 'South Region'],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'lead-3',
    name: 'Anand Mahindra',
    email: 'anand.auto@texvalley.in',
    phone: '+91 94432 99887',
    company: 'Apex EV Infrastructure',
    designation: 'VP Business Development',
    leadType: 'sponsor',
    leadSource: 'event',
    status: 'converted',
    assignedTo: 'Admin (Ragul)',
    relatedEventId: 'evt-001',
    conversionDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    conversionType: 'sponsor',
    estimatedValue: 500000,
    tags: ['Platinum Sponsor', 'CODISSIA Main Hall'],
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'lead-4',
    name: 'Kavitha Ramasamy',
    email: 'kavitha@brandscale.agency',
    phone: '+91 99940 12345',
    company: 'BrandScale Media',
    designation: 'Founder & CEO',
    leadType: 'digital_marketing',
    leadSource: 'whatsapp',
    status: 'contacted',
    assignedTo: 'Content Manager',
    estimatedValue: 75000,
    tags: ['Meta Ads', 'Reel Campaign'],
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'lead-5',
    name: 'Suresh Menon',
    email: 'suresh@menonlogistics.co.in',
    phone: '+91 98840 66778',
    company: 'Menon Logistics Hub',
    designation: 'General Manager',
    leadType: 'event_enquiry',
    leadSource: 'google',
    status: 'new',
    assignedTo: 'Operations Desk',
    relatedEventId: 'evt-002',
    estimatedValue: 35000,
    tags: ['Visitor Passes', 'Bulk 10'],
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

export const initialCRMNotes: CRMNote[] = [
  {
    id: 'note-1',
    leadId: 'lead-1',
    authorName: 'Admin (Ragul)',
    content: 'Discussed 36 sqm prime stall layout near Hall B main entrance. Client requested custom gold fascia branding quote.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'note-2',
    leadId: 'lead-2',
    authorName: 'Operations Desk',
    content: 'Sent Franchise Master prospectus via WhatsApp. Follow-up scheduled for contract signing.',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'note-3',
    leadId: 'lead-3',
    authorName: 'Admin (Ragul)',
    content: 'Platinum sponsorship confirmed & signed! Included logo placement across 12 digital LED screens and VIP lounge naming.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export const initialCRMFollowups: CRMFollowUp[] = [
  {
    id: 'fup-1',
    leadId: 'lead-1',
    followupDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
    followupTime: '11:30',
    note: 'Send final stall booking agreement and tax invoice.',
    status: 'pending',
    assignedTo: 'Admin (Ragul)',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'fup-2',
    leadId: 'lead-4',
    followupDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
    followupTime: '15:00',
    note: 'Demo monthly social media growth strategy proposal.',
    status: 'pending',
    assignedTo: 'Content Manager',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

export const initialCRMActivities: CRMActivity[] = [
  {
    id: 'act-1',
    leadId: 'lead-1',
    activityType: 'created',
    description: 'Inbound exhibitor inquiry captured from Website Stall Calculator.',
    performerName: 'System',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act-2',
    leadId: 'lead-1',
    activityType: 'status_changed',
    description: 'Stage changed from Qualified to Proposal.',
    performerName: 'Admin (Ragul)',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act-3',
    leadId: 'lead-3',
    activityType: 'converted',
    description: 'Lead marked as Converted (Platinum Sponsor — ₹5,00,000).',
    performerName: 'Admin (Ragul)',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

// In-Memory Session Storage
let sessionCRMLeads: CRMLead[] = [...initialCRMLeads];
let sessionCRMNotes: CRMNote[] = [...initialCRMNotes];
let sessionCRMFollowups: CRMFollowUp[] = [...initialCRMFollowups];
let sessionCRMActivities: CRMActivity[] = [...initialCRMActivities];

/* ==========================================================================
   CRUD & PIPELINE FUNCTIONS
   ========================================================================== */

export async function getLeads(filters: AdminLeadFilters = {}): Promise<CRMLead[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('crm_leads').select('*').order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.leadType && filters.leadType !== 'all') {
      query = query.eq('lead_type', filters.leadType);
    }
    if (filters.leadSource && filters.leadSource !== 'all') {
      query = query.eq('lead_source', filters.leadSource);
    }
    if (filters.assignedTo) {
      query = query.ilike('assigned_to', `%${filters.assignedTo}%`);
    }
    if (filters.eventId) {
      query = query.eq('related_event_id', filters.eventId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterLeadsLocally(sessionCRMLeads, filters);
    }

    return data.map((d: any) => mapLeadFromDb(d));
  } catch {
    return filterLeadsLocally(sessionCRMLeads, filters);
  }
}

function mapLeadFromDb(d: any): CRMLead {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    phone: d.phone,
    company: d.company,
    designation: d.designation,
    leadType: d.lead_type,
    leadSource: d.lead_source,
    status: d.status,
    assignedTo: d.assigned_to,
    relatedEventId: d.related_event_id,
    conversionDate: d.conversion_date,
    conversionType: d.conversion_type,
    estimatedValue: d.estimated_value ? Number(d.estimated_value) : 0,
    tags: d.tags || [],
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function filterLeadsLocally(list: CRMLead[], filters: AdminLeadFilters): CRMLead[] {
  return list.filter((lead) => {
    if (filters.status && filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.leadType && filters.leadType !== 'all' && lead.leadType !== filters.leadType) return false;
    if (filters.leadSource && filters.leadSource !== 'all' && lead.leadSource !== filters.leadSource) return false;
    if (filters.assignedTo && lead.assignedTo !== filters.assignedTo) return false;
    if (filters.eventId && lead.relatedEventId !== filters.eventId) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export async function getLeadById(id: string): Promise<CRMLeadDetail | null> {
  const lead = sessionCRMLeads.find((l) => l.id === id);
  if (!lead) return null;

  const notes = sessionCRMNotes.filter((n) => n.leadId === id);
  const followups = sessionCRMFollowups.filter((f) => f.leadId === id);
  const activities = sessionCRMActivities.filter((a) => a.leadId === id);

  return {
    ...lead,
    notes,
    followups,
    activities,
    relatedEventTitle: lead.relatedEventId === 'evt-001' ? 'Tamil Nadu Franchise & Business Expo 2026' : undefined,
  };
}

export async function createLead(formData: CreateLeadFormData, performerName: string = 'Admin'): Promise<CRMLead> {
  const newLead: CRMLead = {
    id: `lead-${Date.now()}`,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    designation: formData.designation,
    leadType: formData.leadType,
    leadSource: formData.leadSource,
    status: 'new',
    assignedTo: formData.assignedTo || 'Unassigned',
    relatedEventId: formData.relatedEventId,
    estimatedValue: formData.estimatedValue || 0,
    tags: formData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sessionCRMLeads.unshift(newLead);

  // Initial created activity
  const createdAct: CRMActivity = {
    id: `act-${Date.now()}`,
    leadId: newLead.id,
    activityType: 'created',
    description: `Lead created via ${formData.leadSource} by ${performerName}`,
    performerName,
    createdAt: new Date().toISOString(),
  };
  sessionCRMActivities.unshift(createdAct);

  // Optional initial note
  if (formData.initialNote?.trim()) {
    const note: CRMNote = {
      id: `note-${Date.now()}`,
      leadId: newLead.id,
      authorName: performerName,
      content: formData.initialNote.trim(),
      createdAt: new Date().toISOString(),
    };
    sessionCRMNotes.unshift(note);
  }

  try {
    const supabase = createClient();
    await supabase.from('crm_leads').insert([{
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      designation: newLead.designation,
      lead_type: newLead.leadType,
      lead_source: newLead.leadSource,
      status: newLead.status,
      assigned_to: newLead.assignedTo,
      related_event_id: newLead.relatedEventId,
      estimated_value: newLead.estimatedValue,
      tags: newLead.tags,
    }]);
  } catch {
    // Session fallback
  }

  return newLead;
}

export async function updateLead(
  id: string,
  updates: Partial<CRMLead>,
  performerName: string = 'Admin'
): Promise<CRMLead | null> {
  const idx = sessionCRMLeads.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  const current = sessionCRMLeads[idx];
  const updated: CRMLead = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  sessionCRMLeads[idx] = updated;

  // Log status change activity
  if (updates.status && updates.status !== current.status) {
    sessionCRMActivities.unshift({
      id: `act-${Date.now()}`,
      leadId: id,
      activityType: 'status_changed',
      description: `Status changed from ${current.status.toUpperCase()} to ${updates.status.toUpperCase()}`,
      performerName,
      createdAt: new Date().toISOString(),
    });
  }

  // Log assignment change
  if (updates.assignedTo && updates.assignedTo !== current.assignedTo) {
    sessionCRMActivities.unshift({
      id: `act-${Date.now()}`,
      leadId: id,
      activityType: 'assigned',
      description: `Assigned to ${updates.assignedTo}`,
      performerName,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    const supabase = createClient();
    await supabase.from('crm_leads').update({
      status: updated.status,
      assigned_to: updated.assignedTo,
      estimated_value: updated.estimatedValue,
      conversion_date: updated.conversionDate,
      conversion_type: updated.conversionType,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {
    // ignore
  }

  return updated;
}

export async function addLeadNote(leadId: string, authorName: string, content: string): Promise<CRMNote> {
  const note: CRMNote = {
    id: `note-${Date.now()}`,
    leadId,
    authorName,
    content,
    createdAt: new Date().toISOString(),
  };

  sessionCRMNotes.unshift(note);

  sessionCRMActivities.unshift({
    id: `act-${Date.now()}`,
    leadId,
    activityType: 'note_added',
    description: `Private note added: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
    performerName: authorName,
    createdAt: new Date().toISOString(),
  });

  return note;
}

export async function createFollowUp(
  leadId: string,
  data: { followupDate: string; followupTime?: string; note: string; assignedTo?: string },
  performerName: string = 'Admin'
): Promise<CRMFollowUp> {
  const fup: CRMFollowUp = {
    id: `fup-${Date.now()}`,
    leadId,
    followupDate: data.followupDate,
    followupTime: data.followupTime,
    note: data.note,
    status: 'pending',
    assignedTo: data.assignedTo || performerName,
    createdAt: new Date().toISOString(),
  };

  sessionCRMFollowups.unshift(fup);

  sessionCRMActivities.unshift({
    id: `act-${Date.now()}`,
    leadId,
    activityType: 'followup_created',
    description: `Follow-up scheduled for ${data.followupDate} (${data.note})`,
    performerName,
    createdAt: new Date().toISOString(),
  });

  return fup;
}

export async function completeFollowUp(followUpId: string, leadId: string, performerName: string = 'Admin'): Promise<boolean> {
  const fup = sessionCRMFollowups.find((f) => f.id === followUpId);
  if (fup) {
    fup.status = 'completed';
    fup.completedAt = new Date().toISOString();

    sessionCRMActivities.unshift({
      id: `act-${Date.now()}`,
      leadId,
      activityType: 'followup_completed',
      description: `Follow-up completed: "${fup.note}"`,
      performerName,
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

export async function convertLead(
  leadId: string,
  conversionType: ConversionType,
  performerName: string = 'Admin'
): Promise<CRMLead | null> {
  return updateLead(
    leadId,
    {
      status: 'converted',
      conversionDate: new Date().toISOString(),
      conversionType,
    },
    performerName
  );
}

export async function getCRMStats(): Promise<CRMStats> {
  const leads = sessionCRMLeads;
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const contacted = leads.filter((l) => l.status === 'contacted').length;
  const qualified = leads.filter((l) => l.status === 'qualified').length;
  const proposal = leads.filter((l) => l.status === 'proposal').length;
  const converted = leads.filter((l) => l.status === 'converted').length;
  const lost = leads.filter((l) => l.status === 'lost').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingFollowups = sessionCRMFollowups.filter(
    (f) => f.status === 'pending' && f.followupDate >= todayStr
  ).length;

  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return {
    totalLeads: total,
    newLeads: newCount,
    contacted,
    qualified,
    proposal,
    converted,
    lost,
    upcomingFollowups,
    conversionRate,
  };
}

export async function exportLeadsCSV(filters?: AdminLeadFilters): Promise<string> {
  const leads = await getLeads(filters);
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Designation', 'Type', 'Source', 'Status', 'Assigned To', 'Estimated Value', 'Created Date'];

  const rows = leads.map((l) => [
    l.id,
    `"${l.name.replace(/"/g, '""')}"`,
    l.email,
    l.phone,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${(l.designation || '').replace(/"/g, '""')}"`,
    l.leadType,
    l.leadSource,
    l.status,
    `"${(l.assignedTo || '').replace(/"/g, '""')}"`,
    l.estimatedValue || 0,
    l.createdAt,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
