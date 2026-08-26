import { RegistrationType } from '@/types/events';

export interface SubmitEnquiryInput {
  type: 'general' | 'event' | 'exhibitor' | 'sponsor' | 'partnership' | 'digital_marketing' | 'social_media';
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
  metadata?: Record<string, any>;
  hp_field?: string;
}

export interface SubmitRegistrationInput {
  eventId: string;
  ticketTypeId: string;
  registrationType?: RegistrationType;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  designation?: string;
  attendeesCount: number;
  notes?: string;
  hp_field?: string;
}

/**
 * No backend is wired up — this site has no database to persist submissions to.
 * Forms simply resolve with a generated reference id so the UI can show its
 * success state; wire this up to a real endpoint/email service to go live.
 */
export async function submitEnquiry(input: SubmitEnquiryInput): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  return {
    success: true,
    id: `req-${Date.now()}`,
  };
}

export async function submitEventRegistration(input: SubmitRegistrationInput): Promise<{
  success: boolean;
  registrationId?: string;
  referenceCode?: string;
  isDuplicate?: boolean;
  error?: string;
}> {
  return {
    success: true,
    registrationId: `reg-${Date.now()}`,
    referenceCode: `MCU-${Math.floor(100000 + Math.random() * 900000)}`,
  };
}
