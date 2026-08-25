'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VideoItem } from '@/types/media';
import { Event } from '@/types/events';
import {
  getAdminVideos,
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
} from '@/services/adminMedia.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { VideoTable } from '@/components/admin/media/VideoTable';
import { VideoItemModal } from '@/components/admin/media/VideoItemModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Video as VideoIcon, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminVideosPage() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [vidRes, evtRes] = await Promise.all([
        getAdminVideos(),
        getAdminEvents({ limit: 100 }),
      ]);
      setItems(vidRes.items);
      setEventsList(evtRes.events);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load video items.' });
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

  const handleOpenEdit = (item: VideoItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateVideoItem(editingItem.id, data);
    } else {
      res = await createVideoItem(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Video entry updated successfully.' : 'New video added to showcase.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save video entry.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this video from the showcase?')) return;
    const res = await deleteVideoItem(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Video entry removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete video.' });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const res = await updateVideoItem(id, { isPublished });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isPublished ? 'Video published to live media gallery.' : 'Video hidden from public view.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to update video visibility.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <VideoIcon className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Video Showcase CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Videos
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Curate YouTube & Vimeo aftermovies, keynote addresses, exhibitor video interviews, and brand showreels.
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
            Add Video
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

      {/* 2. Video Table */}
      <VideoTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onTogglePublish={handleTogglePublish}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Video Modal */}
      <VideoItemModal
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
