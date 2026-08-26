/* ==========================================================================
   PHASE 9 — BUSINESS ANALYTICS & REPORTING CONTRACTS
   ========================================================================== */

export type DateRangeOption = 'today' | '7d' | '30d' | '90d' | 'year' | 'custom';

export interface DateRangeFilter {
  option: DateRangeOption;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsOverviewMetrics {
  totalRegistrations: number;
  confirmedRegistrations: number;
  totalEnquiries: number;
  totalLeads: number;
  convertedLeads: number;
  registrationConversionRate: number;
  leadConversionRate: number;
}

export interface RegistrationTimeSeriesItem {
  date: string;
  count: number;
}

export interface RegistrationAnalytics {
  timeSeries: RegistrationTimeSeriesItem[];
  byStatus: { status: string; count: number; percentage: number }[];
  byTier: { tierName: string; count: number }[];
  byEvent: { eventId: string; eventTitle: string; registrationsCount: number; confirmedCount: number }[];
}

export interface EnquiryAnalytics {
  timeSeries: { date: string; count: number }[];
  byType: { type: string; count: number; percentage: number }[];
  byStatus: { status: string; count: number }[];
}

export interface CRMAnalytics {
  funnel: {
    stage: string;
    count: number;
    dropoffRate?: number;
  }[];
  bySource: { source: string; count: number; percentage: number }[];
  conversionRate: number;
  averageDealValue: number;
}

export interface EventPerformanceItem {
  eventId: string;
  title: string;
  startDate: string;
  city: string;
  registrationsCount: number;
  confirmedCount: number;
  enquiriesCount: number;
  conversionRate: number;
}

export interface ContentAnalytics {
  topBlogPosts: { id: string; title: string; category: string; views: number }[];
  topServices: { id: string; title: string; category: string; enquiriesCount: number }[];
  topEvents: EventPerformanceItem[];
}
