'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/events';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Calendar,
  MapPin,
  Eye,
  Edit3,
  Copy,
  Archive,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Ticket,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';

interface EventTableProps {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPublishToggle: (id: string, currentlyPublished: boolean) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onArchive: (id: string, title: string) => Promise<void>;
  isActionLoading?: boolean;
}

export function EventTable({
  events,
  total,
  page,
  totalPages,
  onPageChange,
  onPublishToggle,
  onDuplicate,
  onArchive,
  isActionLoading = false,
}: EventTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge variant="green" size="sm">Live Now</Badge>;
      case 'upcoming':
        return <Badge variant="gold" size="sm">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="gray" size="sm">Completed</Badge>;
      case 'draft':
        return <Badge variant="amber" size="sm">Draft</Badge>;
      case 'postponed':
        return <Badge variant="blue" size="sm">Postponed</Badge>;
      case 'cancelled':
        return <Badge variant="red" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

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
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 px-4 font-semibold">Event / Expo Title</th>
              <th className="py-3.5 px-3 font-semibold">Dates & Schedule</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Venue & City</th>
              <th className="py-3.5 px-3 font-semibold">Status</th>
              <th className="py-3.5 px-3 font-semibold hidden lg:table-cell">Visibility</th>
              <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Passes</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No matching events found</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Try adjusting your search keywords, status tabs, or publication filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              events.map((evt) => {
                const isPublished = evt.isPublished || (evt.status !== 'draft' && evt.isPublished !== false);
                const isPassOpen = evt.registrationOpen !== false && evt.registrationEnabled !== false;

                return (
                  <tr
                    key={evt.id}
                    className="hover:bg-dark-950/40 transition-colors group"
                  >
                    {/* 1. Title & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-dark-900 border border-dark-800 shrink-0">
                          <Image
                            src={evt.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}
                            alt={evt.title}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                              {evt.category}
                            </span>
                            {evt.isFeatured && (
                              <Badge variant="gold" size="sm">
                                <span className="flex items-center gap-0.5">
                                  <Star className="h-2.5 w-2.5 fill-current" />
                                  <span>Featured</span>
                                </span>
                              </Badge>
                            )}
                          </div>

                          <Link
                            href={`/admin/events/${evt.id}/edit`}
                            className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate"
                          >
                            {evt.title}
                          </Link>

                          <span className="text-[10px] text-dark-500 font-mono block truncate">
                            /{evt.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Dates & Schedule */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-dark-300">
                      <div className="font-medium text-white">
                        {formatDate(evt.startDate)}
                      </div>
                      <div className="text-[10px] text-dark-400">
                        to {formatDate(evt.endDate)}
                      </div>
                    </td>

                    {/* 3. Venue & City */}
                    <td className="py-3.5 px-3 hidden md:table-cell text-dark-300">
                      <div className="truncate max-w-[150px] font-medium text-white">
                        {evt.city}
                      </div>
                      <div className="text-[10px] text-dark-400 truncate max-w-[150px]">
                        {evt.locationName}
                      </div>
                    </td>

                    {/* 4. Operational Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(evt.status)}
                    </td>

                    {/* 5. Publication State */}
                    <td className="py-3.5 px-3 hidden lg:table-cell whitespace-nowrap">
                      {isPublished ? (
                        <button
                          type="button"
                          onClick={() => onPublishToggle(evt.id, true)}
                          title="Click to unpublish"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Published</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onPublishToggle(evt.id, false)}
                          title="Click to publish"
                          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>Draft Only</span>
                        </button>
                      )}
                    </td>

                    {/* 6. Registration Passes */}
                    <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap">
                      <Badge variant={isPassOpen ? 'green' : 'gray'} size="sm">
                        <span className="flex items-center gap-1">
                          <Ticket className="h-3 w-3" />
                          <span>{isPassOpen ? 'Open' : 'Closed'}</span>
                        </span>
                      </Badge>
                    </td>

                    {/* 7. Action Menu */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <Link href={`/admin/events/${evt.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Edit Event">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        {/* View / Preview */}
                        <Link
                          href={isPublished ? `/events/${evt.slug}` : `/admin/events/${evt.id}/preview`}
                          target="_blank"
                        >
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={isPublished ? 'View Live Page' : 'Preview Draft Layout'}>
                            <Eye className="h-3.5 w-3.5 text-brand-400" />
                          </Button>
                        </Link>

                        {/* Duplicate */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hidden sm:inline-flex"
                          onClick={() => onDuplicate(evt.id)}
                          title="Duplicate Event"
                          disabled={isActionLoading}
                        >
                          <Copy className="h-3.5 w-3.5 text-dark-400 hover:text-white" />
                        </Button>

                        {/* Archive */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                          onClick={() => onArchive(evt.id, evt.title)}
                          title="Archive Event"
                          disabled={isActionLoading}
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="p-4 border-t border-dark-800 bg-dark-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-400">
          <div>
            Showing <strong className="text-white">{events.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total events
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>

            <span className="px-2 font-mono font-bold text-white">
              Page {page} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
