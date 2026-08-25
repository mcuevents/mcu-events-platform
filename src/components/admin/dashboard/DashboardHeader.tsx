'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RefreshCw, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: Date;
}

export function DashboardHeader({
  onRefresh,
  isRefreshing,
  lastUpdated,
}: DashboardHeaderProps) {
  const { profile } = useAuth();

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'gold';
      case 'event_manager':
        return 'green';
      case 'content_manager':
        return 'blue';
      case 'admin':
      default:
        return 'amber';
    }
  };

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Just now';

  return (
    <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-900 to-dark-950 border border-dark-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute -right-10 -top-10 w-96 h-96 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="gold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
                <span>Admin Control Center</span>
              </span>
            </Badge>

            <Badge variant={getRoleBadgeVariant(profile?.role)}>
              {profile?.role ? profile.role.toUpperCase().replace('_', ' ') : 'ADMINISTRATOR'}
            </Badge>

            <span className="text-[11px] text-dark-400 font-mono">
              Synced: {formattedTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Welcome back, {profile?.fullName || 'Administrator'}
          </h1>

          <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">
            Manage MCU Creations events, registrations, enquiries and website content from one unified control center.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Link href="/" target="_blank">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ExternalLink className="h-3.5 w-3.5 text-brand-400" />}
            >
              Preview Site
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
