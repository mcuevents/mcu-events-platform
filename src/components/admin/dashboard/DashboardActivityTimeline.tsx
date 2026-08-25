'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ActivityItem } from '@/services/dashboard.service';
import { Activity, Ticket, Mail, Calendar, FileText, ArrowRight } from 'lucide-react';

interface DashboardActivityTimelineProps {
  activities: ActivityItem[];
}

export function DashboardActivityTimeline({ activities }: DashboardActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <Ticket className="h-3.5 w-3.5 text-amber-400" />;
      case 'enquiry':
        return <Mail className="h-3.5 w-3.5 text-blue-400" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-brand-400" />;
      case 'blog':
        return <FileText className="h-3.5 w-3.5 text-purple-400" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-brand-400" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Recent System Activity Stream
            </h2>
            <span className="text-[11px] text-dark-400">Real-time registrations, leads & publications</span>
          </div>
        </div>

        <Badge variant="gray">Live Audit Trail</Badge>
      </div>

      {/* Activity Items */}
      <div className="flex-1 space-y-3">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <Activity className="h-8 w-8 text-dark-500" />
            <p className="text-sm font-semibold text-white">No recent activity logged</p>
          </div>
        ) : (
          activities.map((act) => (
            <Link key={act.id} href={act.href} className="block group">
              <div className="p-3 rounded-2xl bg-dark-950/60 border border-dark-800/80 hover:border-dark-700 transition-all flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dark-900 border border-dark-800 group-hover:border-brand-500/30 transition-colors mt-0.5">
                    {getIcon(act.type)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                        {act.title}
                      </span>
                      {act.badge && (
                        <Badge variant={act.badgeVariant || 'gray'} size="sm">
                          {act.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-[11px] text-dark-400 truncate max-w-xl">
                      {act.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-dark-500 font-mono block whitespace-nowrap">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
