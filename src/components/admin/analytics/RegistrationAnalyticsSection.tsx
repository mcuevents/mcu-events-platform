'use client';

import React from 'react';
import { RegistrationAnalytics } from '@/types/analytics';
import { Calendar, BarChart3, CheckCircle2, Ticket, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui';

interface RegistrationAnalyticsSectionProps {
  data: RegistrationAnalytics;
}

export const RegistrationAnalyticsSection: React.FC<RegistrationAnalyticsSectionProps> = ({ data }) => {
  const maxCount = Math.max(...data.timeSeries.map((t) => t.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Registration Timeline Bar Chart */}
      <div className="lg:col-span-2 p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-400" />
              Registration Velocity Timeline
            </h3>
            <p className="text-xs text-dark-400">Delegate pass registrations across the selected timeframe.</p>
          </div>
        </div>

        {data.timeSeries.length === 0 ? (
          <div className="p-8 text-center text-xs text-dark-500 italic bg-dark-950/40 rounded-xl">
            No registrations recorded in this period.
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <div className="h-44 flex items-end gap-2 pt-4 px-2 bg-dark-950/60 rounded-xl border border-dark-800/80 overflow-x-auto">
              {data.timeSeries.map((item) => {
                const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 12);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end min-w-[32px] group">
                    <span className="text-[10px] font-mono text-brand-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-brand-600 to-amber-400 group-hover:from-brand-500 group-hover:to-amber-300 transition-all shadow-sm"
                    />
                    <span className="text-[9px] text-dark-500 font-mono truncate w-full text-center">
                      {item.date.split('-').slice(1).join('/')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Status Distribution & Breakdown */}
      <div className="p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-400" />
          Pass Status Distribution
        </h3>

        <div className="space-y-3">
          {data.byStatus.map((s) => {
            let color = 'bg-brand-500';
            if (s.status === 'confirmed') color = 'bg-emerald-500';
            if (s.status === 'cancelled') color = 'bg-red-500';
            if (s.status === 'attended') color = 'bg-purple-500';

            return (
              <div key={s.status} className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white capitalize">{s.status}</span>
                  <span className="font-mono text-dark-300">
                    {s.count} ({s.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div style={{ width: `${s.percentage}%` }} className={`h-full rounded-full ${color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Event Ranking Leaderboard */}
      <div className="lg:col-span-3 p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Trophy className="h-4 w-4 text-brand-400" />
          Expos & Events Registration Leaderboard
        </h3>

        {data.byEvent.length === 0 ? (
          <div className="p-6 text-center text-xs text-dark-500 italic bg-dark-950/40 rounded-xl">
            No event data for this period.
          </div>
        ) : (
          <div className="bg-dark-950/80 rounded-xl border border-dark-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-900/80 text-dark-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Total Registered</th>
                  <th className="py-3 px-4">Confirmed Passes</th>
                  <th className="py-3 px-4 text-right">Confirmation Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60 text-dark-200">
                {data.byEvent.map((evt) => {
                  const rate = evt.registrationsCount > 0 ? Math.round((evt.confirmedCount / evt.registrationsCount) * 100) : 0;

                  return (
                    <tr key={evt.eventId} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white">{evt.eventTitle}</td>
                      <td className="py-3 px-4 font-mono">{evt.registrationsCount}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">{evt.confirmedCount}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-brand-400">
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
