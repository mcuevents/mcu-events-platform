'use client';

import React from 'react';
import { CRMAnalytics } from '@/types/analytics';
import { Layers, Share2, ArrowDown, Trophy } from 'lucide-react';

interface LeadFunnelSectionProps {
  data: CRMAnalytics;
}

export const LeadFunnelSection: React.FC<LeadFunnelSectionProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Conversion Funnel */}
      <div className="p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-400" />
            CRM Lead Progression Funnel
          </h3>
          <p className="text-xs text-dark-400">Prospect flow from discovery to closed partnership deal.</p>
        </div>

        <div className="space-y-2 pt-2">
          {data.funnel.map((step, idx) => {
            const widthPercent = Math.max(100 - idx * 16, 36);

            return (
              <div key={step.stage} className="space-y-1">
                <div
                  style={{ width: `${widthPercent}%` }}
                  className="p-3 rounded-xl bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 border border-brand-500/30 flex items-center justify-between text-xs transition-all shadow-sm"
                >
                  <span className="font-bold text-white">{step.stage}</span>
                  <span className="font-mono font-black text-brand-400">{step.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Acquisition by Source */}
      <div className="p-5 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-brand-400" />
            Lead Acquisition Channels
          </h3>
          <p className="text-xs text-dark-400">Marketing channel attribution for inbound enquiries.</p>
        </div>

        <div className="space-y-3 pt-2">
          {data.bySource.length === 0 ? (
            <div className="p-6 text-center text-xs text-dark-500 italic bg-dark-950/40 rounded-xl">
              No lead source records available for this period.
            </div>
          ) : (
            data.bySource.map((source) => (
              <div key={source.source} className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white capitalize">{source.source}</span>
                  <span className="font-mono text-dark-300">
                    {source.count} leads ({source.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div style={{ width: `${source.percentage}%` }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-amber-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
