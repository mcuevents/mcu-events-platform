'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Enquiry, EnquiryStatus } from '@/types/enquiries';
import { updateEnquiryStatus, updateEnquiryNotes } from '@/services/adminEnquiries.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  CheckCircle2,
  PhoneCall,
  Clock,
  Archive,
  Save,
  ShieldCheck,
  FileText,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface EnquiryDetailViewProps {
  enquiry: Enquiry;
  onRefresh?: () => void;
}

export function EnquiryDetailView({
  enquiry,
  onRefresh,
}: EnquiryDetailViewProps) {
  const [currentEnq, setCurrentEnq] = useState<Enquiry>(enquiry);
  const [adminNotes, setAdminNotes] = useState<string>(enquiry.adminNotes || enquiry.notes || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    setIsUpdatingStatus(true);
    setFeedback(null);

    const res = await updateEnquiryStatus(currentEnq.id, newStatus);
    setIsUpdatingStatus(false);

    if (res.success) {
      setCurrentEnq((prev) => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
      setFeedback({
        type: 'success',
        message: `Lead status updated to "${newStatus.toUpperCase().replace('_', ' ')}" successfully.`,
      });
      if (onRefresh) onRefresh();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to update status.',
      });
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setFeedback(null);

    const res = await updateEnquiryNotes(currentEnq.id, adminNotes);
    setIsSavingNotes(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'Internal admin notes saved securely.',
      });
      if (onRefresh) onRefresh();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to save internal notes.',
      });
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="gold" size="md">New Inbound Lead</Badge>;
      case 'contacted':
        return <Badge variant="blue" size="md">Contacted</Badge>;
      case 'in_progress':
        return <Badge variant="amber" size="md">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="green" size="md">Resolved / Won</Badge>;
      case 'closed':
      case 'archived':
        return <Badge variant="gray" size="md">Closed / Concluded</Badge>;
      default:
        return <Badge variant="gray" size="md">{status}</Badge>;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Transition Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/enquiries">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="Back to Enquiries">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentEnq.fullName}
              </h1>
              {getStatusBadge(currentEnq.status)}
            </div>
            <p className="text-xs text-dark-400 mt-0.5">
              Subject: <strong className="text-white">{currentEnq.subject}</strong>
            </p>
          </div>
        </div>

        {/* Quick Transition Action Bar */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {currentEnq.status === 'new' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('contacted')}
              isLoading={isUpdatingStatus}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              leftIcon={<PhoneCall className="h-4 w-4" />}
            >
              Mark Contacted
            </Button>
          )}

          {(currentEnq.status === 'new' || currentEnq.status === 'contacted') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('in_progress')}
              isLoading={isUpdatingStatus}
              leftIcon={<Clock className="h-4 w-4" />}
            >
              Set In Progress
            </Button>
          )}

          {currentEnq.status !== 'resolved' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('resolved')}
              isLoading={isUpdatingStatus}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Mark Resolved / Won
            </Button>
          )}

          {currentEnq.status !== 'closed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange('closed')}
              isLoading={isUpdatingStatus}
              className="text-dark-400 hover:text-white"
              leftIcon={<Archive className="h-4 w-4" />}
            >
              Close Lead
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Contact Profile Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">Contact & Company Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Contact Person</span>
                <p className="text-sm font-bold text-white">{currentEnq.fullName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Email Address</span>
                <p>
                  <a
                    href={`mailto:${currentEnq.email}`}
                    className="text-brand-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{currentEnq.email}</span>
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Phone Number / WhatsApp</span>
                <p>
                  <a
                    href={`tel:${currentEnq.phone}`}
                    className="text-white hover:text-brand-400 flex items-center gap-1 font-mono font-medium"
                  >
                    <Phone className="h-3.5 w-3.5 text-dark-400" />
                    <span>{currentEnq.phone}</span>
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Company / Brand</span>
                <p className="text-white font-medium flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-dark-400" />
                  <span>{currentEnq.companyName || 'Individual / Unspecified'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Designation</span>
                <p className="text-white font-medium">
                  {currentEnq.designation || 'General Enquirer'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Funnel Category</span>
                <div>
                  <Badge variant="blue" size="sm">
                    {currentEnq.type.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Enquiry Message Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">Client Inquiry Message</h2>
            </div>

            <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 text-xs sm:text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">
              {currentEnq.message}
            </div>

            {/* Custom Metadata Parameters */}
            {currentEnq.metadata && Object.keys(currentEnq.metadata).length > 0 && (
              <div className="pt-3 border-t border-dark-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400 block">
                  Custom Inbound Requirements
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {currentEnq.metadata.stallPreference && (
                    <div className="p-2.5 rounded-lg bg-dark-950 border border-dark-800">
                      <span className="text-dark-400 text-[10px] block">Stall Preference</span>
                      <strong className="text-white">{currentEnq.metadata.stallPreference}</strong>
                    </div>
                  )}
                  {currentEnq.metadata.tierPreference && (
                    <div className="p-2.5 rounded-lg bg-dark-950 border border-dark-800">
                      <span className="text-dark-400 text-[10px] block">Sponsorship Tier</span>
                      <strong className="text-white">{currentEnq.metadata.tierPreference}</strong>
                    </div>
                  )}
                  {currentEnq.metadata.monthlyAdSpend && (
                    <div className="p-2.5 rounded-lg bg-dark-950 border border-dark-800">
                      <span className="text-dark-400 text-[10px] block">Monthly Ad Budget</span>
                      <strong className="text-emerald-400">{currentEnq.metadata.monthlyAdSpend}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Private Internal Admin Notes Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">Private Internal Admin Notes</h2>
                  <p className="text-[10px] text-dark-400">Restricted to administrators; never exposed publicly</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveNotes}
                isLoading={isSavingNotes}
                leftIcon={<Save className="h-3.5 w-3.5" />}
              >
                Save Notes
              </Button>
            </div>

            <Textarea
              placeholder="Record follow-up conversation notes, quote amounts discussed, next meeting date, and team assignment..."
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </Card>
        </div>

        {/* Right Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Changer Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Lead Workflow Status</h2>
            </div>

            <div className="space-y-3">
              <Select
                label="Current Funnel State"
                value={currentEnq.status}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                disabled={isUpdatingStatus}
                options={[
                  { label: 'New Lead', value: 'new' },
                  { label: 'Contacted', value: 'contacted' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Resolved / Won', value: 'resolved' },
                  { label: 'Closed / Concluded', value: 'closed' },
                ]}
              />

              <p className="text-[11px] text-dark-400">
                Transitioning lead status tracks conversion through the business pipeline without removing historical records.
              </p>
            </div>
          </Card>

          {/* Association & Timeline Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <Calendar className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Event Link & Timestamps</h2>
            </div>

            <div className="space-y-3 text-xs">
              {currentEnq.eventId ? (
                <div className="space-y-1 pb-2 border-b border-dark-800/60">
                  <span className="text-dark-400 text-[10px] uppercase font-semibold">Associated Event</span>
                  <p>
                    <Link
                      href={`/admin/events/${currentEnq.eventId}/edit`}
                      className="font-bold text-brand-400 hover:underline"
                    >
                      {currentEnq.eventName || 'Manage Event'} →
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="pb-2 border-b border-dark-800/60">
                  <span className="text-dark-400 text-[10px] uppercase font-semibold">Inquiry Channel</span>
                  <p className="font-semibold text-white">General Business Services</p>
                </div>
              )}

              <div className="flex justify-between items-center py-1 border-b border-dark-800/60">
                <span className="text-dark-400">Submitted On (IST)</span>
                <span className="text-white font-medium">{formatDateTime(currentEnq.createdAt)}</span>
              </div>

              {currentEnq.updatedAt && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-dark-400">Last Status Update</span>
                  <span className="text-white font-medium">{formatDateTime(currentEnq.updatedAt)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
