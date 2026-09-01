import { createClient } from '@/lib/supabase/client';
import {
  Enquiry,
  EnquiryStatus,
  EnquiryStats,
  AdminEnquiryFilters,
  AdminEnquiryListResponse,
} from '@/types/enquiries';
import { mockEnquiries } from '@/lib/mockData';
import { sessionEvents } from './adminEvents.service';

export let sessionEnquiries: Enquiry[] = [...mockEnquiries];

/**
 * Retrieves paginated, filtered business and event enquiries.
 */
export async function getAdminEnquiries(
  filters?: AdminEnquiryFilters
): Promise<AdminEnquiryListResponse> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const sortBy = filters?.sortBy || 'createdAt';
  const sortOrder = filters?.sortOrder || 'desc';

  try {
    const supabase = createClient();
    let query = supabase.from('enquiries').select('*, events(title)', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters?.eventId && filters.eventId !== 'all') {
      query = query.eq('event_id', filters.eventId);
    }

    if (filters?.search) {
      const q = filters.search.trim();
      query = query.or(
        `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,subject.ilike.%${q}%,company_name.ilike.%${q}%`
      );
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let fromDate: Date | null = null;
      if (filters.dateRange === 'today') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filters.dateRange === 'last7days') {
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filters.dateRange === 'last30days') {
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (fromDate) {
        query = query.gte('created_at', fromDate.toISOString());
      }
    }

    const columnMap: Record<string, string> = {
      createdAt: 'created_at',
      fullName: 'full_name',
      status: 'status',
    };
    const dbSortCol = columnMap[sortBy] || 'created_at';
    query = query.order(dbSortCol, { ascending: sortOrder === 'asc' });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionEnquiries(filters, page, limit, sortBy, sortOrder);
    }

    const enquiries: Enquiry[] = (data as any[]).map((e) => ({
      id: e.id,
      type: e.type,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      companyName: e.company_name,
      designation: e.designation,
      subject: e.subject,
      message: e.message,
      eventId: e.event_id,
      eventName: e.events?.title || e.event_name,
      serviceId: e.service_id,
      status: e.status,
      adminNotes: e.admin_notes || e.notes,
      metadata: e.metadata,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));

    const stats = await getEnquiryStats(filters?.eventId);
    const total = count || enquiries.length;
    const totalPages = Math.ceil(total / limit);

    return {
      enquiries,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      stats,
    };
  } catch {
    return getFilteredSessionEnquiries(filters, page, limit, sortBy, sortOrder);
  }
}

function getFilteredSessionEnquiries(
  filters: AdminEnquiryFilters | undefined,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: string
): AdminEnquiryListResponse {
  let filtered = [...sessionEnquiries];

  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((e) => e.status === filters.status);
  }

  if (filters?.type && filters.type !== 'all') {
    filtered = filtered.filter((e) => e.type === filters.type);
  }

  if (filters?.eventId && filters.eventId !== 'all') {
    filtered = filtered.filter((e) => e.eventId === filters.eventId);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        (e.companyName && e.companyName.toLowerCase().includes(q))
    );
  }

  if (filters?.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let fromDate: Date | null = null;
    if (filters.dateRange === 'today') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filters.dateRange === 'last7days') {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filters.dateRange === 'last30days') {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (fromDate) {
      filtered = filtered.filter((e) => new Date(e.createdAt) >= fromDate!);
    }
  }

  filtered.sort((a, b) => {
    let valA: any = a.createdAt;
    let valB: any = b.createdAt;
    if (sortBy === 'fullName') {
      valA = a.fullName.toLowerCase();
      valB = b.fullName.toLowerCase();
    } else if (sortBy === 'status') {
      valA = a.status;
      valB = b.status;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit;
  const enquiries = filtered.slice(from, from + limit).map((e) => {
    const matchedEvent = sessionEvents.find((evt) => evt.id === e.eventId);
    return {
      ...e,
      eventName: e.eventName || matchedEvent?.title,
    };
  });

  const eventScoped = filters?.eventId && filters.eventId !== 'all'
    ? sessionEnquiries.filter((e) => e.eventId === filters.eventId)
    : sessionEnquiries;

  const stats: EnquiryStats = {
    total: eventScoped.length,
    new: eventScoped.filter((e) => e.status === 'new').length,
    contacted: eventScoped.filter((e) => e.status === 'contacted').length,
    in_progress: eventScoped.filter((e) => e.status === 'in_progress').length,
    resolved: eventScoped.filter((e) => e.status === 'resolved').length,
    closed: eventScoped.filter((e) => e.status === 'closed' || e.status === 'archived').length,
  };

  return {
    enquiries,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
    stats,
  };
}

/**
 * Retrieves a single enquiry record by ID.
 */
export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, events(title, slug, start_date, location_name)')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = sessionEnquiries.find((e) => e.id === id);
      if (!found) return null;
      const matchedEvent = sessionEvents.find((evt) => evt.id === found.eventId);
      return {
        ...found,
        eventName: found.eventName || matchedEvent?.title,
      };
    }

    return {
      id: data.id,
      type: data.type,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      companyName: data.company_name,
      designation: data.designation,
      subject: data.subject,
      message: data.message,
      eventId: data.event_id,
      eventName: data.events?.title || data.event_name,
      serviceId: data.service_id,
      status: data.status,
      adminNotes: data.admin_notes || data.notes,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    const found = sessionEnquiries.find((e) => e.id === id);
    if (!found) return null;
    const matchedEvent = sessionEvents.find((evt) => evt.id === found.eventId);
    return {
      ...found,
      eventName: found.eventName || matchedEvent?.title,
    };
  }
}

/**
 * Retrieves aggregate enquiry counts.
 */
export async function getEnquiryStats(eventId?: string): Promise<EnquiryStats> {
  try {
    const supabase = createClient();
    let query = supabase.from('enquiries').select('status');
    if (eventId && eventId !== 'all') {
      query = query.eq('event_id', eventId);
    }
    const { data, error } = await query;
    if (error || !data) {
      return getSessionEnquiryStats(eventId);
    }

    return {
      total: data.length,
      new: data.filter((e) => e.status === 'new').length,
      contacted: data.filter((e) => e.status === 'contacted').length,
      in_progress: data.filter((e) => e.status === 'in_progress').length,
      resolved: data.filter((e) => e.status === 'resolved').length,
      closed: data.filter((e) => e.status === 'closed' || e.status === 'archived').length,
    };
  } catch {
    return getSessionEnquiryStats(eventId);
  }
}

function getSessionEnquiryStats(eventId?: string): EnquiryStats {
  const records = eventId && eventId !== 'all'
    ? sessionEnquiries.filter((e) => e.eventId === eventId)
    : sessionEnquiries;

  return {
    total: records.length,
    new: records.filter((e) => e.status === 'new').length,
    contacted: records.filter((e) => e.status === 'contacted').length,
    in_progress: records.filter((e) => e.status === 'in_progress').length,
    resolved: records.filter((e) => e.status === 'resolved').length,
    closed: records.filter((e) => e.status === 'closed' || e.status === 'archived').length,
  };
}

/**
 * Updates status of an enquiry.
 */
export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionEnquiries.findIndex((e) => e.id === id);
    if (index !== -1) {
      sessionEnquiries[index] = {
        ...sessionEnquiries[index],
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update enquiry status.' };
  }
}

/**
 * Updates internal admin notes for an enquiry.
 */
export async function updateEnquiryNotes(
  id: string,
  adminNotes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionEnquiries.findIndex((e) => e.id === id);
    if (index !== -1) {
      sessionEnquiries[index] = {
        ...sessionEnquiries[index],
        adminNotes,
        notes: adminNotes,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('enquiries')
      .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update notes.' };
  }
}
