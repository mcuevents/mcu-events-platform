'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Event, AdminEventFilters, AdminEventListResponse } from '@/types/events';
import {
  getAdminEvents,
  publishEvent,
  unpublishEvent,
  duplicateEvent,
  archiveEvent,
} from '@/services/adminEvents.service';
import { EventListHeader } from '@/components/admin/events/EventListHeader';
import { EventFiltersBar } from '@/components/admin/events/EventFiltersBar';
import { EventTable } from '@/components/admin/events/EventTable';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function AdminEventsPage() {
  const router = useRouter();

  const [eventsData, setEventsData] = useState<AdminEventListResponse>({
    events: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  });

  const [filters, setFilters] = useState<AdminEventFilters>({
    search: '',
    status: 'all',
    publication: 'all',
    registration: 'all',
    featured: 'all',
    category: 'all',
    sortBy: 'startDate',
    sortOrder: 'asc',
    page: 1,
    limit: 12,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Archive modal state
  const [archiveTarget, setArchiveTarget] = useState<{ id: string; title: string } | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const fetchEvents = useCallback(async (currentFilters: AdminEventFilters) => {
    setIsRefreshing(true);
    try {
      const res = await getAdminEvents(currentFilters);
      setEventsData(res);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load events.' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(filters);
  }, [fetchEvents, filters]);

  const handleFilterChange = (newFilters: Partial<AdminEventFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      publication: 'all',
      registration: 'all',
      featured: 'all',
      category: 'all',
      sortBy: 'startDate',
      sortOrder: 'asc',
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePublishToggle = async (id: string, currentlyPublished: boolean) => {
    if (currentlyPublished) {
      const res = await unpublishEvent(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Event unpublished and moved to draft.' });
        fetchEvents(filters);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to unpublish event.' });
      }
    } else {
      const res = await publishEvent(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Event published and is now live on the public website.' });
        fetchEvents(filters);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to publish event.' });
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicateEvent(id);
    if (res.success && res.newEventId) {
      setFeedback({ type: 'success', message: 'Event cloned successfully as a draft.' });
      fetchEvents(filters);
      router.push(`/admin/events/${res.newEventId}/edit`);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to duplicate event.' });
    }
  };

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;

    setIsArchiving(true);
    const res = await archiveEvent(archiveTarget.id);
    setIsArchiving(false);
    setArchiveTarget(null);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Event "${archiveTarget.title}" archived successfully. Attendee and enquiry history remains intact.`,
      });
      fetchEvents(filters);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to archive event.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Counter & Create Button */}
      <EventListHeader
        totalCount={eventsData.total}
        onRefresh={() => fetchEvents(filters)}
        isRefreshing={isRefreshing}
      />

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

      {/* 2. Multi-Filter & Search Bar */}
      <EventFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. Event Data Table */}
      <EventTable
        events={eventsData.events}
        total={eventsData.total}
        page={eventsData.page}
        totalPages={eventsData.totalPages}
        onPageChange={handlePageChange}
        onPublishToggle={handlePublishToggle}
        onDuplicate={handleDuplicate}
        onArchive={async (id, title) => {
          setArchiveTarget({ id, title });
        }}
        isActionLoading={isRefreshing}
      />

      {/* Archive Confirmation Modal */}
      {archiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 border-dark-800 bg-dark-950 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Archive Event?</h3>
                <p className="text-xs text-dark-400">Soft-delete protection</p>
              </div>
            </div>

            <p className="text-xs text-dark-300 leading-relaxed">
              Are you sure you want to archive <strong>&quot;{archiveTarget.title}&quot;</strong>? It will be removed from public listings, but all attendee registrations and business enquiry history will be safely preserved.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setArchiveTarget(null)}
                disabled={isArchiving}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleArchiveConfirm}
                isLoading={isArchiving}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Archive Event
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
