'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  EventRegistration,
  AdminRegistrationFilters,
  AdminRegistrationListResponse,
  RegistrationStatus,
  Event,
} from '@/types/events';
import {
  getAdminRegistrations,
  updateRegistrationStatus,
  bulkUpdateRegistrationStatus,
  exportRegistrationsCSV,
} from '@/services/adminRegistrations.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { RegistrationStatsGrid } from '@/components/admin/registrations/RegistrationStatsGrid';
import { RegistrationFiltersBar } from '@/components/admin/registrations/RegistrationFiltersBar';
import { RegistrationTable } from '@/components/admin/registrations/RegistrationTable';
import { BulkActionModal } from '@/components/admin/registrations/BulkActionModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import {
  Ticket,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial filters from URL query parameters
  const initialEvent = searchParams.get('event') || 'all';
  const initialStatus = (searchParams.get('status') as RegistrationStatus | 'all') || 'all';
  const initialType = (searchParams.get('type') as any) || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<AdminRegistrationFilters>({
    search: initialSearch,
    eventId: initialEvent,
    status: initialStatus,
    registrationType: initialType,
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [data, setData] = useState<AdminRegistrationListResponse>({
    registrations: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
    stats: { total: 0, pending: 0, confirmed: 0, cancelled: 0, attended: 0 },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Bulk modal state
  const [bulkModal, setBulkModal] = useState<{
    isOpen: boolean;
    status: RegistrationStatus;
    ids: string[];
  }>({
    isOpen: false,
    status: 'confirmed',
    ids: [],
  });
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Load events list for the dropdown
  useEffect(() => {
    async function loadEvents() {
      const res = await getAdminEvents({ limit: 100 });
      setEventsList(res.events);
    }
    loadEvents();
  }, []);

  // Update URL search parameters when filters change
  const updateUrlParams = useCallback(
    (newFilters: AdminRegistrationFilters) => {
      const params = new URLSearchParams();
      if (newFilters.eventId && newFilters.eventId !== 'all') params.set('event', newFilters.eventId);
      if (newFilters.status && newFilters.status !== 'all') params.set('status', newFilters.status);
      if (newFilters.registrationType && newFilters.registrationType !== 'all') params.set('type', newFilters.registrationType);
      if (newFilters.search) params.set('search', newFilters.search);
      const queryStr = params.toString();
      router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const fetchRegistrations = useCallback(
    async (currentFilters: AdminRegistrationFilters) => {
      setIsRefreshing(true);
      try {
        const res = await getAdminRegistrations(currentFilters);
        setData(res);
      } catch {
        setFeedback({ type: 'error', message: 'Failed to load registrations.' });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRegistrations(filters);
  }, [fetchRegistrations, filters]);

  const handleFilterChange = (newFilters: Partial<AdminRegistrationFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      updateUrlParams(updated);
      return updated;
    });
  };

  const handleResetFilters = () => {
    const defaultFilters: AdminRegistrationFilters = {
      search: '',
      eventId: 'all',
      status: 'all',
      registrationType: 'all',
      dateRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
    };
    setFilters(defaultFilters);
    updateUrlParams(defaultFilters);
  };

  const handleStatusCardClick = (status: RegistrationStatus | 'all') => {
    handleFilterChange({ status, page: 1 });
  };

  const handleStatusChange = async (id: string, newStatus: RegistrationStatus) => {
    const res = await updateRegistrationStatus(id, newStatus);
    if (res.success) {
      setFeedback({ type: 'success', message: `Registration status updated to ${newStatus}.` });
      fetchRegistrations(filters);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
    }
  };

  const handleBulkActionTrigger = (status: RegistrationStatus, ids: string[]) => {
    setBulkModal({
      isOpen: true,
      status,
      ids,
    });
  };

  const handleBulkConfirm = async () => {
    setIsBulkLoading(true);
    const res = await bulkUpdateRegistrationStatus(bulkModal.ids, bulkModal.status);
    setIsBulkLoading(false);
    setBulkModal({ isOpen: false, status: 'confirmed', ids: [] });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${res.updatedCount} registration passes successfully updated to ${bulkModal.status}.`,
      });
      fetchRegistrations(filters);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update selected registrations.' });
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const { csvContent, filename } = await exportRegistrationsCSV(filters);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setFeedback({
        type: 'success',
        message: `Exported manifest "${filename}" successfully.`,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to export registrations. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Export & Refresh CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Ticket className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Delegate Registrations Console
            </h1>
            <Badge variant="gold" size="sm">
              {data.stats.total} Total
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Review delegate applications, issue pass confirmations, manage turnstile attendance, and export manifests.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRegistrations(filters)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            isLoading={isExporting}
            leftIcon={<Download className="h-4 w-4" />}
          >
            {isExporting ? 'Generating CSV...' : 'Export CSV'}
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

      {/* 2. 5-Metric Status Statistics Grid */}
      <RegistrationStatsGrid
        stats={data.stats}
        activeStatusFilter={filters.status}
        onStatusClick={handleStatusCardClick}
      />

      {/* 3. Multi-Filter & Search Bar */}
      <RegistrationFiltersBar
        filters={filters}
        eventsList={eventsList}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 4. Registration Data Table with Bulk Checkboxes */}
      <RegistrationTable
        registrations={data.registrations}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={(p) => handleFilterChange({ page: p })}
        onStatusChange={handleStatusChange}
        onBulkAction={handleBulkActionTrigger}
        isActionLoading={isRefreshing}
      />

      {/* 5. Bulk Action Confirmation Modal */}
      <BulkActionModal
        isOpen={bulkModal.isOpen}
        targetStatus={bulkModal.status}
        selectedCount={bulkModal.ids.length}
        onConfirm={handleBulkConfirm}
        onCancel={() => setBulkModal({ isOpen: false, status: 'confirmed', ids: [] })}
        isLoading={isBulkLoading}
      />
    </div>
  );
}
