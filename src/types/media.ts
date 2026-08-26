export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  category?: string;
  eventId?: string;
  eventTitle?: string;
  displayOrder: number;
  isPublished?: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  videoUrl: string; // YouTube, Vimeo, or HTML5 source
  thumbnailUrl?: string;
  platform: 'youtube' | 'vimeo' | 'facebook' | 'instagram' | 'custom';
  category?: string;
  eventId?: string;
  eventTitle?: string;
  displayOrder: number;
  isPublished?: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminMediaFilters {
  search?: string;
  category?: string;
  eventId?: string;
  published?: 'all' | 'published' | 'hidden';
  page?: number;
  limit?: number;
}
