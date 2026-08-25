'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { EnquiryStats, EnquiryStatus } from '@/types/enquiries';
import { MessageSquare, Sparkles, PhoneCall, Clock, CheckCircle2, Archive } from 'lucide-react';

interface EnquiryStatsGridProps {
  stats: EnquiryStats;
  activeStatusFilter?: string;
  onStatusClick?: (status: EnquiryStatus | 'all') => void;
}

export function EnquiryStatsGrid({
  stats,
  activeStatusFilter = 'all',
  onStatusClick,
}: EnquiryStatsGridProps) {
  const cards: {
    key: EnquiryStatus | 'all';
    label: string;
    value: number;
    subtext: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
  }[] = [
    {
      key: 'all',
      label: 'Total Leads',
      value: stats.total,
      subtext: 'Inbound business enquiries',
      icon: <MessageSquare className="h-5 w-5 text-brand-400" />,
      color: 'text-brand-400',
      borderColor: activeStatusFilter === 'all' ? 'border-brand-500 bg-brand-500/5' : 'border-dark-800',
    },
    {
      key: 'new',
      label: 'New Leads',
      value: stats.new,
      subtext: 'Uncontacted submissions',
      icon: <Sparkles className="h-5 w-5 text-amber-400" />,
      color: 'text-amber-400',
      borderColor: activeStatusFilter === 'new' ? 'border-amber-500 bg-amber-500/5' : 'border-dark-800',
    },
    {
      key: 'contacted',
      label: 'Contacted',
      value: stats.contacted,
      subtext: 'Initial outreach made',
      icon: <PhoneCall className="h-5 w-5 text-blue-400" />,
      color: 'text-blue-400',
      borderColor: activeStatusFilter === 'contacted' ? 'border-blue-500 bg-blue-500/5' : 'border-dark-800',
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      value: stats.in_progress,
      subtext: 'Proposal under review',
      icon: <Clock className="h-5 w-5 text-purple-400" />,
      color: 'text-purple-400',
      borderColor: activeStatusFilter === 'in_progress' ? 'border-purple-500 bg-purple-500/5' : 'border-dark-800',
    },
    {
      key: 'resolved',
      label: 'Resolved / Won',
      value: stats.resolved,
      subtext: 'Converted clients & deals',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      color: 'text-emerald-400',
      borderColor: activeStatusFilter === 'resolved' ? 'border-emerald-500 bg-emerald-500/5' : 'border-dark-800',
    },
    {
      key: 'closed',
      label: 'Closed / Archived',
      value: stats.closed,
      subtext: 'Concluded enquiries',
      icon: <Archive className="h-5 w-5 text-gray-400" />,
      color: 'text-gray-400',
      borderColor: activeStatusFilter === 'closed' ? 'border-gray-500 bg-gray-500/5' : 'border-dark-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => (
        <Card
          key={c.key}
          onClick={() => onStatusClick && onStatusClick(c.key)}
          className={`p-3.5 bg-dark-900/60 border cursor-pointer transition-all duration-200 hover:border-brand-500/40 ${c.borderColor}`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
              {c.label}
            </span>
            <div className="p-1 rounded-lg bg-dark-950 border border-dark-800">
              {c.icon}
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-black ${c.color} tracking-tight`}>
            {c.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-dark-400 mt-0.5 truncate">
            {c.subtext}
          </div>
        </Card>
      ))}
    </div>
  );
}
