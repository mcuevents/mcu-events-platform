import { EntityPartner, ServiceItem, Testimonial, TeamMember, BlogPost } from '@/types';
import { createClient } from '@/lib/supabase/client';
import {
  mockPartners,
  mockServices,
  mockTestimonials,
  mockTeamMembers,
  mockBlogPosts,
} from '@/lib/mockData';

export async function getPartners(): Promise<EntityPartner[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('category', 'partner')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPartners.filter((p) => p.category === 'partner');
    }
    return data as EntityPartner[];
  } catch {
    return mockPartners.filter((p) => p.category === 'partner');
  }
}

export async function getSponsors(): Promise<EntityPartner[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('category', 'sponsor')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPartners.filter((p) => p.category === 'sponsor');
    }
    return data as EntityPartner[];
  } catch {
    return mockPartners.filter((p) => p.category === 'sponsor');
  }
}

export async function getExhibitors(): Promise<EntityPartner[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('category', 'exhibitor')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPartners.filter((p) => p.category === 'exhibitor');
    }
    return data as EntityPartner[];
  } catch {
    return mockPartners.filter((p) => p.category === 'exhibitor');
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockServices;
    }
    return data as ServiceItem[];
  } catch {
    return mockServices;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockTestimonials;
    }
    return data as Testimonial[];
  } catch {
    return mockTestimonials;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockTeamMembers;
    }
    return data as TeamMember[];
  } catch {
    return mockTeamMembers;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockBlogPosts;
    }
    return data as BlogPost[];
  } catch {
    return mockBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const found = mockBlogPosts.find((b) => b.slug === slug);
      return found || null;
    }
    return data as BlogPost;
  } catch {
    const found = mockBlogPosts.find((b) => b.slug === slug);
    return found || null;
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.slice(0, limit);
}



