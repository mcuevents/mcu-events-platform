import { EntityPartner } from './partners';

export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';

export type EventCategory = 
  | 'exhibition'
  | 'conference'
  | 'workshop'
  | 'concert'
  | 'corporate'
  | 'marketing'
  | 'other';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  capacity?: number;
  available: number;
  description?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio?: string;
  avatarUrl: string;
  linkedinUrl?: string;
}

export interface EventFaq {
  question: string;
  answer: string;
}

export interface EventHighlight {
  title: string;
  description: string;
  iconName?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: EventCategory;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  locationName: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  pincode?: string;
  bannerImage: string;
  featuredImage?: string;
  galleryImages?: string[];
  organizerName: string;
  organizerContact: string;
  organizerEmail?: string;
  googleMapsUrl?: string;
  externalRegistrationUrl?: string;
  ticketTypes: TicketType[];
  isFeatured: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  registrationOpen: boolean;
  registrationEnabled?: boolean;
  registrationStartDate?: string;
  registrationEndDate?: string;
  speakers?: EventSpeaker[];
  faqs?: EventFaq[];
  highlights?: EventHighlight[];
  sponsors?: EntityPartner[];
  exhibitors?: EntityPartner[];
  partners?: EntityPartner[];
  registrationCount?: number;
  enquiryCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationType = 'visitor' | 'exhibitor' | 'sponsor' | 'business_enquiry' | 'other';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended';

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle?: string;
  eventSlug?: string;
  eventDate?: string;
  eventVenue?: string;
  ticketTypeId: string;
  ticketTypeName?: string;
  registrationType?: RegistrationType;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  designation?: string;
  attendeesCount: number;
  status: RegistrationStatus;
  totalPrice: number;
  currency?: string;
  referenceCode?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface RegistrationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  attended: number;
}

export interface EventFilters {
  category?: EventCategory | 'all';
  status?: EventStatus | 'all';
  search?: string;
  isFeatured?: boolean;
}

export interface AdminEventFilters {
  search?: string;
  status?: EventStatus | 'all';
  publication?: 'all' | 'published' | 'draft';
  registration?: 'all' | 'open' | 'closed';
  featured?: 'all' | 'featured' | 'not_featured';
  category?: EventCategory | 'all';
  sortBy?: 'startDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminEventListResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export type AdminEventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export interface AdminRegistrationFilters {
  search?: string;
  eventId?: string | 'all';
  status?: 'all' | RegistrationStatus;
  registrationType?: 'all' | RegistrationType;
  dateRange?: 'all' | 'today' | 'last7days' | 'last30days';
  sortBy?: 'createdAt' | 'fullName' | 'status' | 'eventTitle';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminRegistrationListResponse {
  registrations: EventRegistration[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  stats: RegistrationStats;
}
