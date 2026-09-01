import { createClient } from '@/lib/supabase/client';
import { GalleryItem, VideoItem, AdminMediaFilters } from '@/types/media';
import { mockGalleryItems, mockVideoHighlights } from '@/lib/mockData';
import { sessionEvents } from './adminEvents.service';

export let sessionGallery: GalleryItem[] = mockGalleryItems.map((g) => ({
  ...g,
  isPublished: g.isPublished ?? true,
}));

export let sessionVideos: VideoItem[] = mockVideoHighlights.map((v) => ({
  ...v,
  isPublished: v.isPublished ?? true,
}));

/**
 * Validates external video URLs to prevent javascript: or data: injection.
 */
export function validateVideoUrl(url: string): { isValid: boolean; platform: 'youtube' | 'vimeo' | 'custom'; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, platform: 'custom', error: 'Video URL is required.' };
  }

  const trimmed = url.trim();
  if (!trimmed.startsWith('https://')) {
    return { isValid: false, platform: 'custom', error: 'Only secure HTTPS video URLs are permitted.' };
  }

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return { isValid: true, platform: 'youtube' };
  }

  if (trimmed.includes('vimeo.com')) {
    return { isValid: true, platform: 'vimeo' };
  }

  return { isValid: true, platform: 'custom' };
}

/**
 * Transforms standard video URLs into safe embed URLs.
 */
export function getSafeEmbedUrl(url: string, platform: string): string {
  try {
    if (platform === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      if (url.includes('embed/')) return url;
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
      if (!videoId && url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
    }

    if (platform === 'vimeo' || url.includes('vimeo.com')) {
      if (url.includes('player.vimeo.com/video/')) return url;
      const parts = url.split('/');
      const videoId = parts[parts.length - 1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    return url;
  } catch {
    return url;
  }
}

/* ==========================================================================
   GALLERY OPERATIONS
   ========================================================================== */

export async function getAdminGallery(filters?: AdminMediaFilters): Promise<{ items: GalleryItem[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase.from('gallery_items').select('*, events(title)').order('display_order', { ascending: true });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.eventId && filters.eventId !== 'all') {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.published && filters.published !== 'all') {
      query = query.eq('is_published', filters.published === 'published');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionGallery(filters);
    }

    const items: GalleryItem[] = data.map((d: any) => ({
      id: d.id,
      title: d.title,
      caption: d.caption,
      imageUrl: d.image_url,
      thumbnailUrl: d.thumbnail_url,
      altText: d.alt_text,
      category: d.category,
      eventId: d.event_id,
      eventTitle: d.events?.title,
      displayOrder: d.display_order,
      isPublished: d.is_published,
      isFeatured: d.is_featured,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    return { items, total: items.length };
  } catch {
    return getFilteredSessionGallery(filters);
  }
}

function getFilteredSessionGallery(filters?: AdminMediaFilters): { items: GalleryItem[]; total: number } {
  let filtered = [...sessionGallery];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((g) => g.category === filters.category);
  }
  if (filters?.eventId && filters.eventId !== 'all') {
    filtered = filtered.filter((g) => g.eventId === filters.eventId);
  }
  if (filters?.published && filters.published !== 'all') {
    filtered = filtered.filter((g) => (filters.published === 'published' ? g.isPublished : !g.isPublished));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (g) => g.title.toLowerCase().includes(q) || (g.caption && g.caption.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => a.displayOrder - b.displayOrder);

  const items = filtered.map((g) => {
    const matchedEvent = sessionEvents.find((e) => e.id === g.eventId);
    return {
      ...g,
      eventTitle: g.eventTitle || matchedEvent?.title,
    };
  });

  return { items, total: items.length };
}

export async function createGalleryItem(
  data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; item?: GalleryItem; error?: string }> {
  try {
    const newItem: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessionGallery.push(newItem);

    const supabase = createClient();
    await supabase.from('gallery_items').insert({
      title: data.title,
      caption: data.caption,
      image_url: data.imageUrl,
      thumbnail_url: data.thumbnailUrl || data.imageUrl,
      alt_text: data.altText,
      category: data.category || 'events',
      event_id: data.eventId || null,
      display_order: data.displayOrder || 0,
      is_published: data.isPublished ?? true,
      is_featured: data.isFeatured ?? false,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create gallery item.' };
  }
}

export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItem>
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionGallery.findIndex((g) => g.id === id);
    if (index !== -1) {
      sessionGallery[index] = {
        ...sessionGallery[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('gallery_items')
      .update({
        ...(data.title && { title: data.title }),
        ...(data.caption !== undefined && { caption: data.caption }),
        ...(data.imageUrl && { image_url: data.imageUrl, thumbnail_url: data.thumbnailUrl || data.imageUrl }),
        ...(data.altText !== undefined && { alt_text: data.altText }),
        ...(data.category && { category: data.category }),
        ...(data.eventId !== undefined && { event_id: data.eventId || null }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isPublished !== undefined && { is_published: data.isPublished }),
        ...(data.isFeatured !== undefined && { is_featured: data.isFeatured }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update gallery item.' };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionGallery = sessionGallery.filter((g) => g.id !== id);

    const supabase = createClient();
    await supabase.from('gallery_items').delete().eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete gallery item.' };
  }
}

/* ==========================================================================
   VIDEO OPERATIONS
   ========================================================================== */

export async function getAdminVideos(filters?: AdminMediaFilters): Promise<{ items: VideoItem[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase.from('video_items').select('*, events(title)').order('display_order', { ascending: true });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.eventId && filters.eventId !== 'all') {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.published && filters.published !== 'all') {
      query = query.eq('is_published', filters.published === 'published');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionVideos(filters);
    }

    const items: VideoItem[] = data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      videoUrl: d.video_url,
      thumbnailUrl: d.thumbnail_url,
      platform: d.platform,
      category: d.category,
      eventId: d.event_id,
      eventTitle: d.events?.title,
      displayOrder: d.display_order,
      isPublished: d.is_published,
      isFeatured: d.is_featured,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    return { items, total: items.length };
  } catch {
    return getFilteredSessionVideos(filters);
  }
}

function getFilteredSessionVideos(filters?: AdminMediaFilters): { items: VideoItem[]; total: number } {
  let filtered = [...sessionVideos];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((v) => v.category === filters.category);
  }
  if (filters?.eventId && filters.eventId !== 'all') {
    filtered = filtered.filter((v) => v.eventId === filters.eventId);
  }
  if (filters?.published && filters.published !== 'all') {
    filtered = filtered.filter((v) => (filters.published === 'published' ? v.isPublished : !v.isPublished));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (v) => v.title.toLowerCase().includes(q) || (v.description && v.description.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => a.displayOrder - b.displayOrder);

  const items = filtered.map((v) => {
    const matchedEvent = sessionEvents.find((e) => e.id === v.eventId);
    return {
      ...v,
      eventTitle: v.eventTitle || matchedEvent?.title,
    };
  });

  return { items, total: items.length };
}

export async function createVideoItem(
  data: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; item?: VideoItem; error?: string }> {
  const validation = validateVideoUrl(data.videoUrl);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const newItem: VideoItem = {
      ...data,
      id: `vid-${Date.now()}`,
      platform: validation.platform,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessionVideos.push(newItem);

    const supabase = createClient();
    await supabase.from('video_items').insert({
      title: data.title,
      description: data.description,
      video_url: data.videoUrl,
      thumbnail_url: data.thumbnailUrl,
      platform: validation.platform,
      category: data.category || 'events',
      event_id: data.eventId || null,
      display_order: data.displayOrder || 0,
      is_published: data.isPublished ?? true,
      is_featured: data.isFeatured ?? false,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create video entry.' };
  }
}

export async function updateVideoItem(
  id: string,
  data: Partial<VideoItem>
): Promise<{ success: boolean; error?: string }> {
  if (data.videoUrl) {
    const validation = validateVideoUrl(data.videoUrl);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
  }

  try {
    const index = sessionVideos.findIndex((v) => v.id === id);
    if (index !== -1) {
      sessionVideos[index] = {
        ...sessionVideos[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('video_items')
      .update({
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.videoUrl && { video_url: data.videoUrl }),
        ...(data.thumbnailUrl && { thumbnail_url: data.thumbnailUrl }),
        ...(data.platform && { platform: data.platform }),
        ...(data.category && { category: data.category }),
        ...(data.eventId !== undefined && { event_id: data.eventId || null }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isPublished !== undefined && { is_published: data.isPublished }),
        ...(data.isFeatured !== undefined && { is_featured: data.isFeatured }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update video entry.' };
  }
}

export async function deleteVideoItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionVideos = sessionVideos.filter((v) => v.id !== id);

    const supabase = createClient();
    await supabase.from('video_items').delete().eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete video entry.' };
  }
}
