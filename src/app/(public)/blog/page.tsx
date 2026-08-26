import React from 'react';
import { getBlogPosts } from '@/services/content.service';
import { BlogClientWrapper } from '@/components/shared/BlogClientWrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Event & Marketing Insights Blog | MCU Creations',
  description:
    'Actionable playbooks on event logistics, exhibitor lead generation, social media algorithms, and franchise growth from the experts at MCU Creations.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/blog'),
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogClientWrapper posts={posts} />;
}
