import { createClient } from '@/lib/supabase/client';
import {
  Event,
  AdminEventFormData,
  AdminEventFilters,
  AdminEventListResponse,
} from '@/types/events';
import { mockEvents, mockRegistrations, mockEnquiries } from '@/lib/mockData';

// In-memory array of events for active session mutations when running offline
export let sessionEvents: Event[] = [...mockEvents];

/**
 * Retrieves paginated, filtered list of events for the Admin CMS.
 */
export async function getAdminEvents(
  filters?: AdminEventFilters
): Promise<AdminEventListResponse> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 15;
  const sortBy = filters?.sortBy || 'startDate';
  const sortOrder = filters?.sortOrder || 'asc';

  try {
    const supabase = createClient();
    let query = supabase.from('events').select('*', { count: 'exact' });

    // Exclude archived by default unless specifically asked
    query = query.eq('is_archived', false);

    // Apply Search
    if (filters?.search) {
      const q = filters.search.trim();
      query = query.or(
        `title.ilike.%${q}%,city.ilike.%${q}%,location_name.ilike.%${q}%,slug.ilike.%${q}%`
      );
    }

    // Status filter
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Publication filter
    if (filters?.publication === 'published') {
      query = query.eq('is_published', true).neq('status', 'draft');
    } else if (filters?.publication === 'draft') {
      query = query.or('is_published.eq.false,status.eq.draft');
    }

    // Registration filter
    if (filters?.registration === 'open') {
      query = query.eq('registration_enabled', true);
    } else if (filters?.registration === 'closed') {
      query = query.eq('registration_enabled', false);
    }

    // Featured filter
    if (filters?.featured === 'featured') {
      query = query.eq('is_featured', true);
    } else if (filters?.featured === 'not_featured') {
      query = query.eq('is_featured', false);
    }

    // Category filter
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Sorting
    const columnMap: Record<string, string> = {
      startDate: 'start_date',
      createdAt: 'created_at',
      title: 'title',
    };
    const dbSortCol = columnMap[sortBy] || 'start_date';
    query = query.order(dbSortCol, { ascending: sortOrder === 'asc' });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionEvents(filters, page, limit, sortBy, sortOrder);
    }

    const events = (data as Event[]).map((evt) => {
      const regCount = mockRegistrations.filter((r) => r.eventId === evt.id).length;
      const enqCount = mockEnquiries.filter((e) => e.eventId === evt.id).length;
      return {
        ...evt,
        registrationCount: regCount,
        enquiryCount: enqCount,
      };
    });

    const total = count || events.length;
    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch {
    return getFilteredSessionEvents(filters, page, limit, sortBy, sortOrder);
  }
}

function getFilteredSessionEvents(
  filters: AdminEventFilters | undefined,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: string
): AdminEventListResponse {
  let filtered = sessionEvents.filter((e) => !e.isArchived);

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.locationName.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((e) => e.status === filters.status);
  }

  if (filters?.publication === 'published') {
    filtered = filtered.filter((e) => e.isPublished || e.status !== 'draft');
  } else if (filters?.publication === 'draft') {
    filtered = filtered.filter((e) => !e.isPublished || e.status === 'draft');
  }

  if (filters?.registration === 'open') {
    filtered = filtered.filter((e) => e.registrationOpen !== false && e.registrationEnabled !== false);
  } else if (filters?.registration === 'closed') {
    filtered = filtered.filter((e) => e.registrationOpen === false || e.registrationEnabled === false);
  }

  if (filters?.featured === 'featured') {
    filtered = filtered.filter((e) => e.isFeatured);
  } else if (filters?.featured === 'not_featured') {
    filtered = filtered.filter((e) => !e.isFeatured);
  }

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  // Sorting
  filtered.sort((a, b) => {
    let valA: any = a.startDate;
    let valB: any = b.startDate;
    if (sortBy === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    } else if (sortBy === 'createdAt') {
      valA = a.createdAt;
      valB = b.createdAt;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit;
  const events = filtered.slice(from, from + limit).map((evt) => ({
    ...evt,
    registrationCount: mockRegistrations.filter((r) => r.eventId === evt.id).length,
    enquiryCount: mockEnquiries.filter((e) => e.eventId === evt.id).length,
  }));

  return {
    events,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

/**
 * Retrieves full single event by ID for editing or previewing.
 */
export async function getAdminEventById(id: string): Promise<Event | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = sessionEvents.find((e) => e.id === id || e.slug === id);
      if (!found) return null;
      return {
        ...found,
        registrationCount: mockRegistrations.filter((r) => r.eventId === found.id).length,
        enquiryCount: mockEnquiries.filter((e) => e.eventId === found.id).length,
      };
    }

    const evt = data as Event;
    return {
      ...evt,
      registrationCount: mockRegistrations.filter((r) => r.eventId === evt.id).length,
      enquiryCount: mockEnquiries.filter((e) => e.eventId === evt.id).length,
    };
  } catch {
    const found = sessionEvents.find((e) => e.id === id || e.slug === id);
    if (!found) return null;
    return {
      ...found,
      registrationCount: mockRegistrations.filter((r) => r.eventId === found.id).length,
      enquiryCount: mockEnquiries.filter((e) => e.eventId === found.id).length,
    };
  }
}

/**
 * Creates a new event record.
 */
export async function createEvent(
  formData: AdminEventFormData
): Promise<{ success: boolean; event?: Event; error?: string }> {
  try {
    // 1. Slug uniqueness check
    const existing = sessionEvents.find((e) => e.slug === formData.slug);
    if (existing) {
      return {
        success: false,
        error: `An event with slug "${formData.slug}" already exists. Please choose a unique slug.`,
      };
    }

    const newId = `evt-${Date.now()}`;
    const newEvent: Event = {
      ...formData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: formData.isPublished || false,
      isArchived: false,
    };

    const supabase = createClient();
    const { data, error } = await supabase.from('events').insert({
      title: newEvent.title,
      slug: newEvent.slug,
      description: newEvent.description,
      content: newEvent.content,
      category: newEvent.category,
      status: newEvent.status,
      start_date: newEvent.startDate,
      end_date: newEvent.endDate,
      start_time: newEvent.startTime,
      end_time: newEvent.endTime,
      location_name: newEvent.locationName,
      address: newEvent.address,
      city: newEvent.city,
      state: newEvent.state,
      country: newEvent.country,
      pincode: newEvent.pincode,
      banner_image: newEvent.bannerImage,
      featured_image: newEvent.featuredImage,
      gallery_images: newEvent.galleryImages || [],
      ticket_types: newEvent.ticketTypes || [],
      speakers: newEvent.speakers || [],
      exhibitors: newEvent.exhibitors || [],
      sponsors: newEvent.sponsors || [],
      partners: newEvent.partners || [],
      faqs: newEvent.faqs || [],
      highlights: newEvent.highlights || [],
      organizer_name: newEvent.organizerName,
      organizer_contact: newEvent.organizerContact,
      organizer_email: newEvent.organizerEmail,
      google_maps_url: newEvent.googleMapsUrl,
      external_registration_url: newEvent.externalRegistrationUrl,
      is_featured: newEvent.isFeatured,
      is_published: newEvent.isPublished,
      is_archived: false,
      registration_enabled: newEvent.registrationEnabled !== false,
      registration_start_date: newEvent.registrationStartDate,
      registration_end_date: newEvent.registrationEndDate,
    }).select().single();

    sessionEvents.unshift(newEvent);

    return {
      success: true,
      event: (data as Event) || newEvent,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to create event. Please verify all required fields.',
    };
  }
}

/**
 * Updates an existing event record.
 */
export async function updateEvent(
  id: string,
  formData: Partial<AdminEventFormData>
): Promise<{ success: boolean; event?: Event; error?: string }> {
  try {
    // Check duplicate slug if slug was changed
    if (formData.slug) {
      const duplicate = sessionEvents.find((e) => e.slug === formData.slug && e.id !== id);
      if (duplicate) {
        return {
          success: false,
          error: `An event with slug "${formData.slug}" already exists. Please choose a unique slug.`,
        };
      }
    }

    const index = sessionEvents.findIndex((e) => e.id === id);
    if (index !== -1) {
      sessionEvents[index] = {
        ...sessionEvents[index],
        ...formData,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (formData.title) updatePayload.title = formData.title;
    if (formData.slug) updatePayload.slug = formData.slug;
    if (formData.description) updatePayload.description = formData.description;
    if (formData.content !== undefined) updatePayload.content = formData.content;
    if (formData.category) updatePayload.category = formData.category;
    if (formData.status) updatePayload.status = formData.status;
    if (formData.startDate) updatePayload.start_date = formData.startDate;
    if (formData.endDate) updatePayload.end_date = formData.endDate;
    if (formData.locationName) updatePayload.location_name = formData.locationName;
    if (formData.address) updatePayload.address = formData.address;
    if (formData.city) updatePayload.city = formData.city;
    if (formData.state !== undefined) updatePayload.state = formData.state;
    if (formData.country !== undefined) updatePayload.country = formData.country;
    if (formData.pincode !== undefined) updatePayload.pincode = formData.pincode;
    if (formData.bannerImage) updatePayload.banner_image = formData.bannerImage;
    if (formData.featuredImage !== undefined) updatePayload.featured_image = formData.featuredImage;
    if (formData.galleryImages) updatePayload.gallery_images = formData.galleryImages;
    if (formData.ticketTypes) updatePayload.ticket_types = formData.ticketTypes;
    if (formData.speakers) updatePayload.speakers = formData.speakers;
    if (formData.exhibitors) updatePayload.exhibitors = formData.exhibitors;
    if (formData.sponsors) updatePayload.sponsors = formData.sponsors;
    if (formData.partners) updatePayload.partners = formData.partners;
    if (formData.faqs) updatePayload.faqs = formData.faqs;
    if (formData.highlights) updatePayload.highlights = formData.highlights;
    if (formData.isFeatured !== undefined) updatePayload.is_featured = formData.isFeatured;
    if (formData.isPublished !== undefined) updatePayload.is_published = formData.isPublished;
    if (formData.isArchived !== undefined) updatePayload.is_archived = formData.isArchived;
    if (formData.registrationEnabled !== undefined) updatePayload.registration_enabled = formData.registrationEnabled;
    if (formData.googleMapsUrl !== undefined) updatePayload.google_maps_url = formData.googleMapsUrl;
    if (formData.externalRegistrationUrl !== undefined) updatePayload.external_registration_url = formData.externalRegistrationUrl;

    await supabase.from('events').update(updatePayload).eq('id', id);

    return {
      success: true,
      event: sessionEvents[index],
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to update event.',
    };
  }
}

/**
 * Publishes an event to the public website.
 */
export async function publishEvent(id: string): Promise<{ success: boolean; error?: string }> {
  const event = sessionEvents.find((e) => e.id === id);
  if (!event) {
    return { success: false, error: 'Event not found.' };
  }

  // Publication checklist validation
  if (!event.title || !event.startDate || !event.locationName || !event.bannerImage) {
    return {
      success: false,
      error: 'Cannot publish event. Please ensure Title, Start Date, Venue Name, and Hero Banner are completed.',
    };
  }

  return updateEvent(id, {
    isPublished: true,
    status: event.status === 'draft' ? 'upcoming' : event.status,
  });
}

/**
 * Unpublishes an event (hides from public website).
 */
export async function unpublishEvent(id: string): Promise<{ success: boolean; error?: string }> {
  return updateEvent(id, {
    isPublished: false,
    status: 'draft',
  });
}

/**
 * Archives an event (soft delete).
 */
export async function archiveEvent(id: string): Promise<{ success: boolean; error?: string }> {
  return updateEvent(id, {
    isArchived: true,
    isPublished: false,
  });
}

/**
 * Duplicates an event as a new draft.
 */
export async function duplicateEvent(
  id: string
): Promise<{ success: boolean; newEventId?: string; error?: string }> {
  const original = sessionEvents.find((e) => e.id === id);
  if (!original) {
    return { success: false, error: 'Original event not found.' };
  }

  const newSlug = `${original.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
  const duplicateFormData: AdminEventFormData = {
    ...original,
    title: `${original.title} (Copy)`,
    slug: newSlug,
    status: 'draft',
    isPublished: false,
    isFeatured: false,
    isArchived: false,
  };

  const res = await createEvent(duplicateFormData);
  if (res.success && res.event) {
    return { success: true, newEventId: res.event.id };
  }

  return { success: false, error: res.error || 'Failed to duplicate event.' };
}

/**
 * Uploads an image file to Supabase Storage `event-media` bucket.
 */
export async function uploadEventImage(
  file: File,
  folder: 'banners' | 'gallery' | 'speakers' | 'sponsors' = 'banners'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. File Type and Size Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file format. Only JPG, PNG, and WebP images are allowed.',
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size exceeds 5MB limit. Please compress the image.',
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from('event-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error || !data) {
      // Fallback: create object URL for local offline testing
      const objectUrl = URL.createObjectURL(file);
      return {
        success: true,
        url: objectUrl,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('event-media')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    // Local fallback
    const objectUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: objectUrl,
    };
  }
}
