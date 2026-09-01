'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { AdminEventFilters, EventCategory, EventStatus } from '@/types/events';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface EventFiltersBarProps {
  filters: AdminEventFilters;
  onFilterChange: (newFilters: Partial<AdminEventFilters>) => void;
  onReset: () => void;
}

export function EventFiltersBar({
  filters,
  onFilterChange,
  onReset,
}: EventFiltersBarProps) {
  const categories: { label: string; value: EventCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Exhibitions & Expos', value: 'exhibition' },
    { label: 'Conferences & Summits', value: 'conference' },
    { label: 'Workshops & Masterclasses', value: 'workshop' },
    { label: 'Concerts & Gala Nights', value: 'concert' },
    { label: 'Corporate Summits', value: 'corporate' },
  ];

  const statuses: { label: string; value: EventStatus | 'all' }[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing / Live', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Draft', value: 'draft' },
    { label: 'Postponed', value: 'postponed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.publication !== 'all' ||
    filters.registration !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800 space-y-3">
      {/* Top Search & Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Bar (5 cols) */}
        <div className="lg:col-span-4">
          <Input
            placeholder="Search by title, city, venue, or slug..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          />
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value as any, page: 1 })}
            options={statuses}
          />
        </div>

        {/* Publication Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.publication || 'all'}
            onChange={(e) => onFilterChange({ publication: e.target.value as any, page: 1 })}
            options={[
              { label: 'All Visibility', value: 'all' },
              { label: 'Published Live', value: 'published' },
              { label: 'Draft / Hidden', value: 'draft' },
            ]}
          />
        </div>

        {/* Registration Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.registration || 'all'}
            onChange={(e) => onFilterChange({ registration: e.target.value as any, page: 1 })}
            options={[
              { label: 'All Registrations', value: 'all' },
              { label: 'Passes Open', value: 'open' },
              { label: 'Passes Closed', value: 'closed' },
            ]}
          />
        </div>

        {/* Sort By Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.sortBy || 'startDate'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
            options={[
              { label: 'Sort: Event Date', value: 'startDate' },
              { label: 'Sort: Created Date', value: 'createdAt' },
              { label: 'Sort: Title', value: 'title' },
            ]}
          />
        </div>
      </div>

      {/* Category Pills & Reset Row */}
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-dark-400 shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = (filters.category || 'all') === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onFilterChange({ category: cat.value, page: 1 })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-brand-500 text-dark-950 font-bold'
                    : 'bg-dark-950 text-dark-300 hover:text-white border border-dark-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="h-3 w-3" />}
            className="text-xs text-dark-400 hover:text-white shrink-0"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
