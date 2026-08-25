'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { AdminEnquiryFilters, EnquiryStatus, EnquiryType } from '@/types/enquiries';
import { Event } from '@/types/events';
import { Search, X } from 'lucide-react';

interface EnquiryFiltersBarProps {
  filters: AdminEnquiryFilters;
  eventsList: Event[];
  onFilterChange: (newFilters: Partial<AdminEnquiryFilters>) => void;
  onReset: () => void;
}

export function EnquiryFiltersBar({
  filters,
  eventsList,
  onFilterChange,
  onReset,
}: EnquiryFiltersBarProps) {
  const eventOptions = [
    { label: 'All Events & General', value: 'all' },
    ...eventsList.map((e) => ({
      label: `${e.title} (${e.city})`,
      value: e.id,
    })),
  ];

  const statusOptions: { label: string; value: EnquiryStatus | 'all' }[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'New Leads', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved / Won', value: 'resolved' },
    { label: 'Closed / Archived', value: 'closed' },
  ];

  const typeOptions: { label: string; value: EnquiryType | 'all' }[] = [
    { label: 'All Enquiry Funnels', value: 'all' },
    { label: 'Event Booking', value: 'event' },
    { label: 'Exhibitor Stall', value: 'exhibitor' },
    { label: 'Sponsorship Pitch', value: 'sponsor' },
    { label: 'Strategic Partnership', value: 'partnership' },
    { label: 'Digital Marketing & Ads', value: 'digital_marketing' },
    { label: 'General / Corporate', value: 'general' },
  ];

  const dateOptions = [
    { label: 'All Time Inbound', value: 'all' },
    { label: 'Received Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
  ];

  const sortOptions = [
    { label: 'Sort: Newest First', value: 'createdAt-desc' },
    { label: 'Sort: Oldest First', value: 'createdAt-asc' },
    { label: 'Sort: Contact Name', value: 'fullName-asc' },
    { label: 'Sort: Status', value: 'status-asc' },
  ];

  const handleSortChange = (val: string) => {
    const [sortBy, sortOrder] = val.split('-');
    onFilterChange({ sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 });
  };

  const currentSortVal = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.eventId !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input (4 cols) */}
        <div className="lg:col-span-4">
          <Input
            placeholder="Search contact, company, email, or subject..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          />
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value as any, page: 1 })}
            options={statusOptions}
          />
        </div>

        {/* Type Dropdown (3 cols) */}
        <div className="lg:col-span-3">
          <Select
            value={filters.type || 'all'}
            onChange={(e) => onFilterChange({ type: e.target.value as any, page: 1 })}
            options={typeOptions}
          />
        </div>

        {/* Event Dropdown (3 cols) */}
        <div className="lg:col-span-3">
          <Select
            value={filters.eventId || 'all'}
            onChange={(e) => onFilterChange({ eventId: e.target.value, page: 1 })}
            options={eventOptions}
          />
        </div>
      </div>

      {/* Date & Sort Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-dark-800/60">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="w-40">
            <Select
              value={filters.dateRange || 'all'}
              onChange={(e) => onFilterChange({ dateRange: e.target.value as any, page: 1 })}
              options={dateOptions}
            />
          </div>

          <div className="w-44">
            <Select
              value={currentSortVal}
              onChange={(e) => handleSortChange(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="h-3.5 w-3.5" />}
            className="text-xs text-dark-400 hover:text-white shrink-0 self-end sm:self-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
