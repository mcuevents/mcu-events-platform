import React from 'react';
import { getExhibitors } from '@/services/content.service';
import { ExhibitorsClientWrapper } from '@/components/shared/ExhibitorsClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Exhibitor Packages & Booth Booking | MCU Creations',
  description:
    'Book modular exhibition stalls and custom island pavilions at MCU Creations business expos. Connect with thousands of verified B2B buyers.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/exhibitors'),
  },
};

export default async function ExhibitorsPage() {
  const exhibitors = await getExhibitors();
  return <ExhibitorsClientWrapper exhibitors={exhibitors} />;
}
