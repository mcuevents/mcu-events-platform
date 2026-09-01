'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { EventPerformanceItem } from '@/services/dashboard.service';
import { Award, ArrowRight, TrendingUp } from 'lucide-react';

interface EventPerformanceWidgetProps {
  performanceData: EventPerformanceItem[];
}

export function EventPerformanceWidget({ performanceData }: EventPerformanceWidgetProps) {
  const maxRegistrations = Math.max(...performanceData.map((d) => d.registrationCount), 1);

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Event Pass Volume Leaderboard
            </h2>
            <span className="text-[11px] text-dark-400">Delegate signup distribution across expos</span>
          </div>
        </div>

        <Link href="/admin/registrations">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Analytics
          </Button>
        </Link>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 space-y-3.5">
        {performanceData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <Award className="h-8 w-8 text-dark-500" />
            <p className="text-sm font-semibold text-white">No performance data yet</p>
          </div>
        ) : (
          performanceData.map((item, idx) => {
            const percent = Math.min(Math.round((item.registrationCount / maxRegistrations) * 100), 100);

            return (
              <div key={item.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-[11px] font-mono font-bold text-dark-400 w-4">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-dark-400 hidden sm:inline-block truncate">
                      ({item.city})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-brand-400 text-xs">
                      {item.registrationCount.toLocaleString()} passes
                    </span>
                    <Badge variant={item.status === 'live' ? 'green' : item.status === 'upcoming' ? 'gold' : 'gray'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-dark-950 rounded-full overflow-hidden border border-dark-800/80">
                  <div
                    style={{ width: `${percent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-amber-400 transition-all duration-700"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
