import { GalleryItem, VideoItem } from '@/types';
import { mockGalleryItems, mockVideoHighlights } from '@/lib/mockData';

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return mockGalleryItems;
}

export async function getVideoHighlights(): Promise<VideoItem[]> {
  return mockVideoHighlights;
}
