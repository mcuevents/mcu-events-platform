'use client';

import React from 'react';
import { DateRangeFilter, DateRangeOption } from '@/types/analytics';
import { Button } from '@/components/ui';
import { Calendar, RefreshCw, Clock } from 'lucide-react';

interface AnalyticsDateRangeSelectorProps {
  currentFilter: DateRangeFilter;
  onChange: (filter: DateRangeFilter) => void;
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const AnalyticsDateRangeSelector: React.FC<AnalyticsDateRangeSelectorProps> = ({
  currentFilter,
  onChange,
  lastUpdated,
  onRefresh,
  isRefreshing,
}) => {
  const options: { key: DateRangeOption; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: 'year', label: 'This Year' },
  ];

  return (
    <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Date Range Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {options.map((opt) => {
          const active = currentFilter.option === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange({ option: opt.key })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Timestamp & Refresh */}
      <div className="flex items-center gap-3 self-end sm:self-center">
        <span className="text-[11px] text-dark-400 flex items-center gap-1">
          <Clock className="h-3 w-3 text-dark-500" />
          Last updated: <span className="text-dark-300 font-mono">{lastUpdated}</span>
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};
