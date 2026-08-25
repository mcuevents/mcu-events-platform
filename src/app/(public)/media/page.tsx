import React from 'react';
import { getVideoHighlights } from '@/services/media.service';
import { MediaClientWrapper } from '@/components/shared/MediaClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Media & Video Highlights | MCU Creations',
  description:
    'Watch official event aftermovies, exhibitor interviews, and keynote stage recordings from MCU Creations expos.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/media'),
  },
};

export default async function MediaPage() {
  const videos = await getVideoHighlights();
  return <MediaClientWrapper videos={videos} />;
}
