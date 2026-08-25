'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventRegistration, RegistrationStatus } from '@/types/events';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Ticket,
  Mail,
  Phone,
  Building,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Square,
  Copy,
} from 'lucide-react';

interface RegistrationTableProps {
  registrations: EventRegistration[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onStatusChange: (id: string, newStatus: RegistrationStatus) => Promise<void>;
  onBulkAction: (status: RegistrationStatus, ids: string[]) => void;
  isActionLoading?: boolean;
}

export function RegistrationTable({
  registrations,
  total,
  page,
  totalPages,
  onPageChange,
  onStatusChange,
  onBulkAction,
  isActionLoading = false,
}: RegistrationTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected =
    registrations.length > 0 &&
    registrations.every((r) => selectedIds.includes(r.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(registrations.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="green" size="sm">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="amber" size="sm">Pending</Badge>;
      case 'attended':
        return <Badge variant="blue" size="sm">Attended</Badge>;
      case 'cancelled':
        return <Badge variant="red" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'exhibitor':
        return <Badge variant="blue" size="sm">Exhibitor</Badge>;
      case 'sponsor':
        return <Badge variant="gold" size="sm">Sponsor</Badge>;
      case 'business_enquiry':
        return <Badge variant="blue" size="sm">Business</Badge>;
      case 'other':
        return <Badge variant="gray" size="sm">VIP</Badge>;
      default:
        return <Badge variant="gray" size="sm">Visitor</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-brand-500/10 border-b border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <CheckSquare className="h-4 w-4 text-brand-400" />
            <span>{selectedIds.length} delegate{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('confirmed', selectedIds)}
              className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Confirm Selected
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('attended', selectedIds)}
              className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
              leftIcon={<UserCheck className="h-3.5 w-3.5" />}
            >
              Mark Attended
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('cancelled', selectedIds)}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              leftIcon={<XCircle className="h-3.5 w-3.5" />}
            >
              Cancel Passes
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-dark-400 hover:text-white"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-dark-400 hover:text-white"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-brand-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3.5 px-3 font-semibold">Delegate & Reference</th>
              <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Contact</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Event / Expo</th>
              <th className="py-3.5 px-3 font-semibold hidden lg:table-cell">Pass Type</th>
              <th className="py-3.5 px-3 font-semibold hidden xl:table-cell">Company / Org</th>
              <th className="py-3.5 px-3 font-semibold">Status</th>
              <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Registered</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No registrations found</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      No delegate registrations match your current search terms, event filter, or status selection.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              registrations.map((reg) => {
                const isSelected = selectedIds.includes(reg.id);

                return (
                  <tr
                    key={reg.id}
                    className={`hover:bg-dark-950/40 transition-colors group ${
                      isSelected ? 'bg-brand-500/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4 pr-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectRow(reg.id)}
                        className="text-dark-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-brand-400" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Delegate & Ref Code */}
                    <td className="py-3.5 px-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/registrations/${reg.id}`}
                          className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate"
                        >
                          {reg.fullName}
                        </Link>
                        <div className="flex items-center gap-1 text-[10px] text-dark-400 font-mono">
                          <span>{reg.referenceCode || reg.id.substring(0, 8)}</span>
                          {reg.attendeesCount > 1 && (
                            <span className="text-brand-400 font-semibold">
                              ({reg.attendeesCount} passes)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap">
                      <div className="space-y-0.5">
                        <a
                          href={`mailto:${reg.email}`}
                          className="text-dark-300 hover:text-brand-400 transition-colors flex items-center gap-1 truncate max-w-[170px]"
                        >
                          <Mail className="h-3 w-3 text-dark-500 shrink-0" />
                          <span className="truncate">{reg.email}</span>
                        </a>
                        <a
                          href={`tel:${reg.phone}`}
                          className="text-dark-400 hover:text-white transition-colors flex items-center gap-1 truncate font-mono text-[11px]"
                        >
                          <Phone className="h-3 w-3 text-dark-500 shrink-0" />
                          <span>{reg.phone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Event / Expo */}
                    <td className="py-3.5 px-3 hidden md:table-cell">
                      <div className="min-w-0 max-w-[180px]">
                        <Link
                          href={`/admin/events/${reg.eventId}/edit`}
                          className="text-dark-200 hover:text-white font-medium truncate block"
                          title="Manage Event"
                        >
                          {reg.eventTitle || 'MCU Expo'}
                        </Link>
                        <span className="text-[10px] text-dark-500 truncate block">
                          {reg.eventVenue || 'Fair Complex'}
                        </span>
                      </div>
                    </td>

                    {/* Pass Type */}
                    <td className="py-3.5 px-3 hidden lg:table-cell whitespace-nowrap">
                      {getTypeBadge(reg.registrationType)}
                    </td>

                    {/* Company / Org */}
                    <td className="py-3.5 px-3 hidden xl:table-cell">
                      <div className="min-w-0 max-w-[150px]">
                        <span className="text-dark-200 font-medium truncate block">
                          {reg.companyName || 'Individual'}
                        </span>
                        <span className="text-[10px] text-dark-400 truncate block">
                          {reg.designation || 'Visitor'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(reg.status)}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap text-dark-400 text-[11px]">
                      {formatDate(reg.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick Confirm */}
                        {reg.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                            onClick={() => onStatusChange(reg.id, 'confirmed')}
                            title="Confirm Pass"
                            disabled={isActionLoading}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* Quick Mark Attended */}
                        {reg.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                            onClick={() => onStatusChange(reg.id, 'attended')}
                            title="Mark Attended"
                            disabled={isActionLoading}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* Quick Cancel */}
                        {reg.status !== 'cancelled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            onClick={() => onStatusChange(reg.id, 'cancelled')}
                            title="Cancel Pass"
                            disabled={isActionLoading}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* View Full Detail */}
                        <Link href={`/admin/registrations/${reg.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="View Detail">
                            <Eye className="h-3.5 w-3.5 text-brand-400" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="p-4 border-t border-dark-800 bg-dark-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-400">
          <div>
            Showing <strong className="text-white">{registrations.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total registrations
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>

            <span className="px-2 font-mono font-bold text-white">
              Page {page} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
