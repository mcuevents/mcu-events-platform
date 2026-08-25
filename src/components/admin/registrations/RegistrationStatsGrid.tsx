'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { RegistrationStats, RegistrationStatus } from '@/types/events';
import { Ticket, Clock, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface RegistrationStatsGridProps {
  stats: RegistrationStats;
  activeStatusFilter?: string;
  onStatusClick?: (status: RegistrationStatus | 'all') => void;
}

export function RegistrationStatsGrid({
  stats,
  activeStatusFilter = 'all',
  onStatusClick,
}: RegistrationStatsGridProps) {
  const cards: {
    key: RegistrationStatus | 'all';
    label: string;
    value: number;
    subtext: string;
    icon: React.ReactNode;
    color: string;
    bgHover: string;
    borderColor: string;
  }[] = [
    {
      key: 'all',
      label: 'Total Passes',
      value: stats.total,
      subtext: 'All registered delegates',
      icon: <Ticket className="h-5 w-5 text-brand-400" />,
      color: 'text-brand-400',
      bgHover: 'hover:border-brand-500/50',
      borderColor: activeStatusFilter === 'all' ? 'border-brand-500 bg-brand-500/5' : 'border-dark-800',
    },
    {
      key: 'pending',
      label: 'Pending Review',
      value: stats.pending,
      subtext: 'Awaiting pass confirmation',
      icon: <Clock className="h-5 w-5 text-amber-400" />,
      color: 'text-amber-400',
      bgHover: 'hover:border-amber-500/50',
      borderColor: activeStatusFilter === 'pending' ? 'border-amber-500 bg-amber-500/5' : 'border-dark-800',
    },
    {
      key: 'confirmed',
      label: 'Confirmed Passes',
      value: stats.confirmed,
      subtext: 'Badges issued to delegates',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      color: 'text-emerald-400',
      bgHover: 'hover:border-emerald-500/50',
      borderColor: activeStatusFilter === 'confirmed' ? 'border-emerald-500 bg-emerald-500/5' : 'border-dark-800',
    },
    {
      key: 'attended',
      label: 'Checked In / Attended',
      value: stats.attended,
      subtext: 'Turnstile check-ins verified',
      icon: <UserCheck className="h-5 w-5 text-blue-400" />,
      color: 'text-blue-400',
      bgHover: 'hover:border-blue-500/50',
      borderColor: activeStatusFilter === 'attended' ? 'border-blue-500 bg-blue-500/5' : 'border-dark-800',
    },
    {
      key: 'cancelled',
      label: 'Cancelled Passes',
      value: stats.cancelled,
      subtext: 'Voided registrations',
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      color: 'text-red-400',
      bgHover: 'hover:border-red-500/50',
      borderColor: activeStatusFilter === 'cancelled' ? 'border-red-500 bg-red-500/5' : 'border-dark-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <Card
          key={c.key}
          onClick={() => onStatusClick && onStatusClick(c.key)}
          className={`p-4 bg-dark-900/60 border cursor-pointer transition-all duration-200 ${c.borderColor} ${c.bgHover}`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
              {c.label}
            </span>
            <div className="p-1.5 rounded-lg bg-dark-950 border border-dark-800">
              {c.icon}
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${c.color} tracking-tight`}>
            {c.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-dark-400 mt-1 truncate">
            {c.subtext}
          </div>
        </Card>
      ))}
    </div>
  );
}
