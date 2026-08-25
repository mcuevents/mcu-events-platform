import { z } from 'zod';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/;

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address').max(150, 'Email is too long'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number (e.g. +91 98765 43210)'),
  subject: z.string().min(3, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  companyName: z.string().max(150, 'Company name is too long').optional(),
  hp_field: z.string().max(0, 'Spam detected').optional().or(z.literal('')), // Honeypot
});

export const enquiryFormSchema = z.object({
  type: z.enum([
    'general',
    'event',
    'exhibitor',
    'sponsor',
    'partnership',
    'digital_marketing',
    'social_media',
  ]),
  fullName: z.string().min(2, 'Full name is required (min 2 chars)').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address').max(150, 'Email is too long'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  companyName: z.string().max(150).optional().or(z.literal('')),
  designation: z.string().max(100).optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000, 'Message cannot exceed 3000 characters'),
  eventId: z.string().optional().or(z.literal('')),
  eventName: z.string().optional().or(z.literal('')),
  serviceId: z.string().optional().or(z.literal('')),
  serviceName: z.string().optional().or(z.literal('')),
  metadata: z.record(z.any()).optional(),
  hp_field: z.string().max(0, 'Spam detected').optional().or(z.literal('')), // Honeypot
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  ticketTypeId: z.string().min(1, 'Ticket selection is required'),
  registrationType: z.enum(['visitor', 'exhibitor', 'sponsor', 'business_enquiry', 'other']).default('visitor'),
  fullName: z.string().min(2, 'Full name is required (min 2 chars)').max(100),
  email: z.string().email('Valid email is required').max(150),
  phone: z.string().regex(phoneRegex, 'Valid 10+ digit phone/WhatsApp number is required'),
  companyName: z.string().max(150).optional().or(z.literal('')),
  designation: z.string().max(100).optional().or(z.literal('')),
  attendeesCount: z.number().int().min(1, 'At least 1 delegate pass is required').max(20, 'Maximum 20 passes per single registration'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional().or(z.literal('')),
  hp_field: z.string().max(0, 'Spam detected').optional().or(z.literal('')), // Honeypot
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200, 'Slug is too long').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  description: z.string().min(10, 'Short description must be at least 10 characters').max(1000, 'Short description is too long'),
  content: z.string().optional().or(z.literal('')),
  category: z.enum([
    'exhibition',
    'conference',
    'workshop',
    'concert',
    'corporate',
    'marketing',
    'other',
  ]),
  status: z.enum(['draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'postponed']).default('upcoming'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().optional().or(z.literal('')),
  endTime: z.string().optional().or(z.literal('')),
  locationName: z.string().min(2, 'Venue name is required').max(200),
  address: z.string().min(3, 'Address is required').max(300),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  pincode: z.string().max(20).optional().or(z.literal('')),
  bannerImage: z.string().min(1, 'Hero banner image is required'),
  featuredImage: z.string().optional().or(z.literal('')),
  organizerName: z.string().min(2, 'Organizer name is required').default('MCU Creations'),
  organizerContact: z.string().min(5, 'Organizer contact is required').default('+91 98421 12345'),
  organizerEmail: z.string().email().optional().or(z.literal('')),
  googleMapsUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  externalRegistrationUrl: z.string().url('Must be a valid URL (https://...)').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  registrationOpen: z.boolean().default(true),
  registrationEnabled: z.boolean().default(true),
  registrationStartDate: z.string().optional().or(z.literal('')),
  registrationEndDate: z.string().optional().or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type EnquiryFormData = z.infer<typeof enquiryFormSchema>;
export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
