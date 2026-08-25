import React from 'react';
import { ContactClientWrapper } from '@/components/shared/ContactClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact Us | MCU (Mentor Crew Units) Creations',
  description:
    'Get in touch with MCU (Mentor Crew Units) Creations for event management, planning, stall bookings, and sponsorships in Coimbatore, Tamil Nadu.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/contact'),
  },
};

export default function ContactPage() {
  return <ContactClientWrapper />;
}
