import React from 'react';
import { getGalleryItems } from '@/services/media.service';
import { GalleryClientWrapper } from '@/components/shared/GalleryClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Event Gallery & Archives | MCU Creations',
  description:
    'Explore high-resolution photography archives capturing memorable moments, stall designs, and award ceremonies at MCU Creations events.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/gallery'),
  },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <GalleryClientWrapper items={items} />;
}
