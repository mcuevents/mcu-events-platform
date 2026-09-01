'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { Event } from '@/types/events';
import { Calendar, MapPin, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface UpcomingEventsWidgetProps {
  events: Event[];
}

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Upcoming Events Portfolio
            </h2>
            <span className="text-[11px] text-dark-400">Scheduled trade expos & conclaves</span>
          </div>
        </div>

        <Link href="/admin/events">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View All
          </Button>
        </Link>
      </div>

      {/* Events List */}
      <div className="flex-1 space-y-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">No upcoming events scheduled</p>
            <p className="text-xs text-dark-400 max-w-xs">
              Create and publish upcoming summits to begin accepting visitor registrations.
            </p>
            <Link href="/admin/events" className="pt-2">
              <Button variant="primary" size="sm">
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800/80 hover:border-dark-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Event Info Left */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-12 w-14 sm:h-14 sm:w-16 rounded-xl overflow-hidden bg-dark-900 shrink-0 border border-dark-800">
                  <Image
                    src={evt.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}
                    alt={evt.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={evt.status === 'ongoing' ? 'green' : 'gold'} size="sm">
                      {evt.status === 'ongoing' ? 'Live Now' : 'Upcoming'}
                    </Badge>
                    <span className="text-[10px] text-dark-400 uppercase tracking-wider font-semibold truncate">
                      {evt.category}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-dark-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-brand-400" />
                      <span>{formatDate(evt.startDate)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-dark-400" />
                      <span className="truncate">{evt.city} • {evt.locationName || 'Trade Complex'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Manage CTA */}
              <div className="shrink-0 self-end sm:self-center">
                <Link href="/admin/events">
                  <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
