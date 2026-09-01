'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { DashboardStats } from '@/services/dashboard.service';
import { AdminRole } from '@/types/auth';
import {
  Calendar,
  Sparkles,
  Ticket,
  Mail,
  FileText,
  Briefcase,
  Image,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: DashboardStats;
  role?: AdminRole;
}

export function DashboardStatsGrid({ stats, role = 'admin' }: DashboardStatsGridProps) {
  // All possible stat card definitions
  const allCards = [
    {
      key: 'total_events',
      title: 'TOTAL EVENTS',
      value: stats.totalEvents,
      subtext: `${stats.upcomingEvents} upcoming • ${stats.pastEvents} completed`,
      href: '/admin/events',
      icon: <Calendar className="h-5 w-5 text-brand-400" />,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
      badge: 'Portfolio',
      badgeVariant: 'gold' as const,
    },
    {
      key: 'upcoming_events',
      title: 'UPCOMING EXPOS',
      value: stats.upcomingEvents,
      subtext: 'Active marketing & pass bookings',
      href: '/admin/events',
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
      badge: 'Active',
      badgeVariant: 'green' as const,
    },
    {
      key: 'registrations',
      title: 'DELEGATE PASSES',
      value: stats.totalRegistrations,
      subtext: `${stats.pendingRegistrations} pending confirmation`,
      href: '/admin/registrations',
      icon: <Ticket className="h-5 w-5 text-amber-400" />,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
      badge: 'Attendees',
      badgeVariant: 'amber' as const,
    },
    {
      key: 'enquiries',
      title: 'PENDING ENQUIRIES',
      value: stats.pendingEnquiries,
      subtext: `${stats.totalEnquiries} total leads across portals`,
      href: '/admin/enquiries',
      icon: <Mail className="h-5 w-5 text-blue-400" />,
      allowedRoles: ['super_admin', 'admin', 'event_manager', 'content_manager'],
      badge: 'Lead Inbox',
      badgeVariant: 'blue' as const,
    },
    {
      key: 'blog_posts',
      title: 'PUBLISHED ARTICLES',
      value: stats.publishedBlogPosts,
      subtext: 'Insights, guides & press releases',
      href: '/admin/blog',
      icon: <FileText className="h-5 w-5 text-purple-400" />,
      allowedRoles: ['super_admin', 'admin', 'content_manager'],
      badge: 'Content',
      badgeVariant: 'gray' as const,
    },
    {
      key: 'services',
      title: 'SERVICES & PACKAGES',
      value: stats.activeServices,
      subtext: `${stats.galleryCount} media gallery assets`,
      href: '/admin/services',
      icon: <Briefcase className="h-5 w-5 text-teal-400" />,
      allowedRoles: ['super_admin', 'admin', 'content_manager'],
      badge: 'Catalog',
      badgeVariant: 'gray' as const,
    },
  ];

  // Filter cards based on user role
  const visibleCards = allCards.filter((c) => {
    if (role === 'super_admin' || role === 'admin') return true;
    return c.allowedRoles.includes(role);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {visibleCards.map((card) => (
        <Link key={card.key} href={card.href} className="group block focus:outline-none">
          <Card className="p-4 sm:p-5 h-full flex flex-col justify-between border-dark-800 bg-dark-900/60 hover:border-brand-500/40 hover:bg-dark-900/90 transition-all shadow-md group-focus:ring-2 group-focus:ring-brand-500">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-950 border border-dark-800 group-hover:border-brand-500/30 transition-colors">
                  {card.icon}
                </div>
                <Badge variant={card.badgeVariant} size="sm">
                  {card.badge}
                </Badge>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-dark-400 block">
                  {card.title}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 block">
                  {card.value.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-dark-800/80 flex items-center justify-between text-[11px] text-dark-400">
              <span className="truncate pr-1">{card.subtext}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-dark-500 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
