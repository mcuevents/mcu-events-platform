'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DateRangeFilter,
  AnalyticsOverviewMetrics,
  RegistrationAnalytics,
  EnquiryAnalytics,
  CRMAnalytics,
  ContentAnalytics,
} from '@/types/analytics';
import {
  getAnalyticsSummary,
  getRegistrationAnalytics,
  getEnquiryAnalytics,
  getCRMAnalytics,
  getContentAnalytics,
  exportAnalyticsReportCSV,
} from '@/services/analytics.service';
import { AnalyticsDateRangeSelector } from '@/components/admin/analytics/AnalyticsDateRangeSelector';
import { OverviewMetricsGrid } from '@/components/admin/analytics/OverviewMetricsGrid';
import { RegistrationAnalyticsSection } from '@/components/admin/analytics/RegistrationAnalyticsSection';
import { LeadFunnelSection } from '@/components/admin/analytics/LeadFunnelSection';
import { ContentPerformanceSection } from '@/components/admin/analytics/ContentPerformanceSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BarChart3, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ option: '30d' });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [metrics, setMetrics] = useState<AnalyticsOverviewMetrics>({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    totalEnquiries: 0,
    totalLeads: 0,
    convertedLeads: 0,
    registrationConversionRate: 0,
    leadConversionRate: 0,
  });

  const [regData, setRegData] = useState<RegistrationAnalytics>({
    timeSeries: [],
    byStatus: [],
    byTier: [],
    byEvent: [],
  });

  const [crmData, setCrmData] = useState<CRMAnalytics>({
    funnel: [],
    bySource: [],
    conversionRate: 0,
    averageDealValue: 0,
  });

  const [contentData, setContentData] = useState<ContentAnalytics>({
    topBlogPosts: [],
    topServices: [],
    topEvents: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summary, regs, crm, content] = await Promise.all([
        getAnalyticsSummary(dateRange),
        getRegistrationAnalytics(dateRange),
        getCRMAnalytics(dateRange),
        getContentAnalytics(),
      ]);

      setMetrics(summary);
      setRegData(regs);
      setCrmData(crm);
      setContentData(content);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load analytics data.' });
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportCSV = async (reportType: 'overview' | 'registrations' | 'leads' | 'events') => {
    const csvContent = await exportAnalyticsReportCSV(dateRange, reportType);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mcu-analytics-${reportType}-${dateRange.option}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: `${reportType.toUpperCase()} analytics CSV exported successfully.` });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Business Intelligence & Analytics
            </h1>
            <Badge variant="gold" size="sm">
              Phase 9
            </Badge>
          </div>
          <p className="text-xs text-dark-300">
            Real-time event registration velocity, lead conversion pipelines, and content engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV('overview')}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export Overview CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV('registrations')}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export Regs CSV
          </Button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-dark-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 2. Date Range Filter & Live Timestamp */}
      <AnalyticsDateRangeSelector
        currentFilter={dateRange}
        onChange={(newFilter) => setDateRange(newFilter)}
        lastUpdated={lastUpdated}
        onRefresh={loadData}
        isRefreshing={isLoading}
      />

      {/* 3. KPI Overview Cards */}
      <OverviewMetricsGrid metrics={metrics} />

      {/* 4. Registration Velocity & Leaderboard */}
      <RegistrationAnalyticsSection data={regData} />

      {/* 5. CRM Lead Progression & Sources */}
      <LeadFunnelSection data={crmData} />

      {/* 6. Content & Services Performance */}
      <ContentPerformanceSection data={contentData} />
    </div>
  );
}
