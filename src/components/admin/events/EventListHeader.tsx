'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Plus, Calendar, RefreshCw } from 'lucide-react';

interface EventListHeaderProps {
  totalCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function EventListHeader({
  totalCount,
  onRefresh,
  isRefreshing = false,
}: EventListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            <Calendar className="h-5 w-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            Events & Expos Portfolio
          </h1>
          <Badge variant="gold" size="sm">
            {totalCount} Total
          </Badge>
        </div>
        <p className="text-xs text-dark-300">
          Create, edit, publish, duplicate and manage business expos, trade summits and conclaves.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>

        <Link href="/admin/events/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Create New Event
          </Button>
        </Link>
      </div>
    </div>
  );
}
