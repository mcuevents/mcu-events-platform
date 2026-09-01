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
import { PartnersTable } from '@/components/admin/content/PartnersTable';
import { PartnerModal } from '@/components/admin/content/PartnerModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Handshake, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPartnersPage() {
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
      const [ptRes, evtRes] = await Promise.all([
        getAdminPartners({ category: 'partner' }),
        getAdminEvents({ limit: 100 }),
      ]);
      setItems(ptRes.items);
      setEventsList(evtRes.events);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load strategic partners.' });
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
        message: editingItem ? 'Partner organization updated.' : 'New strategic partner added.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save partner.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this partner?')) return;
    const res = await deletePartner(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Partner removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete partner.' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const res = await updatePartner(id, { isActive });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isActive ? 'Partner activated on public site.' : 'Partner deactivated.',
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
              <Handshake className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Strategic Partners & Alliances CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Partners
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Manage institutional chambers, trade promotion councils, venue partnerships, and media federations.
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
            Add Partner
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

      {/* 2. Partners Table */}
      <PartnersTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onToggleActive={handleToggleActive}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <PartnerModal
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
