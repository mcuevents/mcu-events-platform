'use client';

import React from 'react';
import { AnalyticsOverviewMetrics } from '@/types/analytics';
import { Ticket, Mail, UserCheck, Trophy, Percent, TrendingUp } from 'lucide-react';

interface OverviewMetricsGridProps {
  metrics: AnalyticsOverviewMetrics;
}

export const OverviewMetricsGrid: React.FC<OverviewMetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Delegate Registrations',
      value: metrics.totalRegistrations,
      subtext: `${metrics.confirmedRegistrations} Confirmed passes`,
      icon: Ticket,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      label: 'Inbound Inquiries Captured',
      value: metrics.totalEnquiries,
      subtext: 'Expos, Sponsors & Marketing',
      icon: Mail,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'CRM Prospect Pipeline',
      value: metrics.totalLeads,
      subtext: `${metrics.convertedLeads} Deals converted`,
      icon: UserCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Registration Confirmation Rate',
      value: `${metrics.registrationConversionRate}%`,
      subtext: 'Confirmed / Total Registrations',
      icon: Percent,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Lead Conversion Rate',
      value: `${metrics.leadConversionRate}%`,
      subtext: 'Converted / Total CRM Leads',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-gradient-to-br from-brand-500/20 to-amber-500/10 border-brand-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`p-4 rounded-2xl border space-y-2 ${c.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-dark-300 uppercase tracking-wider truncate">
                {c.label}
              </span>
              <Icon className={`h-4 w-4 ${c.color} shrink-0`} />
            </div>

            <div className="text-2xl font-black text-white font-mono">{c.value}</div>
            <p className="text-[11px] text-dark-400">{c.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
