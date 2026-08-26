import { EntityPartner, ServiceItem, Testimonial, TeamMember, BlogPost } from '@/types';
import {
  mockPartners,
  mockServices,
  mockTestimonials,
  mockTeamMembers,
  mockBlogPosts,
} from '@/lib/mockData';

export async function getPartners(): Promise<EntityPartner[]> {
  return mockPartners.filter((p) => p.category === 'partner');
}

export async function getSponsors(): Promise<EntityPartner[]> {
  return mockPartners.filter((p) => p.category === 'sponsor');
}

export async function getExhibitors(): Promise<EntityPartner[]> {
  return mockPartners.filter((p) => p.category === 'exhibitor');
}

export async function getServices(): Promise<ServiceItem[]> {
  return mockServices;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return mockTestimonials;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return mockTeamMembers;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return mockBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const found = mockBlogPosts.find((b) => b.slug === slug);
  return found || null;
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.slice(0, limit);
}
