import { Event, EventFilters } from '@/types/events';
import { mockEvents } from '@/lib/mockData';

/**
 * Events Service Layer
 * Serves the static seed dataset (no backend/database).
 * Excludes draft events from public consumer queries.
 */

export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  return filterMockEvents(filters);
}

function filterMockEvents(filters?: EventFilters): Event[] {
  // Public events: exclude draft
  let filtered = mockEvents.filter((e) => e.status !== 'draft');

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

  const found = mockEvents.find((e) => e.slug === slug && e.status !== 'draft');
  return found || null;
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
