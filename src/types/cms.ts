export type ServiceCategory = 'event_management' | 'digital_marketing' | 'social_media' | 'branding';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  email?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  companyName?: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
  displayOrder: number;
  isPublished?: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostFormData = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

export interface AdminBlogFilters {
  search?: string;
  category?: string;
  status?: 'all' | 'published' | 'draft';
  page?: number;
  limit?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  category: ServiceCategory;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ServiceItemFormData = Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface AdminServiceFilters {
  search?: string;
  category?: 'all' | ServiceCategory;
  status?: 'all' | 'active' | 'inactive';
}

export interface SEOConfig {
  pagePath: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
}

export interface AdminCMSFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}
