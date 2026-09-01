'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EventRegistration, RegistrationStatus } from '@/types/events';
import { updateRegistrationStatus } from '@/services/adminRegistrations.service';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select } from '@/components/ui';
import {
  ArrowLeft,
  Ticket,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface RegistrationDetailViewProps {
  registration: EventRegistration;
  onRefresh?: () => void;
}

export function RegistrationDetailView({
  registration,
  onRefresh,
}: RegistrationDetailViewProps) {
  const router = useRouter();
  const [currentReg, setCurrentReg] = useState<EventRegistration>(registration);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleStatusChange = async (newStatus: RegistrationStatus) => {
    setIsUpdating(true);
    setFeedback(null);

    const res = await updateRegistrationStatus(currentReg.id, newStatus);
    setIsUpdating(false);

    if (res.success) {
      setCurrentReg((prev) => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
      setFeedback({
        type: 'success',
        message: `Pass status updated to "${newStatus.toUpperCase()}" successfully.`,
      });
      if (onRefresh) onRefresh();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to update pass status.',
      });
    }
  };

  const handleCopyRef = () => {
    if (currentReg.referenceCode) {
      navigator.clipboard.writeText(currentReg.referenceCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="green" size="md">Confirmed Pass</Badge>;
      case 'pending':
        return <Badge variant="amber" size="md">Pending Review</Badge>;
      case 'attended':
        return <Badge variant="blue" size="md">Checked In / Attended</Badge>;
      case 'cancelled':
        return <Badge variant="red" size="md">Cancelled</Badge>;
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
      {/* 1. Header & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/registrations">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="Back to Registrations">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentReg.fullName}
              </h1>
              {getStatusBadge(currentReg.status)}
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-400 font-mono mt-0.5">
              <span>Pass Ref: {currentReg.referenceCode || currentReg.id}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-brand-400 hover:text-brand-300"
                title="Copy reference code"
              >
                {copiedRef ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Transition Action Bar */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {currentReg.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('confirmed')}
              isLoading={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Confirm Pass
            </Button>
          )}

          {currentReg.status === 'confirmed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('attended')}
              isLoading={isUpdating}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              leftIcon={<UserCheck className="h-4 w-4" />}
            >
              Mark as Attended
            </Button>
          )}

          {currentReg.status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('cancelled')}
              isLoading={isUpdating}
              className="text-red-400 border-red-500/30 hover:bg-red-950/20"
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Cancel Pass
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
          {/* Delegate Contact Profile Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">Delegate Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Full Name</span>
                <p className="text-sm font-bold text-white">{currentReg.fullName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Email Address</span>
                <p>
                  <a
                    href={`mailto:${currentReg.email}`}
                    className="text-brand-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{currentReg.email}</span>
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Phone Number / WhatsApp</span>
                <p>
                  <a
                    href={`tel:${currentReg.phone}`}
                    className="text-white hover:text-brand-400 flex items-center gap-1 font-mono font-medium"
                  >
                    <Phone className="h-3.5 w-3.5 text-dark-400" />
                    <span>{currentReg.phone}</span>
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Attendee Category</span>
                <div>
                  <Badge variant="blue" size="sm">
                    {(currentReg.registrationType || 'visitor').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Company / Organization</span>
                <p className="text-white font-medium flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-dark-400" />
                  <span>{currentReg.companyName || 'Individual / Retail Visitor'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Designation / Job Title</span>
                <p className="text-white font-medium">
                  {currentReg.designation || 'Visitor'}
                </p>
              </div>
            </div>

            {currentReg.notes && (
              <div className="pt-3 border-t border-dark-800/80 space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Attendee Notes</span>
                <p className="text-dark-300 text-xs bg-dark-950 p-3 rounded-xl border border-dark-800">
                  {currentReg.notes}
                </p>
              </div>
            )}
          </Card>

          {/* Event Association Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">Event Association</h2>
              </div>

              <Link
                href={`/events/${currentReg.eventSlug || ''}`}
                target="_blank"
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
              >
                <span>View Public Event</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Event Title</span>
                <p>
                  <Link
                    href={`/admin/events/${currentReg.eventId}/edit`}
                    className="text-sm font-bold text-white hover:text-brand-400 transition-colors"
                  >
                    {currentReg.eventTitle || 'MCU Business Expo'}
                  </Link>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 uppercase font-semibold text-[10px]">Venue Location</span>
                <p className="text-white font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-dark-400" />
                  <span>{currentReg.eventVenue || 'Trade Fair Grounds'}</span>
                </p>
              </div>
            </div>
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
              <h2 className="text-sm font-bold text-white">Manage Pass Status</h2>
            </div>

            <div className="space-y-3">
              <Select
                label="Current Operational Status"
                value={currentReg.status}
                onChange={(e) => handleStatusChange(e.target.value as RegistrationStatus)}
                disabled={isUpdating}
                options={[
                  { label: 'Pending Review', value: 'pending' },
                  { label: 'Confirmed Pass', value: 'confirmed' },
                  { label: 'Checked In / Attended', value: 'attended' },
                  { label: 'Cancelled Pass', value: 'cancelled' },
                ]}
              />

              <p className="text-[11px] text-dark-400">
                Changing status to <strong>Confirmed</strong> marks badges ready for issuance. <strong>Cancelled</strong> preserves attendee history safely without permanent deletion.
              </p>
            </div>
          </Card>

          {/* Pass & Billing Details Card */}
          <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <Ticket className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Pass & Manifest Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-dark-800/60">
                <span className="text-dark-400">Pass Quantity</span>
                <span className="font-bold text-white">{currentReg.attendeesCount} Delegate Pass{currentReg.attendeesCount > 1 ? 'es' : ''}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-dark-800/60">
                <span className="text-dark-400">Amount Charged</span>
                <span className="font-bold text-emerald-400">
                  {currentReg.totalPrice === 0 ? 'Complimentary (Free)' : `₹${currentReg.totalPrice.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-dark-800/60">
                <span className="text-dark-400">Registered On (IST)</span>
                <span className="text-white font-medium">{formatDateTime(currentReg.createdAt)}</span>
              </div>

              {currentReg.updatedAt && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-dark-400">Last Status Update</span>
                  <span className="text-white font-medium">{formatDateTime(currentReg.updatedAt)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
