import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getEvents } from '@/services/events.service';
import { getBlogPosts } from '@/services/content.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Base public static routes for MCU Creations
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic Event detail pages
  try {
    const events = await getEvents();
    const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt || event.createdAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
    staticRoutes.push(...eventRoutes);
  } catch {
    // Graceful fallback if data fetch fails during build
  }

  // Dynamic Blog post pages
  try {
    const blogPosts = await getBlogPosts();
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || post.createdAt || new Date()),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));
    staticRoutes.push(...blogRoutes);
  } catch {
    // Graceful fallback
  }

  return staticRoutes;
}
