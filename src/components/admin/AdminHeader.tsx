'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Menu, ExternalLink, LogOut, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface AdminHeaderProps {
  onToggleMobile: () => void;
}

export function AdminHeader({ onToggleMobile }: AdminHeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Overview';
    const segment = pathname.replace('/admin/', '').split('/')[0];
    const titles: Record<string, string> = {
      events: 'Events & Expo Portfolio',
      registrations: 'Delegate Registrations',
      enquiries: 'Business Enquiries',
      exhibitors: 'Exhibitor Stalls',
      sponsors: 'Corporate Sponsors',
      partners: 'Strategic Partners',
      gallery: 'Photo Gallery CMS',
      videos: 'Video Reels & Highlights',
      blog: 'Blog Articles & Insights',
      services: 'Services Management',
      team: 'Team Directory',
      testimonials: 'Client Testimonials',
      homepage: 'Homepage Sections',
      social: 'Social Media Channels',
      seo: 'SEO & Meta Tags',
      settings: 'Platform Settings',
    };
    return titles[segment] || 'Admin Console';
  };

  return (
    <header className="h-16 bg-dark-950/80 border-b border-dark-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Drawer Trigger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Toggle Mobile Sidebar"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-dark-900 border border-dark-800 text-dark-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
            {getPageTitle()}
          </h1>
          <span className="text-[10px] text-dark-400 font-mono hidden sm:inline-block">
            MCU Platform v1.0
          </span>
        </div>
      </div>

      {/* Right: Quick Public Site Link + User Chip + Logout */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-800 text-xs font-semibold text-dark-300 hover:text-white hover:border-brand-500/40 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="h-3 w-3 text-brand-400" />
        </Link>

        <div className="flex items-center gap-2.5 pl-3 border-l border-dark-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-bold text-xs">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>

          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-white block leading-tight">
              {profile?.fullName || 'Admin'}
            </span>
            <span className="text-[10px] text-dark-400 font-mono block">
              {profile?.role ? profile.role.replace('_', ' ') : 'Administrator'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            title="Sign Out"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-900 border border-dark-800 text-dark-400 hover:text-red-400 hover:border-red-900/40 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
