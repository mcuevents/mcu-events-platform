'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Enquiry } from '@/types/enquiries';
import { Mail, ArrowRight, MessageSquare, Sparkles, Building2 } from 'lucide-react';

interface RecentEnquiriesWidgetProps {
  enquiries: Enquiry[];
}

export function RecentEnquiriesWidget({ enquiries }: RecentEnquiriesWidgetProps) {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'exhibitor':
        return 'gold';
      case 'sponsor':
        return 'amber';
      case 'partnership':
        return 'purple';
      case 'digital_marketing':
        return 'teal';
      case 'event':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <Badge variant="green" size="sm">Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="blue" size="sm">In Progress</Badge>;
      case 'contacted':
        return <Badge variant="amber" size="sm">Contacted</Badge>;
      case 'new':
      default:
        return <Badge variant="gold" size="sm">New Lead</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Recent Business Enquiries
            </h2>
            <span className="text-[11px] text-dark-400">Exhibitor, sponsor & marketing leads</span>
          </div>
        </div>

        <Link href="/admin/enquiries">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Lead Inbox
          </Button>
        </Link>
      </div>

      {/* Table / List */}
      <div className="flex-1">
        {enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">No inbound enquiries yet</p>
            <p className="text-xs text-dark-400 max-w-xs">
              When prospective exhibitors and sponsors submit enquiries, they will appear in this feed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800/80 text-[10px] font-bold uppercase tracking-wider text-dark-400">
                  <th className="pb-2.5 font-semibold">Contact / Company</th>
                  <th className="pb-2.5 font-semibold">Category</th>
                  <th className="pb-2.5 font-semibold hidden md:table-cell">Subject / Focus</th>
                  <th className="pb-2.5 font-semibold text-right sm:text-left">Date</th>
                  <th className="pb-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/40">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-dark-950/40 transition-colors group">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-white group-hover:text-brand-400 transition-colors truncate max-w-[140px] sm:max-w-none">
                        {enq.fullName}
                      </div>
                      <div className="text-[10px] text-dark-400 truncate max-w-[140px] sm:max-w-none">
                        {enq.companyName || enq.phone}
                      </div>
                    </td>

                    <td className="py-3 px-2">
                      <Badge variant={enq.type === 'exhibitor' ? 'gold' : enq.type === 'sponsor' ? 'amber' : 'blue'} size="sm">
                        {enq.type ? enq.type.replace('_', ' ') : 'General'}
                      </Badge>
                    </td>

                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="text-dark-200 truncate max-w-[180px]">
                        {enq.subject}
                      </div>
                      <div className="text-[10px] text-dark-400 truncate max-w-[180px]">
                        {enq.eventName || enq.serviceName || 'Direct Portal Enquiry'}
                      </div>
                    </td>

                    <td className="py-3 px-2 text-right sm:text-left text-dark-400 whitespace-nowrap">
                      {formatDate(enq.createdAt)}
                    </td>

                    <td className="py-3 pl-2 text-right">
                      {getStatusBadge(enq.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
