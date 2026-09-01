'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CRMLead, CRMLeadDetail, CRMStats, AdminLeadFilters, CreateLeadFormData, LeadStatus, ConversionType } from '@/types/crm';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addLeadNote,
  createFollowUp,
  completeFollowUp,
  convertLead,
  getCRMStats,
  exportLeadsCSV,
} from '@/services/crm.service';
import { CRMPipelineStats } from '@/components/admin/crm/CRMPipelineStats';
import { CRMLeadsTable } from '@/components/admin/crm/CRMLeadsTable';
import { CreateLeadModal } from '@/components/admin/crm/CreateLeadModal';
import { LeadDetailDrawer } from '@/components/admin/crm/LeadDetailDrawer';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { UserCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminCRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    converted: 0,
    lost: 0,
    upcomingFollowups: 0,
    conversionRate: 0,
  });

  const [filters, setFilters] = useState<AdminLeadFilters>({
    status: 'all',
    leadType: 'all',
    leadSource: 'all',
    searchQuery: '',
  });

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<CRMLeadDetail | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsList, crmStats] = await Promise.all([getLeads(filters), getCRMStats()]);
      setLeads(leadsList);
      setStats(crmStats);

      if (selectedLeadId) {
        const detail = await getLeadById(selectedLeadId);
        setSelectedLeadDetail(detail);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load CRM leads.' });
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedLeadId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectLead = async (id: string) => {
    setSelectedLeadId(id);
    const detail = await getLeadById(id);
    setSelectedLeadDetail(detail);
  };

  const handleCreateLead = async (data: CreateLeadFormData) => {
    await createLead(data);
    setFeedback({ type: 'success', message: 'Lead added to pipeline successfully.' });
    loadData();
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!selectedLeadId) return;
    await updateLead(selectedLeadId, { status: newStatus });
    setFeedback({ type: 'success', message: `Lead stage updated to ${newStatus.toUpperCase()}` });
    loadData();
  };

  const handleAddNote = async (content: string) => {
    if (!selectedLeadId) return;
    await addLeadNote(selectedLeadId, 'Admin (Ragul)', content);
    setFeedback({ type: 'success', message: 'Confidential note logged.' });
    loadData();
  };

  const handleCreateFollowUp = async (data: { followupDate: string; followupTime?: string; note: string }) => {
    if (!selectedLeadId) return;
    await createFollowUp(selectedLeadId, data, 'Admin (Ragul)');
    setFeedback({ type: 'success', message: 'Follow-up task scheduled.' });
    loadData();
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    if (!selectedLeadId) return;
    await completeFollowUp(followUpId, selectedLeadId, 'Admin (Ragul)');
    setFeedback({ type: 'success', message: 'Follow-up marked as completed.' });
    loadData();
  };

  const handleConvertLead = async (conversionType: ConversionType) => {
    if (!selectedLeadId) return;
    await convertLead(selectedLeadId, conversionType, 'Admin (Ragul)');
    setFeedback({ type: 'success', message: 'Lead successfully marked as Converted!' });
    loadData();
  };

  const handleExportCSV = async () => {
    const csvContent = await exportLeadsCSV(filters);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mcu-crm-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: 'CRM leads CSV exported.' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              CRM & Lead Pipeline Management
            </h1>
            <Badge variant="gold" size="sm">
              Phase 8
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Track inbound exhibitor leads, sponsor prospects, digital marketing clients, follow-ups, and conversion milestones.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Leads
        </Button>
      </div>

      {/* Global Feedback Banner */}
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
          <button type="button" onClick={() => setFeedback(null)} className="text-dark-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 2. Pipeline Summary KPI Bar */}
      <CRMPipelineStats
        stats={stats}
        activeFilterStatus={filters.status}
        onSelectStatus={(statusKey) => setFilters({ ...filters, status: statusKey as any })}
      />

      {/* 3. Filterable Leads Table */}
      <CRMLeadsTable
        leads={leads}
        filters={filters}
        onFilterChange={(newFilters) => setFilters(newFilters)}
        onSelectLead={handleSelectLead}
        onExportCSV={handleExportCSV}
        onCreateLead={() => setIsCreateModalOpen(true)}
      />

      {/* 4. Create Lead Modal */}
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      {/* 5. Slide-Over Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLeadDetail}
        isOpen={!!selectedLeadId}
        onClose={() => {
          setSelectedLeadId(null);
          setSelectedLeadDetail(null);
        }}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        onCreateFollowUp={handleCreateFollowUp}
        onCompleteFollowUp={handleCompleteFollowUp}
        onConvertLead={handleConvertLead}
      />
    </div>
  );
}
