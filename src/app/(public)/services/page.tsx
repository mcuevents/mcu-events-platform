import React from 'react';
import { getServices } from '@/services/content.service';
import { ServicesClientWrapper } from '@/components/shared/ServicesClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Event Management Capabilities | MCU Creations',
  description:
    'Explore MCU Creations event management capabilities: thoughtful concept development, venue and vendor coordination, staging, guest experience, and on-ground execution in Coimbatore.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/services'),
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  return <ServicesClientWrapper services={services} />;
}
