'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '@/types/cms';
import {
  getAdminTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '@/services/adminContent.service';
import { TeamTable } from '@/components/admin/content/TeamTable';
import { TeamMemberModal } from '@/components/admin/content/TeamMemberModal';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Users, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getAdminTeam();
      setItems(res.items);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load team members.' });
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

  const handleOpenEdit = (item: TeamMember) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<TeamMember, 'id'>) => {
    setIsSubmitting(true);
    let res;

    if (editingItem) {
      res = await updateTeamMember(editingItem.id, data);
    } else {
      res = await createTeamMember(data);
    }

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFeedback({
        type: 'success',
        message: editingItem ? 'Profile updated successfully.' : 'New team member added.',
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save profile.',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    const res = await deleteTeamMember(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Team member removed.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete team member.' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const res = await updateTeamMember(id, { isActive });
    if (res.success) {
      setFeedback({
        type: 'success',
        message: isActive ? 'Profile published to public About page.' : 'Profile hidden from public view.',
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
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Executive Leadership & Team CMS
            </h1>
            <Badge variant="gold" size="sm">
              {items.length} Members
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Manage executive bios, leadership roles, headshot photography, and contact channels for the public About page.
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
            Add Team Member
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

      {/* 2. Team Table */}
      <TeamTable
        items={items}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onToggleActive={handleToggleActive}
        isActionLoading={isRefreshing}
      />

      {/* 3. Create / Edit Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onSave={handleSaveItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
