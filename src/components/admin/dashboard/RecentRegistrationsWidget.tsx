'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EventRegistration } from '@/types/events';
import { Ticket, ArrowRight, UserCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface RecentRegistrationsWidgetProps {
  registrations: EventRegistration[];
}

export function RecentRegistrationsWidget({ registrations }: RecentRegistrationsWidgetProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="green" size="sm">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Confirmed</span>
            </span>
          </Badge>
        );
      case 'attended':
        return (
          <Badge variant="gold" size="sm">
            <span className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              <span>Attended</span>
            </span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="red" size="sm">
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              <span>Cancelled</span>
            </span>
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="amber" size="sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Pending</span>
            </span>
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Recent Delegate Registrations
            </h2>
            <span className="text-[11px] text-dark-400">Latest visitor & VIP pass bookings</span>
          </div>
        </div>

        <Link href="/admin/registrations">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View Manifest
          </Button>
        </Link>
      </div>

      {/* Table / List */}
      <div className="flex-1">
        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
              <Ticket className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">No registrations recorded yet</p>
            <p className="text-xs text-dark-400 max-w-xs">
              When delegates register for upcoming events, pass bookings will appear in this feed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800/80 text-[10px] font-bold uppercase tracking-wider text-dark-400">
                  <th className="pb-2.5 font-semibold">Delegate</th>
                  <th className="pb-2.5 font-semibold hidden sm:table-cell">Event</th>
                  <th className="pb-2.5 font-semibold hidden md:table-cell">Pass Type</th>
                  <th className="pb-2.5 font-semibold text-right sm:text-left">Date</th>
                  <th className="pb-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/40">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-dark-950/40 transition-colors group">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-white group-hover:text-brand-400 transition-colors truncate max-w-[140px] sm:max-w-none">
                        {reg.fullName}
                      </div>
                      <div className="text-[10px] text-dark-400 font-mono truncate max-w-[140px] sm:max-w-none">
                        {reg.referenceCode || reg.companyName || reg.email}
                      </div>
                    </td>

                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="text-dark-200 truncate max-w-[180px]">
                        {reg.eventTitle || 'MCU Expo'}
                      </div>
                      <div className="text-[10px] text-dark-400">
                        {reg.attendeesCount} {reg.attendeesCount === 1 ? 'delegate' : 'delegates'}
                      </div>
                    </td>

                    <td className="py-3 px-2 hidden md:table-cell">
                      <span className="capitalize text-dark-300 font-medium bg-dark-950 px-2 py-0.5 rounded border border-dark-800 text-[10px]">
                        {reg.registrationType || 'Visitor'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right sm:text-left text-dark-400 whitespace-nowrap">
                      {formatDate(reg.createdAt)}
                    </td>

                    <td className="py-3 pl-2 text-right">
                      {getStatusBadge(reg.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
