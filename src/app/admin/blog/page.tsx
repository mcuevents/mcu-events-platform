'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost, BlogPostFormData } from '@/types/cms';
import {
  getAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishBlogPost,
} from '@/services/adminBlog.service';
import { BlogTable } from '@/components/admin/blog/BlogTable';
import { BlogPostModal } from '@/components/admin/blog/BlogPostModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getAdminBlogPosts();
      setItems(res.items);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load blog articles.' });
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

  const handleOpenEdit = (item: BlogPost) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateBlogPost(editingItem.id, data);
    } else {
      res = await createBlogPost(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Article updated successfully.' : 'New article published.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save article.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog article?')) return;
    const res = await deleteBlogPost(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Article removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete article.' });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const res = await togglePublishBlogPost(id, isPublished);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isPublished ? 'Article published to live website.' : 'Article reverted to draft mode.',
      });
      loadData();
    } else {
      setFeedback({ type: 'error', message: 'Failed to toggle publication state.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Blog Articles & Thought Leadership CMS
            </h1>
            <Badge variant="blue" size="sm">
              {items.length} Articles
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Publish event retrospectives, exhibitor growth guides, franchise reports, and digital marketing insights.
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
            Compose Article
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

      {/* 2. Blog Table */}
      <BlogTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onTogglePublish={handleTogglePublish}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <BlogPostModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onSave={handleSaveItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
