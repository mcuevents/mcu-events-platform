import React from 'react';
import { BusinessClientWrapper } from '@/components/shared/BusinessClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'B2B Solutions & Corporate Gateways | MCU Creations',
  description:
    'Explore business opportunities with MCU Creations: Exhibitor booth bookings, Title Sponsorship packages, and Corporate Event production briefs.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/business'),
  },
};

export default function BusinessPage() {
  return <BusinessClientWrapper />;
}
