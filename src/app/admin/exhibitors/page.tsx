'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EntityPartner } from '@/types/partners';
import { Event } from '@/types/events';
import {
  getAdminPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '@/services/adminContent.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { ExhibitorsTable } from '@/components/admin/content/ExhibitorsTable';
import { ExhibitorModal } from '@/components/admin/content/ExhibitorModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Store, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminExhibitorsPage() {
  const [items, setItems] = useState<EntityPartner[]>([]);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EntityPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [exRes, evtRes] = await Promise.all([
        getAdminPartners({ category: 'exhibitor' }),
        getAdminEvents({ limit: 100 }),
      ]);
      setItems(exRes.items);
      setEventsList(evtRes.events);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load exhibitors.' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EntityPartner) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<EntityPartner, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updatePartner(editingItem.id, data);
    } else {
      res = await createPartner(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Exhibitor stall updated.' : 'New exhibitor added.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save exhibitor.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this exhibitor?')) return;
    const res = await deletePartner(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Exhibitor removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete exhibitor.' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const res = await updatePartner(id, { isActive });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isActive ? 'Exhibitor published to brand directory.' : 'Exhibitor hidden from public directory.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to update status.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Exhibitor Stalls & Brand Directory CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Exhibitors
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Manage participating brands, allocate hall booth numbers, update showcase descriptions, and manage exhibitor contacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Exhibitor
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
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

      {/* 2. Exhibitors Table */}
      <ExhibitorsTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onToggleActive={handleToggleActive}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <ExhibitorModal
        isOpen={isModalOpen}
        initialData={editingItem}
        eventsList={eventsList}
        onSave={handleSaveItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
