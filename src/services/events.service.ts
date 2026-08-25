import { Event, EventFilters } from '@/types/events';
import { createClient } from '@/lib/supabase/client';
import { mockEvents } from '@/lib/mockData';
import { sessionEvents } from './adminEvents.service';

/**
 * Events Service Layer
 * Queries Supabase database with fallback to rich seed dataset.
 * Excludes draft events from public consumer queries.
 */

export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('events').select('*');

    // Never return draft events to public visitors
    query = query.neq('status', 'draft');

    if (filters?.category && filters.category !== ('all' as any)) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status && filters.status !== ('all' as any)) {
      query = query.eq('status', filters.status);
    }
    if (filters?.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return filterMockEvents(filters);
    }

    let results = data as Event[];
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.city?.toLowerCase().includes(q) ||
          e.locationName?.toLowerCase().includes(q)
      );
    }

    return results;
  } catch {
    return filterMockEvents(filters);
  }
}

function filterMockEvents(filters?: EventFilters): Event[] {
  // Public events: exclude draft and archived
  let filtered = sessionEvents.filter((e) => e.status !== 'draft' && !e.isArchived);

  if (filters?.category && filters.category !== ('all' as any)) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }
  if (filters?.status && filters.status !== ('all' as any)) {
    filtered = filtered.filter((e) => e.status === filters.status);
  }
  if (filters?.isFeatured !== undefined) {
    filtered = filtered.filter((e) => e.isFeatured === filters.isFeatured);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.locationName.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!slug) return null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .neq('status', 'draft') // Draft events are not publicly accessible
      .single();

    if (error || !data) {
      const found = sessionEvents.find((e) => e.slug === slug && e.status !== 'draft' && !e.isArchived);
      return found || null;
    }

    return data as Event;
  } catch {
    const found = sessionEvents.find((e) => e.slug === slug && e.status !== 'draft' && !e.isArchived);
    return found || null;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return getEvents({ isFeatured: true });
}

export async function getFeaturedEvent(): Promise<Event | null> {
  const featured = await getFeaturedEvents();
  return featured.length > 0 ? featured[0] : null;
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const events = await getEvents({ status: 'upcoming' });
  const sorted = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getPastEvents(limit?: number): Promise<Event[]> {
  const events = await getEvents({ status: 'completed' });
  const sorted = events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}
