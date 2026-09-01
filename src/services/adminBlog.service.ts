import { createClient } from '@/lib/supabase/client';
import { BlogPost, BlogPostFormData, AdminBlogFilters } from '@/types/cms';
import { mockBlogPosts } from '@/lib/mockData';

export let sessionBlogPosts: BlogPost[] = [...mockBlogPosts];

export async function getAdminBlogPosts(
  filters?: AdminBlogFilters
): Promise<{ items: BlogPost[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_published', filters.status === 'published');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionBlogPosts(filters);
    }

    const items: BlogPost[] = data.map((d: any) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      content: d.content,
      coverImage: d.cover_image,
      authorName: d.author_name,
      authorAvatar: d.author_avatar,
      category: d.category,
      tags: Array.isArray(d.tags) ? d.tags : [],
      isPublished: d.is_published,
      publishedAt: d.published_at,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const filtered = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
      return { items: filtered, total: filtered.length };
    }

    return { items, total: items.length };
  } catch {
    return getFilteredSessionBlogPosts(filters);
  }
}

function getFilteredSessionBlogPosts(filters?: AdminBlogFilters): { items: BlogPost[]; total: number } {
  let filtered = [...sessionBlogPosts];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((p) =>
      filters.status === 'published' ? p.isPublished : !p.isPublished
    );
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { items: filtered, total: filtered.length };
}

export async function getAdminBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error || !data) {
      return sessionBlogPosts.find((p) => p.id === id) || null;
    }
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.cover_image,
      authorName: data.author_name,
      authorAvatar: data.author_avatar,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      isPublished: data.is_published,
      publishedAt: data.published_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return sessionBlogPosts.find((p) => p.id === id) || null;
  }
}

export async function createBlogPost(
  data: BlogPostFormData
): Promise<{ success: boolean; item?: BlogPost; error?: string }> {
  try {
    const now = new Date().toISOString();
    const newItem: BlogPost = {
      ...data,
      id: `post-${Date.now()}`,
      publishedAt: data.isPublished ? (data.publishedAt || now) : undefined,
      createdAt: now,
      updatedAt: now,
    };

    sessionBlogPosts.unshift(newItem);

    const supabase = createClient();
    await supabase.from('blog_posts').insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.coverImage,
      author_name: data.authorName,
      author_avatar: data.authorAvatar || null,
      category: data.category,
      tags: data.tags || [],
      is_published: data.isPublished,
      published_at: data.isPublished ? (data.publishedAt || now) : null,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create blog article.' };
  }
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();
    const index = sessionBlogPosts.findIndex((p) => p.id === id);
    if (index !== -1) {
      sessionBlogPosts[index] = {
        ...sessionBlogPosts[index],
        ...data,
        updatedAt: now,
      };
    }

    const supabase = createClient();
    await supabase
      .from('blog_posts')
      .update({
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content && { content: data.content }),
        ...(data.coverImage && { cover_image: data.coverImage }),
        ...(data.authorName && { author_name: data.authorName }),
        ...(data.authorAvatar !== undefined && { author_avatar: data.authorAvatar }),
        ...(data.category && { category: data.category }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.isPublished !== undefined && { is_published: data.isPublished }),
        ...(data.publishedAt !== undefined && { published_at: data.publishedAt }),
        updated_at: now,
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update blog article.' };
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionBlogPosts = sessionBlogPosts.filter((p) => p.id !== id);
    const supabase = createClient();
    await supabase.from('blog_posts').delete().eq('id', id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete blog article.' };
  }
}

export async function togglePublishBlogPost(
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  return updateBlogPost(id, {
    isPublished,
    publishedAt: isPublished ? now : undefined,
  });
}
