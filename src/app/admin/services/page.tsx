'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceItem, ServiceItemFormData } from '@/types/cms';
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
} from '@/services/adminServices.service';
import { ServicesTable } from '@/components/admin/services/ServicesTable';
import { ServiceModal } from '@/components/admin/services/ServiceModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Briefcase, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getAdminServices();
      setItems(res.items);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load services.' });
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

  const handleOpenEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: ServiceItemFormData) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateService(editingItem.id, data);
    } else {
      res = await createService(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Service package updated successfully.' : 'New service vertical created.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save service.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this service package?')) return;
    const res = await deleteService(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Service removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete service.' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const res = await toggleServiceActive(id, isActive);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isActive ? 'Service is now visible on public site.' : 'Service hidden from public site.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to toggle service status.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Services & Business Verticals CMS
            </h1>
            <Badge variant="blue" size="sm">
              {items.length} Verticals
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Configure turnkey event execution packages, performance digital marketing, viral reels, and sponsorship sales.
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

          <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
            Add Service Package
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

      {/* 2. Services Table */}
      <ServicesTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onToggleActive={handleToggleActive}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onSave={handleSaveItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
