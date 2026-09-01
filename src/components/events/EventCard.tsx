import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/events';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, ArrowRight, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export interface EventCardProps {
  event: Event;
  index?: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const minPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map((t) => t.price))
    : 0;

  const eventIndexNumber = String(index + 1).padStart(2, '0');

  const getStatusBadge = () => {
    switch (event.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B88932]">
            <Clock className="h-3 w-3" />
            <span>Upcoming</span>
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live Now</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#75695C]">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'postponed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            <span>Postponed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88932] rounded-2xl"
    >
      <div className="relative h-full flex flex-col justify-between rounded-2xl border border-[#E8DED0] bg-white p-7 sm:p-8 transition-all duration-300 hover:border-[#B88932] hover:shadow-[0_12px_32px_rgba(43,33,24,0.04)] hover:-translate-y-0.5">
        <div className="space-y-5">
          {/* Header Row: Category & Status / Editorial Number */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B88932] font-mono">
                {event.category}
              </span>
              <span className="text-[#D4B06A] text-xs">◆</span>
              {getStatusBadge()}
            </div>
            <span className="font-serif text-lg font-light text-[#D4B06A]">
              {eventIndexNumber}
            </span>
          </div>

          {/* Event Title */}
          <div className="space-y-2">
            <h3 className="event-card-title font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E] leading-snug">
              {event.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#75695C] line-clamp-2 leading-relaxed font-normal">
              {event.description}
            </p>
          </div>

          {/* Date & Location Specs */}
          <div className="space-y-2 pt-2 text-xs text-[#75695C]">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#B88932] shrink-0" />
              <span className="font-medium tracking-wide uppercase text-[11px]">
                {formatDate(event.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#B88932] shrink-0" />
              <span className="truncate uppercase text-[11px]">
                {event.locationName}, {event.city}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Row: View Event Action */}
        <div className="pt-6 mt-6 border-t border-[#E8DED0] flex items-center justify-between">
          <div className="text-xs">
            {event.status === 'completed' ? (
              <span className="text-[#75695C] font-medium">Event Concluded</span>
            ) : minPrice > 0 ? (
              <span className="text-[#75695C]">
                From <span className="font-serif font-bold text-sm text-[#2B2118]">{formatCurrency(minPrice)}</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-[11px] uppercase tracking-wider">
                Free Registration
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
            <span>View Event</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};
