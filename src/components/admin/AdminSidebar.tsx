'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { AdminNavItem, AdminRole } from '@/types/auth';
import { getUnreadNotificationCount } from '@/services/notification.service';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Mail,
  Store,
  Award,
  Handshake,
  Image,
  Video,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Home,
  Share2,
  Search,
  Settings,
  LogOut,
  Shield,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bell,
  UserCheck,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // Core
  {
    title: 'Dashboard',
    href: '/admin',
    iconName: 'LayoutDashboard',
    category: 'core',
  },

  // Events & Delegates
  {
    title: 'Events & Expos',
    href: '/admin/events',
    iconName: 'Calendar',
    category: 'events',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },
  {
    title: 'Registrations',
    href: '/admin/registrations',
    iconName: 'Ticket',
    category: 'events',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },
  {
    title: 'Enquiries',
    href: '/admin/enquiries',
    iconName: 'Mail',
    category: 'events',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },

  // Alliances & B2B
  {
    title: 'CRM Pipeline',
    href: '/admin/crm',
    iconName: 'UserCheck',
    category: 'alliances',
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    title: 'Exhibitor Stalls',
    href: '/admin/exhibitors',
    iconName: 'Store',
    category: 'alliances',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },
  {
    title: 'Sponsors',
    href: '/admin/sponsors',
    iconName: 'Award',
    category: 'alliances',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },
  {
    title: 'Partners',
    href: '/admin/partners',
    iconName: 'Handshake',
    category: 'alliances',
    allowedRoles: ['super_admin', 'admin', 'event_manager'],
  },

  // Content & Media
  {
    title: 'Photo Gallery',
    href: '/admin/gallery',
    iconName: 'Image',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Video Reels',
    href: '/admin/videos',
    iconName: 'Video',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Blog Articles',
    href: '/admin/blog',
    iconName: 'FileText',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Services CMS',
    href: '/admin/services',
    iconName: 'Briefcase',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Team Directory',
    href: '/admin/team',
    iconName: 'Users',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Testimonials',
    href: '/admin/testimonials',
    iconName: 'MessageSquare',
    category: 'content',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },

  // System & Marketing
  {
    title: 'Homepage Sections',
    href: '/admin/homepage',
    iconName: 'Home',
    category: 'system',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'Social Channels',
    href: '/admin/social',
    iconName: 'Share2',
    category: 'system',
    allowedRoles: ['super_admin', 'admin', 'content_manager'],
  },
  {
    title: 'SEO Metadata',
    href: '/admin/seo',
    iconName: 'Search',
    category: 'system',
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    iconName: 'Bell',
    category: 'system',
    allowedRoles: ['super_admin', 'admin', 'content_manager', 'event_manager'],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    iconName: 'BarChart3',
    category: 'system',
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    iconName: 'Settings',
    category: 'system',
    allowedRoles: ['super_admin', 'admin'],
  },
];

const ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  Ticket,
  Mail,
  Store,
  Award,
  Handshake,
  Image,
  Video,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Home,
  Share2,
  Search,
  Settings,
  Bell,
  UserCheck,
  BarChart3,
};

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadNotificationCount().then((count) => setUnreadCount(count));
  }, [pathname]);

  const userRole = profile?.role || 'admin';

  // Filter items based on user role
  const visibleItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (!item.allowedRoles) return true;
    if (userRole === 'super_admin') return true;
    return item.allowedRoles.includes(userRole);
  });

  const categories = [
    { key: 'core', label: 'Overview' },
    { key: 'events', label: 'Events & Passes' },
    { key: 'alliances', label: 'CRM & Alliances' },
    { key: 'content', label: 'Media & CMS' },
    { key: 'system', label: 'System & Analytics' },
  ];

  const getRoleBadgeVariant = (role?: AdminRole) => {
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

  return (
    <aside className="w-64 bg-dark-950 border-r border-dark-800 flex flex-col h-full overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-dark-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group" onClick={onCloseMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-amber-500 text-dark-950 font-black shadow-lg shadow-brand-500/10 group-hover:scale-105 transition-transform">
            MCU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white group-hover:text-brand-400 transition-colors">
              MCU CREATIONS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">
              Admin Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-dark-800">
        {categories.map((category) => {
          const categoryItems = visibleItems.filter((item) => item.category === category.key);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.key} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-dark-400">
                {category.label}
              </div>
              <div className="space-y-0.5">
                {categoryItems.map((item) => {
                  const Icon = ICONS_MAP[item.iconName] || LayoutDashboard;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold shadow-sm'
                          : 'text-dark-300 hover:text-white hover:bg-dark-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isActive ? 'text-brand-400' : 'text-dark-400 group-hover:text-white'
                          }`}
                        />
                        <span>{item.title}</span>
                      </div>

                      {item.href === '/admin/notifications' && unreadCount > 0 ? (
                        <span className="h-4 px-1.5 rounded-full bg-brand-500 text-dark-950 text-[10px] font-black flex items-center justify-center">
                          {unreadCount}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="h-3 w-3 text-brand-400/60" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Card & Sign Out */}
      <div className="p-3 border-t border-dark-800 bg-dark-900/30">
        <div className="flex items-center justify-between p-2 rounded-xl bg-dark-900/80 border border-dark-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs shrink-0">
              {profile?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {profile?.fullName || 'Administrator'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant={getRoleBadgeVariant(profile?.role)} size="sm" className="text-[9px] py-0 px-1.5">
                  {profile?.role?.replace('_', ' ') || 'admin'}
                </Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
