import { createClient } from '@/lib/supabase/client';
import { ServiceItem, ServiceItemFormData, AdminServiceFilters } from '@/types/cms';
import { mockServices } from '@/lib/mockData';

export let sessionServices: ServiceItem[] = [...mockServices];

export async function getAdminServices(
  filters?: AdminServiceFilters
): Promise<{ items: ServiceItem[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionServices(filters);
    }

    const items: ServiceItem[] = data.map((d: any) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      shortDescription: d.short_description,
      fullDescription: d.full_description,
      iconName: d.icon_name || 'Briefcase',
      features: Array.isArray(d.features) ? d.features : [],
      category: d.category,
      displayOrder: d.display_order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const filtered = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.fullDescription.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q))
      );
      return { items: filtered, total: filtered.length };
    }

    return { items, total: items.length };
  } catch {
    return getFilteredSessionServices(filters);
  }
}

function getFilteredSessionServices(filters?: AdminServiceFilters): { items: ServiceItem[]; total: number } {
  let filtered = [...sessionServices];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((s) => s.category === filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((s) =>
      filters.status === 'active' ? s.isActive : !s.isActive
    );
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.fullDescription.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  return { items: filtered, total: filtered.length };
}

export async function createService(
  data: ServiceItemFormData
): Promise<{ success: boolean; item?: ServiceItem; error?: string }> {
  try {
    const now = new Date().toISOString();
    const newItem: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    sessionServices.push(newItem);

    const supabase = createClient();
    await supabase.from('services').insert({
      title: data.title,
      slug: data.slug,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      icon_name: data.iconName || 'Briefcase',
      features: data.features || [],
      category: data.category,
      display_order: data.displayOrder || 0,
      is_active: data.isActive ?? true,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create service package.' };
  }
}

export async function updateService(
  id: string,
  data: Partial<ServiceItem>
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();
    const index = sessionServices.findIndex((s) => s.id === id);
    if (index !== -1) {
      sessionServices[index] = {
        ...sessionServices[index],
        ...data,
        updatedAt: now,
      };
    }

    const supabase = createClient();
    await supabase
      .from('services')
      .update({
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.shortDescription !== undefined && { short_description: data.shortDescription }),
        ...(data.fullDescription !== undefined && { full_description: data.fullDescription }),
        ...(data.iconName && { icon_name: data.iconName }),
        ...(data.features !== undefined && { features: data.features }),
        ...(data.category && { category: data.category }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isActive !== undefined && { is_active: data.isActive }),
        updated_at: now,
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update service.' };
  }
}

export async function deleteService(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionServices = sessionServices.filter((s) => s.id !== id);
    const supabase = createClient();
    await supabase.from('services').delete().eq('id', id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete service.' };
  }
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateService(id, { isActive });
}

export async function reorderServices(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    orderedIds.forEach((id, index) => {
      const item = sessionServices.find((s) => s.id === id);
      if (item) item.displayOrder = index + 1;
    });

    const supabase = createClient();
    for (let i = 0; i < orderedIds.length; i++) {
      await supabase.from('services').update({ display_order: i + 1 }).eq('id', orderedIds[i]);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reorder services.' };
  }
}
