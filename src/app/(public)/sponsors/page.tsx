import React from 'react';
import { getSponsors } from '@/services/content.service';
import { SponsorsClientWrapper } from '@/components/shared/SponsorsClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Corporate Sponsorship Packages | MCU Creations',
  description:
    'Amplify brand visibility with Title Platinum, Gold Associate, and Silver sponsorship opportunities across high-traffic MCU Creations business expos.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/sponsors'),
  },
};

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  return <SponsorsClientWrapper sponsors={sponsors} />;
}
