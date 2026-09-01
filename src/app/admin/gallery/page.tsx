'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GalleryItem } from '@/types/media';
import { Event } from '@/types/events';
import {
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/services/adminMedia.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { GalleryGrid } from '@/components/admin/media/GalleryGrid';
import { GalleryItemModal } from '@/components/admin/media/GalleryItemModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Image as ImageIcon, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [galRes, evtRes] = await Promise.all([
        getAdminGallery(),
        getAdminEvents({ limit: 100 }),
      ]);
      setItems(galRes.items);
      setEventsList(evtRes.events);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load gallery items.' });
    } finally {
      setIsLoading(false);
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

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateGalleryItem(editingItem.id, data);
    } else {
      res = await createGalleryItem(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Gallery photo updated successfully.' : 'New photo added to gallery.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save gallery photo.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this photo from the gallery?')) return;
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Gallery photo removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete photo.' });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const res = await updateGalleryItem(id, { isPublished });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isPublished ? 'Photo published to live gallery.' : 'Photo hidden from public view.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to update visibility.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Photo Gallery CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Photos
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Upload high-resolution event photography, curate showcase albums, manage alt-text, and associate photos with expos.
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
            Upload Photo
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

      {/* 2. Visual Photo Gallery Grid */}
      <GalleryGrid
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onTogglePublish={handleTogglePublish}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <GalleryItemModal
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
