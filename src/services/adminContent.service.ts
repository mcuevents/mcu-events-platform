import { createClient } from '@/lib/supabase/client';
import { EntityPartner, AdminPartnerFilters } from '@/types/partners';
import { TeamMember, Testimonial, AdminCMSFilters } from '@/types/cms';
import { mockPartners, mockTeamMembers, mockTestimonials } from '@/lib/mockData';
import { sessionEvents } from './adminEvents.service';

export let sessionPartners: EntityPartner[] = [...mockPartners];
export let sessionTeam: TeamMember[] = [...mockTeamMembers];
export let sessionTestimonials: Testimonial[] = [...mockTestimonials];

/* ==========================================================================
   PARTNERS, SPONSORS & EXHIBITORS (ENTITY PARTNERS)
   ========================================================================== */

export async function getAdminPartners(
  filters?: AdminPartnerFilters
): Promise<{ items: EntityPartner[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase.from('partners').select('*, events(title)').order('display_order', { ascending: true });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.tier && filters.tier !== 'all') {
      query = query.eq('tier', filters.tier);
    }
    if (filters?.eventId && filters.eventId !== 'all') {
      query = query.eq('event_id', filters.eventId);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFilteredSessionPartners(filters);
    }

    const items: EntityPartner[] = data.map((d: any) => ({
      id: d.id,
      category: d.category,
      name: d.name,
      logoUrl: d.logo_url,
      websiteUrl: d.website_url,
      description: d.description,
      tier: d.tier,
      contactPerson: d.contact_person,
      contactEmail: d.contact_email,
      contactPhone: d.contact_phone,
      boothNumber: d.booth_number,
      eventId: d.event_id,
      eventTitle: d.events?.title,
      displayOrder: d.display_order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    return { items, total: items.length };
  } catch {
    return getFilteredSessionPartners(filters);
  }
}

function getFilteredSessionPartners(filters?: AdminPartnerFilters): { items: EntityPartner[]; total: number } {
  let filtered = [...sessionPartners];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }
  if (filters?.tier && filters.tier !== 'all') {
    filtered = filtered.filter((p) => p.tier === filters.tier);
  }
  if (filters?.eventId && filters.eventId !== 'all') {
    filtered = filtered.filter((p) => p.eventId === filters.eventId);
  }
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((p) => (filters.status === 'active' ? p.isActive : !p.isActive));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.contactPerson && p.contactPerson.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => a.displayOrder - b.displayOrder);

  const items = filtered.map((p) => {
    const matchedEvent = sessionEvents.find((e) => e.id === p.eventId);
    return {
      ...p,
      eventTitle: p.eventTitle || matchedEvent?.title,
    };
  });

  return { items, total: items.length };
}

export async function createPartner(
  data: Omit<EntityPartner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; item?: EntityPartner; error?: string }> {
  try {
    const newItem: EntityPartner = {
      ...data,
      id: `pt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessionPartners.push(newItem);

    const supabase = createClient();
    await supabase.from('partners').insert({
      category: data.category,
      name: data.name,
      logo_url: data.logoUrl,
      website_url: data.websiteUrl,
      description: data.description,
      tier: data.tier,
      contact_person: data.contactPerson,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      booth_number: data.boothNumber,
      event_id: data.eventId || null,
      display_order: data.displayOrder || 0,
      is_active: data.isActive ?? true,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create partner.' };
  }
}

export async function updatePartner(
  id: string,
  data: Partial<EntityPartner>
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionPartners.findIndex((p) => p.id === id);
    if (index !== -1) {
      sessionPartners[index] = {
        ...sessionPartners[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    const supabase = createClient();
    await supabase
      .from('partners')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category }),
        ...(data.logoUrl && { logo_url: data.logoUrl }),
        ...(data.websiteUrl !== undefined && { website_url: data.websiteUrl }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.tier && { tier: data.tier }),
        ...(data.contactPerson !== undefined && { contact_person: data.contactPerson }),
        ...(data.contactEmail !== undefined && { contact_email: data.contactEmail }),
        ...(data.contactPhone !== undefined && { contact_phone: data.contactPhone }),
        ...(data.boothNumber !== undefined && { booth_number: data.boothNumber }),
        ...(data.eventId !== undefined && { event_id: data.eventId || null }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isActive !== undefined && { is_active: data.isActive }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update partner.' };
  }
}

export async function deletePartner(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionPartners = sessionPartners.filter((p) => p.id !== id);
    const supabase = createClient();
    await supabase.from('partners').delete().eq('id', id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete partner.' };
  }
}

/* ==========================================================================
   TEAM MEMBERS
   ========================================================================== */

export async function getAdminTeam(
  filters?: AdminCMSFilters
): Promise<{ items: TeamMember[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase.from('team_members').select('*').order('display_order', { ascending: true });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFilteredSessionTeam(filters);
    }

    const items: TeamMember[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      role: d.role,
      bio: d.bio,
      imageUrl: d.image_url,
      email: d.email,
      linkedinUrl: d.linkedin_url,
      instagramUrl: d.instagram_url,
      displayOrder: d.display_order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    return { items, total: items.length };
  } catch {
    return getFilteredSessionTeam(filters);
  }
}

function getFilteredSessionTeam(filters?: AdminCMSFilters): { items: TeamMember[]; total: number } {
  let filtered = [...sessionTeam];
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((t) => (filters.status === 'active' ? t.isActive : !t.isActive));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q));
  }
  filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  return { items: filtered, total: filtered.length };
}

export async function createTeamMember(
  data: Omit<TeamMember, 'id'>
): Promise<{ success: boolean; item?: TeamMember; error?: string }> {
  try {
    const newItem: TeamMember = {
      ...data,
      id: `tm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessionTeam.push(newItem);

    const supabase = createClient();
    await supabase.from('team_members').insert({
      name: data.name,
      role: data.role,
      bio: data.bio,
      image_url: data.imageUrl,
      email: data.email,
      linkedin_url: data.linkedinUrl,
      instagram_url: data.instagramUrl,
      display_order: data.displayOrder || 0,
      is_active: data.isActive ?? true,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create team member.' };
  }
}

export async function updateTeamMember(
  id: string,
  data: Partial<TeamMember>
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionTeam.findIndex((t) => t.id === id);
    if (index !== -1) {
      sessionTeam[index] = { ...sessionTeam[index], ...data, updatedAt: new Date().toISOString() };
    }

    const supabase = createClient();
    await supabase
      .from('team_members')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.role && { role: data.role }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.imageUrl && { image_url: data.imageUrl }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.linkedinUrl !== undefined && { linkedin_url: data.linkedinUrl }),
        ...(data.instagramUrl !== undefined && { instagram_url: data.instagramUrl }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isActive !== undefined && { is_active: data.isActive }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update team member.' };
  }
}

export async function deleteTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionTeam = sessionTeam.filter((t) => t.id !== id);
    const supabase = createClient();
    await supabase.from('team_members').delete().eq('id', id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete team member.' };
  }
}

/* ==========================================================================
   TESTIMONIALS
   ========================================================================== */

export async function getAdminTestimonials(
  filters?: AdminCMSFilters
): Promise<{ items: Testimonial[]; total: number }> {
  try {
    const supabase = createClient();
    let query = supabase.from('testimonials').select('*').order('display_order', { ascending: true });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('is_published', filters.status === 'active');
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFilteredSessionTestimonials(filters);
    }

    const items: Testimonial[] = data.map((d: any) => ({
      id: d.id,
      clientName: d.client_name,
      clientTitle: d.client_title,
      companyName: d.company_name,
      content: d.content,
      rating: d.rating,
      avatarUrl: d.avatar_url,
      displayOrder: d.display_order,
      isPublished: d.is_published,
      isFeatured: d.is_featured,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));

    return { items, total: items.length };
  } catch {
    return getFilteredSessionTestimonials(filters);
  }
}

function getFilteredSessionTestimonials(filters?: AdminCMSFilters): { items: Testimonial[]; total: number } {
  let filtered = [...sessionTestimonials];
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((t) => (filters.status === 'active' ? t.isPublished !== false : t.isPublished === false));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.clientName.toLowerCase().includes(q) ||
        (t.companyName && t.companyName.toLowerCase().includes(q)) ||
        t.content.toLowerCase().includes(q)
    );
  }
  filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  return { items: filtered, total: filtered.length };
}

export async function createTestimonial(
  data: Omit<Testimonial, 'id'>
): Promise<{ success: boolean; item?: Testimonial; error?: string }> {
  try {
    const newItem: Testimonial = {
      ...data,
      id: `tst-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessionTestimonials.push(newItem);

    const supabase = createClient();
    await supabase.from('testimonials').insert({
      client_name: data.clientName,
      client_title: data.clientTitle,
      company_name: data.companyName,
      content: data.content,
      rating: data.rating || 5,
      avatar_url: data.avatarUrl,
      display_order: data.displayOrder || 0,
      is_published: data.isPublished ?? true,
      is_featured: data.isFeatured ?? false,
    });

    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create testimonial.' };
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = sessionTestimonials.findIndex((t) => t.id === id);
    if (index !== -1) {
      sessionTestimonials[index] = { ...sessionTestimonials[index], ...data, updatedAt: new Date().toISOString() };
    }

    const supabase = createClient();
    await supabase
      .from('testimonials')
      .update({
        ...(data.clientName && { client_name: data.clientName }),
        ...(data.clientTitle !== undefined && { client_title: data.clientTitle }),
        ...(data.companyName !== undefined && { company_name: data.companyName }),
        ...(data.content && { content: data.content }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.avatarUrl !== undefined && { avatar_url: data.avatarUrl }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
        ...(data.isPublished !== undefined && { is_published: data.isPublished }),
        ...(data.isFeatured !== undefined && { is_featured: data.isFeatured }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update testimonial.' };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionTestimonials = sessionTestimonials.filter((t) => t.id !== id);
    const supabase = createClient();
    await supabase.from('testimonials').delete().eq('id', id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete testimonial.' };
  }
}
