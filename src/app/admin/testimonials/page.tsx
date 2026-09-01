'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '@/types/cms';
import {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/services/adminContent.service';
import { TestimonialsTable } from '@/components/admin/content/TestimonialsTable';
import { TestimonialModal } from '@/components/admin/content/TestimonialModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { MessageSquareQuote, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getAdminTestimonials();
      setItems(res.items);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load client testimonials.' });
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

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<Testimonial, 'id'>) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateTestimonial(editingItem.id, data);
    } else {
      res = await createTestimonial(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Testimonial updated successfully.' : 'New client review added.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save testimonial.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this testimonial?')) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Testimonial removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete testimonial.' });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const res = await updateTestimonial(id, { isPublished });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isPublished ? 'Testimonial published to public site.' : 'Testimonial hidden from public view.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to update testimonial visibility.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Client Endorsements & Testimonials CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Reviews
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Manage verified client testimonials, company quotes, star ratings, and homepage endorsements.
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
            Add Testimonial
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

      {/* 2. Testimonials Table */}
      <TestimonialsTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onTogglePublish={handleTogglePublish}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onSave={handleSaveItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
