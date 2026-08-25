'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TrendDataPoint } from '@/services/dashboard.service';
import { TrendingUp, BarChart2, Ticket, Mail, Calendar } from 'lucide-react';

interface DashboardTrendChartsProps {
  registrationTrend: TrendDataPoint[];
  enquiryTrend: TrendDataPoint[];
}

export function DashboardTrendCharts({
  registrationTrend,
  enquiryTrend,
}: DashboardTrendChartsProps) {
  const [activeTab, setActiveTab] = useState<'registrations' | 'enquiries'>('registrations');

  const currentData = activeTab === 'registrations' ? registrationTrend : enquiryTrend;
  const totalCount = currentData.reduce((acc, curr) => acc + curr.count, 0);
  const maxCount = Math.max(...currentData.map((d) => d.count), 1);

  // Group into last 14 visible bars for clean display
  const displayData = currentData.slice(-14);

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 flex flex-col h-full space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Activity Trends (Last 30 Days)
            </h2>
            <span className="text-[11px] text-dark-400">
              Total 30-day volume: <strong className="text-brand-400 font-bold">{totalCount}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center rounded-xl bg-dark-950 p-1 border border-dark-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'registrations'
                ? 'bg-brand-500 text-dark-950 font-bold shadow'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Ticket className="h-3.5 w-3.5" />
            <span>Passes ({registrationTrend.reduce((a, b) => a + b.count, 0)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'enquiries'
                ? 'bg-brand-500 text-dark-950 font-bold shadow'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Leads ({enquiryTrend.reduce((a, b) => a + b.count, 0)})</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 flex flex-col justify-end pt-4 min-h-[220px]">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
            <BarChart2 className="h-8 w-8 text-dark-500" />
            <p className="text-sm font-semibold text-dark-300">Not enough data yet</p>
            <p className="text-xs text-dark-500 max-w-xs">
              Daily activity counts will populate as delegates register and submit enquiries.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Bars Grid */}
            <div className="h-44 flex items-end gap-1.5 sm:gap-2.5 pt-4 pb-1">
              {displayData.map((item, idx) => {
                const heightPercent = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 6) : 6;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 border border-dark-700 text-[10px] text-white font-mono px-2 py-0.5 rounded pointer-events-none shadow-lg z-20 whitespace-nowrap">
                      {item.label}: <strong className="text-brand-400">{item.count}</strong>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        item.count > 0
                          ? activeTab === 'registrations'
                            ? 'bg-gradient-to-t from-amber-500/60 to-brand-400 group-hover:from-amber-400 group-hover:to-brand-300 shadow-sm shadow-brand-500/20'
                            : 'bg-gradient-to-t from-blue-600/60 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 shadow-sm shadow-blue-500/20'
                          : 'bg-dark-800/40'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between border-t border-dark-800 pt-2 text-[10px] text-dark-500 font-mono">
              <span>{displayData[0]?.label || '30 days ago'}</span>
              <span>Mid-period</span>
              <span>Today ({displayData[displayData.length - 1]?.label || 'Latest'})</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
