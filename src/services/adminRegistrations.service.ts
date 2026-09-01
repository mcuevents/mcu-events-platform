import { createClient } from '@/lib/supabase/client';
import {
  EventRegistration,
  RegistrationStatus,
  RegistrationStats,
  AdminRegistrationFilters,
  AdminRegistrationListResponse,
} from '@/types/events';
import { mockRegistrations, mockEvents } from '@/lib/mockData';
import { sessionEvents } from './adminEvents.service';

// In-memory array of registrations for active mutations during offline development
export let sessionRegistrations: EventRegistration[] = [...mockRegistrations];

/**
 * Retrieves paginated, filtered delegate registrations for the Admin Console.
 */
export async function getAdminRegistrations(
  filters?: AdminRegistrationFilters
): Promise<AdminRegistrationListResponse> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const sortBy = filters?.sortBy || 'createdAt';
  const sortOrder = filters?.sortOrder || 'desc';

  try {
    const supabase = createClient();
    let query = supabase
      .from('event_registrations')
      .select('*, events(title, slug, start_date, location_name)', { count: 'exact' });

    // Filter by Event
    if (filters?.eventId && filters.eventId !== 'all') {
      query = query.eq('event_id', filters.eventId);
    }

    // Filter by Status
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Filter by Registration Type
    if (filters?.registrationType && filters.registrationType !== 'all') {
      query = query.eq('registration_type', filters.registrationType);
    }

    // Filter by Date Range
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

    // Search query
    if (filters?.search) {
      const q = filters.search.trim();
      query = query.or(
        `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,company_name.ilike.%${q}%,reference_code.ilike.%${q}%`
      );
    }

    // Sorting
    const columnMap: Record<string, string> = {
      createdAt: 'created_at',
      fullName: 'full_name',
      status: 'status',
    };
    const dbSortCol = columnMap[sortBy] || 'created_at';
    query = query.order(dbSortCol, { ascending: sortOrder === 'asc' });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionRegistrations(filters, page, limit, sortBy, sortOrder);
    }

    const registrations: EventRegistration[] = (data as any[]).map((r) => {
      const eventData = r.events;
      return {
        id: r.id,
        eventId: r.event_id,
        eventTitle: eventData?.title || 'MCU Expo',
        eventSlug: eventData?.slug || '',
        eventDate: eventData?.start_date,
        eventVenue: eventData?.location_name,
        ticketTypeId: r.ticket_type_id,
        registrationType: r.registration_type,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        companyName: r.company_name,
        designation: r.designation,
        attendeesCount: r.attendees_count,
        status: r.status,
        totalPrice: Number(r.total_price) || 0,
        currency: r.currency || 'INR',
        referenceCode: r.reference_code,
        notes: r.notes,
        metadata: r.metadata,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });

    const stats = await getRegistrationStats(filters?.eventId);
    const total = count || registrations.length;
    const totalPages = Math.ceil(total / limit);

    return {
      registrations,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      stats,
    };
  } catch {
    return getFilteredSessionRegistrations(filters, page, limit, sortBy, sortOrder);
  }
}

function getFilteredSessionRegistrations(
  filters: AdminRegistrationFilters | undefined,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: string
): AdminRegistrationListResponse {
  let filtered = [...sessionRegistrations];

  // Filter by Event
  if (filters?.eventId && filters.eventId !== 'all') {
    filtered = filtered.filter((r) => r.eventId === filters.eventId);
  }

  // Filter by Status
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  // Filter by Registration Type
  if (filters?.registrationType && filters.registrationType !== 'all') {
    filtered = filtered.filter((r) => r.registrationType === filters.registrationType);
  }

  // Filter by Date Range
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
      filtered = filtered.filter((r) => new Date(r.createdAt) >= fromDate!);
    }
  }

  // Search
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.companyName && r.companyName.toLowerCase().includes(q)) ||
        (r.referenceCode && r.referenceCode.toLowerCase().includes(q)) ||
        (r.eventTitle && r.eventTitle.toLowerCase().includes(q))
    );
  }

  // Sorting
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
  const registrations = filtered.slice(from, from + limit).map((r) => {
    const matchedEvent = sessionEvents.find((e) => e.id === r.eventId);
    return {
      ...r,
      eventTitle: r.eventTitle || matchedEvent?.title || 'MCU Expo',
      eventSlug: r.eventSlug || matchedEvent?.slug || '',
      eventDate: r.eventDate || matchedEvent?.startDate,
      eventVenue: r.eventVenue || matchedEvent?.locationName,
    };
  });

  // Calculate stats for the current event filter
  const eventScoped = filters?.eventId && filters.eventId !== 'all'
    ? sessionRegistrations.filter((r) => r.eventId === filters.eventId)
    : sessionRegistrations;

  const stats: RegistrationStats = {
    total: eventScoped.length,
    pending: eventScoped.filter((r) => r.status === 'pending').length,
    confirmed: eventScoped.filter((r) => r.status === 'confirmed').length,
    cancelled: eventScoped.filter((r) => r.status === 'cancelled').length,
    attended: eventScoped.filter((r) => r.status === 'attended').length,
  };

  return {
    registrations,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
    stats,
  };
}

/**
 * Retrieves a single delegate registration by ID.
 */
export async function getRegistrationById(id: string): Promise<EventRegistration | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(title, slug, start_date, end_date, location_name, address, city, banner_image)')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = sessionRegistrations.find((r) => r.id === id);
      if (!found) return null;
      const matchedEvent = sessionEvents.find((e) => e.id === found.eventId);
      return {
        ...found,
        eventTitle: found.eventTitle || matchedEvent?.title || 'MCU Expo',
        eventSlug: found.eventSlug || matchedEvent?.slug || '',
        eventDate: found.eventDate || matchedEvent?.startDate,
        eventVenue: found.eventVenue || matchedEvent?.locationName,
      };
    }

    const eventData = (data as any).events;
    return {
      id: data.id,
      eventId: data.event_id,
      eventTitle: eventData?.title || 'MCU Expo',
      eventSlug: eventData?.slug || '',
      eventDate: eventData?.start_date,
      eventVenue: eventData?.location_name,
      ticketTypeId: data.ticket_type_id,
      registrationType: data.registration_type,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      companyName: data.company_name,
      designation: data.designation,
      attendeesCount: data.attendees_count,
      status: data.status,
      totalPrice: Number(data.total_price) || 0,
      currency: data.currency || 'INR',
      referenceCode: data.reference_code,
      notes: data.notes,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    const found = sessionRegistrations.find((r) => r.id === id);
    if (!found) return null;
    const matchedEvent = sessionEvents.find((e) => e.id === found.eventId);
    return {
      ...found,
      eventTitle: found.eventTitle || matchedEvent?.title || 'MCU Expo',
      eventSlug: found.eventSlug || matchedEvent?.slug || '',
      eventDate: found.eventDate || matchedEvent?.startDate,
      eventVenue: found.eventVenue || matchedEvent?.locationName,
    };
  }
}

/**
 * Retrieves aggregate registration statistics (overall or event-scoped).
 */
export async function getRegistrationStats(eventId?: string): Promise<RegistrationStats> {
  try {
    const supabase = createClient();
    let query = supabase.from('event_registrations').select('status');

    if (eventId && eventId !== 'all') {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;
    if (error || !data) {
      return getSessionStats(eventId);
    }

    return {
      total: data.length,
      pending: data.filter((r) => r.status === 'pending').length,
      confirmed: data.filter((r) => r.status === 'confirmed').length,
      cancelled: data.filter((r) => r.status === 'cancelled').length,
      attended: data.filter((r) => r.status === 'attended').length,
    };
  } catch {
    return getSessionStats(eventId);
  }
}

function getSessionStats(eventId?: string): RegistrationStats {
  const records = eventId && eventId !== 'all'
    ? sessionRegistrations.filter((r) => r.eventId === eventId)
    : sessionRegistrations;

  return {
    total: records.length,
    pending: records.filter((r) => r.status === 'pending').length,
    confirmed: records.filter((r) => r.status === 'confirmed').length,
    cancelled: records.filter((r) => r.status === 'cancelled').length,
    attended: records.filter((r) => r.status === 'attended').length,
  };
}

/**
 * Updates status of a single registration.
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionRegistrations.findIndex((r) => r.id === id);
    if (index !== -1) {
      sessionRegistrations[index] = {
        ...sessionRegistrations[index],
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('event_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update registration status.' };
  }
}

/**
 * Batch updates multiple registrations.
 */
export async function bulkUpdateRegistrationStatus(
  ids: string[],
  status: RegistrationStatus
): Promise<{ success: boolean; updatedCount: number; error?: string }> {
  if (!ids || ids.length === 0) {
    return { success: false, updatedCount: 0, error: 'No registrations selected.' };
  }

  try {
    sessionRegistrations = sessionRegistrations.map((r) =>
      ids.includes(r.id) ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );

    const supabase = createClient();
    await supabase
      .from('event_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids);

    return { success: true, updatedCount: ids.length };
  } catch (err: any) {
    return { success: false, updatedCount: 0, error: err.message || 'Failed to perform bulk status update.' };
  }
}

/**
 * Exports filtered registrations into a structured CSV string and sanitized filename.
 */
export async function exportRegistrationsCSV(
  filters?: AdminRegistrationFilters
): Promise<{ csvContent: string; filename: string }> {
  const result = await getAdminRegistrations({
    ...filters,
    page: 1,
    limit: 10000, // Export all matching records
  });

  const headers = [
    'Reference Code',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Company Name',
    'Designation',
    'Attendee Type',
    'Event Title',
    'Pass Status',
    'Attendees Count',
    'Total Price (INR)',
    'Registered Date (IST)',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = result.registrations.map((r) => [
    escapeCSV(r.referenceCode || r.id),
    escapeCSV(r.fullName),
    escapeCSV(r.email),
    escapeCSV(r.phone),
    escapeCSV(r.companyName || 'N/A'),
    escapeCSV(r.designation || 'N/A'),
    escapeCSV(r.registrationType?.toUpperCase() || 'VISITOR'),
    escapeCSV(r.eventTitle || 'MCU Expo'),
    escapeCSV(r.status.toUpperCase()),
    escapeCSV(r.attendeesCount),
    escapeCSV(r.totalPrice),
    escapeCSV(new Date(r.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Format dynamic sanitized filename
  const dateStr = new Date().toISOString().split('T')[0];
  let filename = `MCU-Creations-Registrations-${dateStr}.csv`;
  if (filters?.eventId && filters.eventId !== 'all') {
    const matchedEvent = sessionEvents.find((e) => e.id === filters.eventId);
    if (matchedEvent) {
      const sanitizedTitle = matchedEvent.title
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-');
      filename = `MCU-Creations-${sanitizedTitle}-Registrations-${dateStr}.csv`;
    }
  }

  return { csvContent, filename };
}
