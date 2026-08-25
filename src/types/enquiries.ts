export type EnquiryType = 
  | 'general'
  | 'event'
  | 'exhibitor'
  | 'sponsor'
  | 'partnership'
  | 'digital_marketing'
  | 'social_media';

export type EnquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved' | 'closed' | 'archived';

export interface EnquiryMetadata {
  stallPreference?: string;
  tierPreference?: string;
  partnershipType?: string;
  businessType?: string;
  industry?: string;
  socialMediaPlatforms?: string[];
  budget?: string;
  expectedAttendees?: string;
  monthlyAdSpend?: string;
  targetLocations?: string[];
  sourceUrl?: string;
  [key: string]: any;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  designation?: string;
  subject: string;
  message: string;
  eventId?: string;
  eventName?: string;
  serviceId?: string;
  serviceName?: string;
  status: EnquiryStatus;
  notes?: string;
  adminNotes?: string;
  metadata?: EnquiryMetadata;
  createdAt: string;
  updatedAt?: string;
}

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export interface AdminEnquiryFilters {
  search?: string;
  status?: 'all' | EnquiryStatus;
  type?: 'all' | EnquiryType;
  eventId?: string | 'all';
  dateRange?: 'all' | 'today' | 'last7days' | 'last30days';
  sortBy?: 'createdAt' | 'fullName' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminEnquiryListResponse {
  enquiries: Enquiry[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  stats: EnquiryStats;
}
