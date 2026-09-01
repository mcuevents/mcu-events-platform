'use client';

import React from 'react';
import { CRMStats } from '@/types/crm';
import { UserCheck, Sparkles, PhoneCall, CheckCircle, FileText, Trophy, Clock, TrendingUp } from 'lucide-react';

interface CRMPipelineStatsProps {
  stats: CRMStats;
  activeFilterStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export const CRMPipelineStats: React.FC<CRMPipelineStatsProps> = ({
  stats,
  activeFilterStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      key: 'all',
      label: 'Total Pipeline',
      value: stats.totalLeads,
      icon: UserCheck,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      key: 'new',
      label: 'New Leads',
      value: stats.newLeads,
      icon: Sparkles,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      key: 'contacted',
      label: 'Contacted',
      value: stats.contacted,
      icon: PhoneCall,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      key: 'qualified',
      label: 'Qualified',
      value: stats.qualified,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      key: 'proposal',
      label: 'In Proposal',
      value: stats.proposal,
      icon: FileText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      key: 'converted',
      label: 'Converted',
      value: stats.converted,
      icon: Trophy,
      color: 'text-brand-400',
      bg: 'bg-gradient-to-br from-brand-500/20 to-amber-500/10 border-brand-500/30',
    },
    {
      key: 'followups',
      label: 'Pending Follow-ups',
      value: stats.upcomingFollowups,
      icon: Clock,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilterStatus === card.key;

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectStatus && card.key !== 'followups' && onSelectStatus(card.key)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${card.bg} ${
              isSelected ? 'ring-2 ring-brand-500 shadow-lg scale-[1.02]' : 'hover:border-dark-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-dark-300 uppercase tracking-wider truncate">
                {card.label}
              </span>
              <Icon className={`h-4 w-4 ${card.color} shrink-0`} />
            </div>
            <div className="mt-2 text-xl font-black text-white">{card.value}</div>
          </button>
        );
      })}
    </div>
  );
};
