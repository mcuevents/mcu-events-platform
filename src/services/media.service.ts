import { GalleryItem, VideoItem } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { mockGalleryItems, mockVideoHighlights } from '@/lib/mockData';

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockGalleryItems;
    }
    return data as GalleryItem[];
  } catch {
    return mockGalleryItems;
  }
}

export async function getVideoHighlights(): Promise<VideoItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('video_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockVideoHighlights;
    }
    return data as VideoItem[];
  } catch {
    return mockVideoHighlights;
  }
}
