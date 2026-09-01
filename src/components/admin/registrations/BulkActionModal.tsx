'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { RegistrationStatus } from '@/types/events';
import { AlertTriangle, CheckCircle2, UserCheck, XCircle } from 'lucide-react';

interface BulkActionModalProps {
  isOpen: boolean;
  targetStatus: RegistrationStatus;
  selectedCount: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BulkActionModal({
  isOpen,
  targetStatus,
  selectedCount,
  onConfirm,
  onCancel,
  isLoading = false,
}: BulkActionModalProps) {
  if (!isOpen) return null;

  const getStatusDetails = () => {
    switch (targetStatus) {
      case 'confirmed':
        return {
          title: 'Confirm Delegate Passes',
          description: `You are about to approve and confirm ${selectedCount} selected delegate registrations.`,
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-400" />,
          btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
          actionText: `Confirm ${selectedCount} Passes`,
        };
      case 'attended':
        return {
          title: 'Mark Attendees as Attended',
          description: `You are about to mark ${selectedCount} registrations as checked-in / attended.`,
          icon: <UserCheck className="h-6 w-6 text-blue-400" />,
          btnClass: 'bg-blue-600 hover:bg-blue-500 text-white',
          actionText: `Mark ${selectedCount} Attended`,
        };
      case 'cancelled':
        return {
          title: 'Cancel Delegate Registrations',
          description: `Are you sure you want to cancel ${selectedCount} selected passes? Attendee records and reference codes will be preserved with a cancelled status.`,
          icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
          btnClass: 'bg-red-600 hover:bg-red-500 text-white',
          actionText: `Cancel ${selectedCount} Passes`,
        };
      default:
        return {
          title: 'Update Registrations',
          description: `You are about to update ${selectedCount} records.`,
          icon: <AlertTriangle className="h-6 w-6 text-brand-400" />,
          btnClass: 'bg-brand-500 text-dark-950',
          actionText: `Update ${selectedCount} Records`,
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="max-w-md w-full p-6 border-dark-800 bg-dark-950 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-900 border border-dark-800 shrink-0">
            {details.icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{details.title}</h3>
            <p className="text-xs text-dark-400">Bulk operational action</p>
          </div>
        </div>

        <p className="text-xs text-dark-300 leading-relaxed">
          {details.description}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={details.btnClass}
          >
            {details.actionText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
