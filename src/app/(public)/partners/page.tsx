import React from 'react';
import { getPartners } from '@/services/content.service';
import { PartnersClientWrapper } from '@/components/shared/PartnersClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Strategic Partners & Alliances | MCU Creations',
  description:
    'Explore institutional, venue, and media partners collaborating with MCU Creations to deliver landmark conventions.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/partners'),
  },
};

export default async function PartnersPage() {
  const partners = await getPartners();
  return <PartnersClientWrapper partners={partners} />;
}
