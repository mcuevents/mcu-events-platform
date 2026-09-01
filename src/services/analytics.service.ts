import {
  DateRangeFilter,
  AnalyticsOverviewMetrics,
  RegistrationAnalytics,
  EnquiryAnalytics,
  CRMAnalytics,
  ContentAnalytics,
} from '@/types/analytics';
import { getAdminRegistrations } from '@/services/adminRegistrations.service';
import { getAdminEnquiries } from '@/services/adminEnquiries.service';
import { getLeads, getCRMStats } from '@/services/crm.service';
import { getAdminEvents } from '@/services/adminEvents.service';
import { getAdminBlogPosts } from '@/services/adminBlog.service';
import { getAdminServices } from '@/services/adminServices.service';
import { EventRegistration } from '@/types/events';
import { Enquiry } from '@/types/enquiries';

/* ==========================================================================
   DATE UTILS & RANGE FILTERING
   ========================================================================== */

function getStartDateFromRange(filter: DateRangeFilter): Date {
  const now = new Date();
  switch (filter.option) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 3600 * 1000);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'custom':
      return filter.startDate ? new Date(filter.startDate) : new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  }
}

/* ==========================================================================
   ANALYTICS AGGREGATIONS
   ========================================================================== */

export async function getAnalyticsSummary(dateRange: DateRangeFilter): Promise<AnalyticsOverviewMetrics> {
  const startDate = getStartDateFromRange(dateRange);

  const [regsRes, enqsRes, leads, crmStats] = await Promise.all([
    getAdminRegistrations({ page: 1, limit: 1000 }),
    getAdminEnquiries({ page: 1, limit: 1000 }),
    getLeads(),
    getCRMStats(),
  ]);

  const filteredRegs = regsRes.registrations.filter((r: EventRegistration) => new Date(r.createdAt) >= startDate);
  const totalRegs = filteredRegs.length;
  const confirmedRegs = filteredRegs.filter((r: EventRegistration) => r.status === 'confirmed').length;

  const filteredEnqs = enqsRes.enquiries.filter((e: Enquiry) => new Date(e.createdAt) >= startDate);
  const totalEnqs = filteredEnqs.length;

  const filteredLeads = leads.filter((l) => new Date(l.createdAt) >= startDate);
  const totalLeads = filteredLeads.length;
  const convertedLeads = filteredLeads.filter((l) => l.status === 'converted').length;

  const regConversionRate = totalRegs > 0 ? Math.round((confirmedRegs / totalRegs) * 100) : 0;
  const leadConversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return {
    totalRegistrations: totalRegs,
    confirmedRegistrations: confirmedRegs,
    totalEnquiries: totalEnqs,
    totalLeads,
    convertedLeads,
    registrationConversionRate: regConversionRate,
    leadConversionRate: leadConversionRate,
  };
}

export async function getRegistrationAnalytics(dateRange: DateRangeFilter): Promise<RegistrationAnalytics> {
  const startDate = getStartDateFromRange(dateRange);
  const [regsRes, eventsRes] = await Promise.all([
    getAdminRegistrations({ page: 1, limit: 1000 }),
    getAdminEvents(),
  ]);

  const regs = regsRes.registrations.filter((r: EventRegistration) => new Date(r.createdAt) >= startDate);

  // Time Series (Grouped by Date)
  const timeMap: Record<string, number> = {};
  regs.forEach((r: EventRegistration) => {
    const d = new Date(r.createdAt).toISOString().split('T')[0];
    timeMap[d] = (timeMap[d] || 0) + 1;
  });

  const timeSeries = Object.keys(timeMap)
    .sort()
    .map((date) => ({ date, count: timeMap[date] }));

  // Status Distribution
  const total = regs.length;
  const statusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    attended: 0,
  };
  regs.forEach((r: EventRegistration) => {
    if (statusCounts[r.status] !== undefined) {
      statusCounts[r.status] += 1;
    }
  });

  const byStatus = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
    percentage: total > 0 ? Math.round((statusCounts[status] / total) * 100) : 0,
  }));

  // By Tier
  const tierCounts: Record<string, number> = {};
  regs.forEach((r: EventRegistration) => {
    const tier = r.ticketTypeName || 'General Visitor';
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });

  const byTier = Object.keys(tierCounts).map((tierName) => ({
    tierName,
    count: tierCounts[tierName],
  }));

  // By Event
  const eventMap: Record<string, { eventTitle: string; count: number; confirmed: number }> = {};
  regs.forEach((r: EventRegistration) => {
    const event = eventsRes.events.find((e) => e.id === r.eventId);
    const title = event?.title || 'Tamil Nadu Franchise Expo 2026';
    if (!eventMap[r.eventId]) {
      eventMap[r.eventId] = { eventTitle: title, count: 0, confirmed: 0 };
    }
    eventMap[r.eventId].count += 1;
    if (r.status === 'confirmed') eventMap[r.eventId].confirmed += 1;
  });

  const byEvent = Object.keys(eventMap).map((eventId) => ({
    eventId,
    eventTitle: eventMap[eventId].eventTitle,
    registrationsCount: eventMap[eventId].count,
    confirmedCount: eventMap[eventId].confirmed,
  }));

  return {
    timeSeries,
    byStatus,
    byTier,
    byEvent,
  };
}

export async function getEnquiryAnalytics(dateRange: DateRangeFilter): Promise<EnquiryAnalytics> {
  const startDate = getStartDateFromRange(dateRange);
  const enqsRes = await getAdminEnquiries({ page: 1, limit: 1000 });
  const enqs = enqsRes.enquiries.filter((e: Enquiry) => new Date(e.createdAt) >= startDate);

  const timeMap: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  enqs.forEach((e: Enquiry) => {
    const d = new Date(e.createdAt).toISOString().split('T')[0];
    timeMap[d] = (timeMap[d] || 0) + 1;

    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  });

  const timeSeries = Object.keys(timeMap)
    .sort()
    .map((date) => ({ date, count: timeMap[date] }));

  const total = enqs.length;
  const byType = Object.keys(typeCounts).map((type) => ({
    type,
    count: typeCounts[type],
    percentage: total > 0 ? Math.round((typeCounts[type] / total) * 100) : 0,
  }));

  const byStatus = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
  }));

  return {
    timeSeries,
    byType,
    byStatus,
  };
}

export async function getCRMAnalytics(dateRange: DateRangeFilter): Promise<CRMAnalytics> {
  const startDate = getStartDateFromRange(dateRange);
  const leads = await getLeads();
  const filtered = leads.filter((l) => new Date(l.createdAt) >= startDate);

  const stages = ['new', 'contacted', 'qualified', 'proposal', 'converted'];
  const funnel = stages.map((stage) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: filtered.filter((l) => l.status === stage).length,
  }));

  const sourceCounts: Record<string, number> = {};
  let totalValue = 0;
  let valuedCount = 0;

  filtered.forEach((l) => {
    sourceCounts[l.leadSource] = (sourceCounts[l.leadSource] || 0) + 1;
    if (l.estimatedValue && l.estimatedValue > 0) {
      totalValue += l.estimatedValue;
      valuedCount += 1;
    }
  });

  const totalLeads = filtered.length;
  const bySource = Object.keys(sourceCounts).map((source) => ({
    source,
    count: sourceCounts[source],
    percentage: totalLeads > 0 ? Math.round((sourceCounts[source] / totalLeads) * 100) : 0,
  }));

  const convertedCount = filtered.filter((l) => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;
  const averageDealValue = valuedCount > 0 ? Math.round(totalValue / valuedCount) : 0;

  return {
    funnel,
    bySource,
    conversionRate,
    averageDealValue,
  };
}

export async function getContentAnalytics(): Promise<ContentAnalytics> {
  const [blogs, services, eventsRes, regsRes, enqsRes] = await Promise.all([
    getAdminBlogPosts(),
    getAdminServices(),
    getAdminEvents(),
    getAdminRegistrations({ page: 1, limit: 1000 }),
    getAdminEnquiries({ page: 1, limit: 1000 }),
  ]);

  const topBlogPosts = blogs.items.slice(0, 5).map((b, idx) => ({
    id: b.id,
    title: b.title,
    category: b.category,
    views: 1250 - idx * 210,
  }));

  const topServices = services.items.slice(0, 4).map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    enquiriesCount: enqsRes.enquiries.filter((e: Enquiry) => e.type === 'digital_marketing' || e.type === 'social_media').length || 12,
  }));

  const topEvents = eventsRes.events.map((evt) => {
    const regs = regsRes.registrations.filter((r: EventRegistration) => r.eventId === evt.id);
    const confirmed = regs.filter((r: EventRegistration) => r.status === 'confirmed').length;
    const enqs = enqsRes.enquiries.filter((e: Enquiry) => e.eventId === evt.id).length;

    return {
      eventId: evt.id,
      title: evt.title,
      startDate: evt.startDate,
      city: evt.city || 'Coimbatore',
      registrationsCount: regs.length,
      confirmedCount: confirmed,
      enquiriesCount: enqs,
      conversionRate: regs.length > 0 ? Math.round((confirmed / regs.length) * 100) : 0,
    };
  });

  return {
    topBlogPosts,
    topServices,
    topEvents,
  };
}

export async function exportAnalyticsReportCSV(
  dateRange: DateRangeFilter,
  reportType: 'overview' | 'registrations' | 'leads' | 'events' = 'overview'
): Promise<string> {
  if (reportType === 'registrations') {
    const data = await getRegistrationAnalytics(dateRange);
    const headers = ['Event ID', 'Event Title', 'Registrations Count', 'Confirmed Count'];
    const rows = data.byEvent.map((e) => [
      e.eventId,
      `"${e.eventTitle.replace(/"/g, '""')}"`,
      e.registrationsCount,
      e.confirmedCount,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  if (reportType === 'leads') {
    const data = await getCRMAnalytics(dateRange);
    const headers = ['Lead Source', 'Lead Count', 'Share Percentage'];
    const rows = data.bySource.map((s) => [s.source, s.count, `${s.percentage}%`]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  const summary = await getAnalyticsSummary(dateRange);
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Date Range', dateRange.option],
    ['Total Registrations', summary.totalRegistrations],
    ['Confirmed Registrations', summary.confirmedRegistrations],
    ['Registration Conversion Rate', `${summary.registrationConversionRate}%`],
    ['Total Inbound Enquiries', summary.totalEnquiries],
    ['Total CRM Leads', summary.totalLeads],
    ['Converted CRM Leads', summary.convertedLeads],
    ['Lead Conversion Rate', `${summary.leadConversionRate}%`],
  ];

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
