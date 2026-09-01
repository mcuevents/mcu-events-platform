'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { AdminRegistrationFilters, Event, RegistrationStatus, RegistrationType } from '@/types/events';
import { Search, Filter, X } from 'lucide-react';

interface RegistrationFiltersBarProps {
  filters: AdminRegistrationFilters;
  eventsList: Event[];
  onFilterChange: (newFilters: Partial<AdminRegistrationFilters>) => void;
  onReset: () => void;
}

export function RegistrationFiltersBar({
  filters,
  eventsList,
  onFilterChange,
  onReset,
}: RegistrationFiltersBarProps) {
  const eventOptions = [
    { label: 'All Events & Expos', value: 'all' },
    ...eventsList.map((e) => ({
      label: `${e.title} (${e.city})`,
      value: e.id,
    })),
  ];

  const statusOptions: { label: string; value: RegistrationStatus | 'all' }[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending Review', value: 'pending' },
    { label: 'Confirmed Passes', value: 'confirmed' },
    { label: 'Attended / Checked-in', value: 'attended' },
    { label: 'Cancelled Passes', value: 'cancelled' },
  ];

  const typeOptions: { label: string; value: RegistrationType | 'all' }[] = [
    { label: 'All Pass Types', value: 'all' },
    { label: 'Visitor Pass', value: 'visitor' },
    { label: 'Exhibitor Delegate', value: 'exhibitor' },
    { label: 'Corporate Sponsor', value: 'sponsor' },
    { label: 'Business Enquiry', value: 'business_enquiry' },
    { label: 'VIP / Other', value: 'other' },
  ];

  const dateOptions = [
    { label: 'All Time Manifest', value: 'all' },
    { label: 'Registered Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
  ];

  const sortOptions = [
    { label: 'Sort: Newest First', value: 'createdAt-desc' },
    { label: 'Sort: Oldest First', value: 'createdAt-asc' },
    { label: 'Sort: Delegate Name', value: 'fullName-asc' },
    { label: 'Sort: Pass Status', value: 'status-asc' },
  ];

  const handleSortChange = (val: string) => {
    const [sortBy, sortOrder] = val.split('-');
    onFilterChange({ sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 });
  };

  const currentSortVal = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.eventId !== 'all' ||
    filters.status !== 'all' ||
    filters.registrationType !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input (4 cols) */}
        <div className="lg:col-span-4">
          <Input
            placeholder="Search name, email, phone, company, or ref..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          />
        </div>

        {/* Event Selector (3 cols) */}
        <div className="lg:col-span-3">
          <Select
            value={filters.eventId || 'all'}
            onChange={(e) => onFilterChange({ eventId: e.target.value, page: 1 })}
            options={eventOptions}
          />
        </div>

        {/* Status Selector (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value as any, page: 1 })}
            options={statusOptions}
          />
        </div>

        {/* Pass Type Selector (3 cols) */}
        <div className="lg:col-span-3">
          <Select
            value={filters.registrationType || 'all'}
            onChange={(e) => onFilterChange({ registrationType: e.target.value as any, page: 1 })}
            options={typeOptions}
          />
        </div>
      </div>

      {/* Date Filter & Sort Controls Row */}
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
