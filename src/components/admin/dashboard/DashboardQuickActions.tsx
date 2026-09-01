'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { AdminRole } from '@/types/auth';
import {
  PlusCircle,
  FilePlus,
  ImagePlus,
  Ticket,
  Mail,
  Store,
  Share2,
} from 'lucide-react';

interface DashboardQuickActionsProps {
  role?: AdminRole;
}

export function DashboardQuickActions({ role = 'admin' }: DashboardQuickActionsProps) {
  const actions = [
    {
      label: 'Create New Event',
      href: '/admin/events',
      icon: <PlusCircle className="h-4 w-4" />,
      variant: 'primary' as const,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
    },
    {
      label: 'Review Delegate Passes',
      href: '/admin/registrations',
      icon: <Ticket className="h-4 w-4" />,
      variant: 'outline' as const,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
    },
    {
      label: 'Process Inbound Leads',
      href: '/admin/enquiries',
      icon: <Mail className="h-4 w-4" />,
      variant: 'outline' as const,
      allowedRoles: ['super_admin', 'admin', 'event_manager', 'content_manager'],
    },
    {
      label: 'Add Blog Article',
      href: '/admin/blog',
      icon: <FilePlus className="h-4 w-4" />,
      variant: 'outline' as const,
      allowedRoles: ['super_admin', 'admin', 'content_manager'],
    },
    {
      label: 'Upload Gallery Media',
      href: '/admin/gallery',
      icon: <ImagePlus className="h-4 w-4" />,
      variant: 'outline' as const,
      allowedRoles: ['super_admin', 'admin', 'content_manager'],
    },
    {
      label: 'Manage Exhibitor Stalls',
      href: '/admin/exhibitors',
      icon: <Store className="h-4 w-4" />,
      variant: 'outline' as const,
      allowedRoles: ['super_admin', 'admin', 'event_manager'],
    },
  ];

  const visibleActions = actions.filter((a) => {
    if (role === 'super_admin' || role === 'admin') return true;
    return a.allowedRoles.includes(role);
  });

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-xs font-bold uppercase tracking-wider text-dark-400 shrink-0 mr-1">
        Quick Actions:
      </span>
      {visibleActions.map((action, idx) => (
        <Link key={idx} href={action.href} className="shrink-0">
          <Button
            variant={action.variant}
            size="sm"
            leftIcon={action.icon}
          >
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
