'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Section } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EventGrid } from '@/components/events/EventGrid';
import { getEvents } from '@/services/events.service';
import { Event, EventCategory } from '@/types/events';
import { Search, Sparkles, X } from 'lucide-react';

const CATEGORIES: { label: string; value: EventCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Expos & Exhibitions', value: 'exhibition' },
  { label: 'Conferences & Summits', value: 'conference' },
  { label: 'Workshops & Masterclasses', value: 'workshop' },
  { label: 'Corporate Events', value: 'corporate' },
];

const STATUS_FILTERS: { label: string; value: 'all' | 'upcoming' | 'completed' }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming Events', value: 'upcoming' },
  { label: 'Past Editions', value: 'completed' },
];

function EventsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilter = searchParams.get('filter') as 'all' | 'upcoming' | 'completed' | null;
  const initialCategory = searchParams.get('category') as EventCategory | null;
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'completed'>(
    initialFilter === 'upcoming' || initialFilter === 'completed' ? initialFilter : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  const updateUrlParams = useCallback(
    (status: string, cat: string, search: string) => {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('filter', status);
      if (cat !== 'all') params.set('category', cat);
      if (search.trim()) params.set('search', search.trim());

      const qs = params.toString();
      const newUrl = qs ? `/events?${qs}` : '/events';
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = (status: 'all' | 'upcoming' | 'completed') => {
    setSelectedStatus(status);
    updateUrlParams(status, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (cat: EventCategory | 'all') => {
    setSelectedCategory(cat);
    updateUrlParams(selectedStatus, cat, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrlParams(selectedStatus, selectedCategory, query);
  };

  const handleClearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSearchQuery('');
    router.replace('/events', { scroll: false });
  };

  const filteredEvents = events.filter((evt) => {
    const matchesStatus =
      selectedStatus === 'all' || evt.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const hasActiveFilters =
    selectedStatus !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '';

  return (
    <Section spacing="lg" className="bg-[#FAF8F5]">
      <Container className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            badge="CALENDAR"
            title="Events & Expos"
            subtitle="Explore upcoming and past events managed by MCU Creations."
            align="left"
          />

          <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6258] bg-white border border-[#EAE0D5] px-4 py-2.5 rounded-full shrink-0 self-start md:self-auto shadow-sm">
            <span className="text-[#B8862B]">◆</span>
            <span>{events.length} Events Listed</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 p-6 rounded-3xl bg-white border border-[#EAE0D5] shadow-sm">
          {/* Top Row: Status Tabs + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {STATUS_FILTERS.map((st) => {
                const active = selectedStatus === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => handleStatusChange(st.value)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      active
                        ? 'gold-gradient-btn'
                        : 'bg-[#FAF8F5] text-[#6E6258] hover:text-[#2C241C] border border-[#EAE0D5] hover:border-[#B8862B]'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>

            {/* Search Field */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A6D62]" />
              <input
                type="text"
                placeholder="Search by title, city, or venue..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE0D5] text-xs text-[#2C241C] placeholder-[#7A6D62] focus:outline-none focus:border-[#B8862B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6D62] hover:text-[#2C241C] font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Pills & Clear Filter Button */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none pt-4 border-t border-[#F3ECE4]">
            <div className="flex items-center gap-2 shrink-0">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/30 font-bold'
                        : 'text-[#6E6258] hover:text-[#2C241C]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-[#B8862B] hover:text-[#9E701C] font-bold shrink-0 ml-2 whitespace-nowrap"
              >
                <X className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Event Grid */}
        <EventGrid
          events={filteredEvents}
          isLoading={loading}
          emptyTitle={
            hasActiveFilters
              ? 'No matching events found'
              : 'No Events Currently Listed'
          }
          emptyDescription={
            hasActiveFilters
              ? 'Try adjusting your status, category filters, or search keywords.'
              : 'New events will be published soon. Check back or contact us for upcoming calendar schedules.'
          }
        />
      </Container>
    </Section>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-[#7A6D62]">Loading events directory...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}
