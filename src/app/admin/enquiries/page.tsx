'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Enquiry,
  AdminEnquiryFilters,
  AdminEnquiryListResponse,
  EnquiryStatus,
} from '@/types/enquiries';
import { Event } from '@/types/events';
import {
  getAdminEnquiries,
  updateEnquiryStatus,
} from '@/services/adminEnquiries.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { EnquiryStatsGrid } from '@/components/admin/enquiries/EnquiryStatsGrid';
import { EnquiryFiltersBar } from '@/components/admin/enquiries/EnquiryFiltersBar';
import { EnquiryTable } from '@/components/admin/enquiries/EnquiryTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial filters from URL parameters
  const initialEvent = searchParams.get('event') || 'all';
  const initialStatus = (searchParams.get('status') as EnquiryStatus | 'all') || 'all';
  const initialType = (searchParams.get('type') as any) || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<AdminEnquiryFilters>({
    search: initialSearch,
    eventId: initialEvent,
    status: initialStatus,
    type: initialType,
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [data, setData] = useState<AdminEnquiryListResponse>({
    enquiries: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
    stats: { total: 0, new: 0, contacted: 0, in_progress: 0, resolved: 0, closed: 0 },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadEvents() {
      const res = await getAdminEvents({ limit: 100 });
      setEventsList(res.events);
    }
    loadEvents();
  }, []);

  const updateUrlParams = useCallback(
    (newFilters: AdminEnquiryFilters) => {
      const params = new URLSearchParams();
      if (newFilters.eventId && newFilters.eventId !== 'all') params.set('event', newFilters.eventId);
      if (newFilters.status && newFilters.status !== 'all') params.set('status', newFilters.status);
      if (newFilters.type && newFilters.type !== 'all') params.set('type', newFilters.type);
      if (newFilters.search) params.set('search', newFilters.search);
      const queryStr = params.toString();
      router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const fetchEnquiries = useCallback(
    async (currentFilters: AdminEnquiryFilters) => {
      setIsRefreshing(true);
      try {
        const res = await getAdminEnquiries(currentFilters);
        setData(res);
      } catch {
        setFeedback({ type: 'error', message: 'Failed to load enquiries.' });
      } finally {
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchEnquiries(filters);
  }, [fetchEnquiries, filters]);

  const handleFilterChange = (newFilters: Partial<AdminEnquiryFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      updateUrlParams(updated);
      return updated;
    });
  };

  const handleResetFilters = () => {
    const defaultFilters: AdminEnquiryFilters = {
      search: '',
      eventId: 'all',
      status: 'all',
      type: 'all',
      dateRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
    };
    setFilters(defaultFilters);
    updateUrlParams(defaultFilters);
  };

  const handleStatusCardClick = (status: EnquiryStatus | 'all') => {
    handleFilterChange({ status, page: 1 });
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    const res = await updateEnquiryStatus(id, newStatus);
    if (res.success) {
      setFeedback({ type: 'success', message: `Enquiry status updated to ${newStatus.replace('_', ' ')}.` });
      fetchEnquiries(filters);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Refresh CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Inbound Leads & Enquiries
            </h1>
            <Badge variant="gold" size="sm">
              {data.stats.total} Total
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Review inbound client inquiries, track pipeline status, manage sponsor and stall bookings, and document follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchEnquiries(filters)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-dark-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. 6-Metric Statistics Grid */}
      <EnquiryStatsGrid
        stats={data.stats}
        activeStatusFilter={filters.status}
        onStatusClick={handleStatusCardClick}
      />

      {/* 3. Multi-Filter & Search Bar */}
      <EnquiryFiltersBar
        filters={filters}
        eventsList={eventsList}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 4. Enquiry Data Table */}
      <EnquiryTable
        enquiries={data.enquiries}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={(p) => handleFilterChange({ page: p })}
        onStatusChange={handleStatusChange}
        isActionLoading={isRefreshing}
      />
    </div>
  );
}
