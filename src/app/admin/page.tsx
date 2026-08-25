'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getDashboardStats,
  getUpcomingEventsForDashboard,
  getRecentRegistrations,
  getRecentEnquiries,
  getRegistrationTrend,
  getEnquiryTrend,
  getEventPerformance,
  getRecentActivity,
  DashboardStats,
  TrendDataPoint,
  EventPerformanceItem,
  ActivityItem,
} from '@/services/dashboard.service';
import { Event, EventRegistration, Enquiry } from '@/types';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardStatsGrid } from '@/components/admin/dashboard/DashboardStatsGrid';
import { DashboardQuickActions } from '@/components/admin/dashboard/DashboardQuickActions';
import { UpcomingEventsWidget } from '@/components/admin/dashboard/UpcomingEventsWidget';
import { RecentRegistrationsWidget } from '@/components/admin/dashboard/RecentRegistrationsWidget';
import { RecentEnquiriesWidget } from '@/components/admin/dashboard/RecentEnquiriesWidget';
import { DashboardTrendCharts } from '@/components/admin/dashboard/DashboardTrendCharts';
import { EventPerformanceWidget } from '@/components/admin/dashboard/EventPerformanceWidget';
import { DashboardActivityTimeline } from '@/components/admin/dashboard/DashboardActivityTimeline';
import { DashboardSkeleton } from '@/components/admin/dashboard/DashboardSkeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<EventRegistration[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [registrationTrend, setRegistrationTrend] = useState<TrendDataPoint[]>([]);
  const [enquiryTrend, setEnquiryTrend] = useState<TrendDataPoint[]>([]);
  const [eventPerformance, setEventPerformance] = useState<EventPerformanceItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [
        statsData,
        upcomingData,
        registrationsData,
        enquiriesData,
        regTrendData,
        enqTrendData,
        performanceData,
        activityData,
      ] = await Promise.all([
        getDashboardStats(profile?.role),
        getUpcomingEventsForDashboard(5),
        getRecentRegistrations(5),
        getRecentEnquiries(5),
        getRegistrationTrend(30),
        getEnquiryTrend(30),
        getEventPerformance(5),
        getRecentActivity(6),
      ]);

      setStats(statsData);
      setUpcomingEvents(upcomingData);
      setRecentRegistrations(registrationsData);
      setRecentEnquiries(enquiriesData);
      setRegistrationTrend(regTrendData);
      setEnquiryTrend(enqTrendData);
      setEventPerformance(performanceData);
      setActivities(activityData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to retrieve some dashboard metrics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.role]);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  const role = profile?.role || 'admin';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* 1. Header & Greeting */}
      <DashboardHeader
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={refreshing}
        lastUpdated={lastUpdated}
      />

      {/* Error Alert if any query fails */}
      {error && (
        <Card className="p-4 border-red-900/50 bg-red-950/30 flex items-center justify-between gap-3 text-xs text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            leftIcon={<RefreshCw className="h-3 w-3" />}
          >
            Retry
          </Button>
        </Card>
      )}

      {/* 2. Quick Actions Bar */}
      <DashboardQuickActions role={role} />

      {/* 3. Overview Statistics Grid */}
      {stats && <DashboardStatsGrid stats={stats} role={role} />}

      {/* 4. Top Grid: Upcoming Events & Activity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEventsWidget events={upcomingEvents} />
        <DashboardTrendCharts
          registrationTrend={registrationTrend}
          enquiryTrend={enquiryTrend}
        />
      </div>

      {/* 5. Middle Grid: Recent Registrations & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRegistrationsWidget registrations={recentRegistrations} />
        <RecentEnquiriesWidget enquiries={recentEnquiries} />
      </div>

      {/* 6. Bottom Grid: Event Leaderboard & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventPerformanceWidget performanceData={eventPerformance} />
        <DashboardActivityTimeline activities={activities} />
      </div>
    </div>
  );
}
