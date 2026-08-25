'use client';

import React from 'react';
import Link from 'next/link';
import { Enquiry, EnquiryStatus } from '@/types/enquiries';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MessageSquare,
  Mail,
  Phone,
  Building,
  Eye,
  CheckCircle2,
  PhoneCall,
  Clock,
  Archive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface EnquiryTableProps {
  enquiries: Enquiry[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onStatusChange: (id: string, newStatus: EnquiryStatus) => Promise<void>;
  isActionLoading?: boolean;
}

export function EnquiryTable({
  enquiries,
  total,
  page,
  totalPages,
  onPageChange,
  onStatusChange,
  isActionLoading = false,
}: EnquiryTableProps) {
  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="gold" size="sm">New Lead</Badge>;
      case 'contacted':
        return <Badge variant="blue" size="sm">Contacted</Badge>;
      case 'in_progress':
        return <Badge variant="amber" size="sm">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="green" size="sm">Resolved / Won</Badge>;
      case 'closed':
      case 'archived':
        return <Badge variant="gray" size="sm">Closed</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'exhibitor':
        return <Badge variant="blue" size="sm">Exhibitor</Badge>;
      case 'sponsor':
        return <Badge variant="gold" size="sm">Sponsor</Badge>;
      case 'partnership':
        return <Badge variant="amber" size="sm">Partnership</Badge>;
      case 'digital_marketing':
        return <Badge variant="green" size="sm">Marketing</Badge>;
      case 'event':
        return <Badge variant="gold" size="sm">Event</Badge>;
      default:
        return <Badge variant="gray" size="sm">General</Badge>;
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 px-4 font-semibold">Contact & Company</th>
              <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Contact Channel</th>
              <th className="py-3.5 px-3 font-semibold">Funnel Type</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Associated Event</th>
              <th className="py-3.5 px-3 font-semibold hidden lg:table-cell">Subject Line</th>
              <th className="py-3.5 px-3 font-semibold">Status</th>
              <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Received</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No enquiries found</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      No inbound leads match your current search criteria or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              enquiries.map((enq) => (
                <tr
                  key={enq.id}
                  className="hover:bg-dark-950/40 transition-colors group"
                >
                  {/* Contact & Company */}
                  <td className="py-3.5 px-4">
                    <div className="min-w-0 max-w-xs">
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate"
                      >
                        {enq.fullName}
                      </Link>
                      <span className="text-[10px] text-dark-400 truncate block">
                        {enq.companyName ? `${enq.companyName} (${enq.designation || 'Lead'})` : (enq.designation || 'Individual')}
                      </span>
                    </div>
                  </td>

                  {/* Contact Channel */}
                  <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap">
                    <div className="space-y-0.5">
                      <a
                        href={`mailto:${enq.email}`}
                        className="text-dark-300 hover:text-brand-400 transition-colors flex items-center gap-1 truncate max-w-[170px]"
                      >
                        <Mail className="h-3 w-3 text-dark-500 shrink-0" />
                        <span className="truncate">{enq.email}</span>
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="text-dark-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Phone className="h-3 w-3 text-dark-500 shrink-0" />
                        <span>{enq.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Funnel Type */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getTypeBadge(enq.type)}
                  </td>

                  {/* Associated Event */}
                  <td className="py-3.5 px-3 hidden md:table-cell">
                    <div className="min-w-0 max-w-[160px]">
                      {enq.eventId ? (
                        <Link
                          href={`/admin/events/${enq.eventId}/edit`}
                          className="text-dark-200 hover:text-white font-medium truncate block"
                          title="Manage Event"
                        >
                          {enq.eventName || 'MCU Expo'}
                        </Link>
                      ) : (
                        <span className="text-dark-500 text-[11px]">General Service</span>
                      )}
                    </div>
                  </td>

                  {/* Subject Line */}
                  <td className="py-3.5 px-3 hidden lg:table-cell">
                    <p className="text-dark-300 truncate max-w-[200px]" title={enq.subject}>
                      {enq.subject}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(enq.status)}
                  </td>

                  {/* Received Date */}
                  <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap text-dark-400 text-[11px]">
                    {formatDate(enq.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Mark Contacted */}
                      {enq.status === 'new' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                          onClick={() => onStatusChange(enq.id, 'contacted')}
                          title="Mark Contacted"
                          disabled={isActionLoading}
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {/* Mark Resolved */}
                      {(enq.status === 'new' || enq.status === 'contacted' || enq.status === 'in_progress') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                          onClick={() => onStatusChange(enq.id, 'resolved')}
                          title="Mark Resolved"
                          disabled={isActionLoading}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {/* View Detail */}
                      <Link href={`/admin/enquiries/${enq.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="View Enquiry Details">
                          <Eye className="h-3.5 w-3.5 text-brand-400" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="p-4 border-t border-dark-800 bg-dark-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-400">
          <div>
            Showing <strong className="text-white">{enquiries.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total leads
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
