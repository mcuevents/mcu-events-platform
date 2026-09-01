import { createClient } from '@/lib/supabase/server';
import { AdminProfile, AdminRole } from '@/types/auth';
import { redirect } from 'next/navigation';

export const ADMIN_ROLES: AdminRole[] = ['super_admin', 'admin', 'content_manager', 'event_manager'];

/**
 * Server-Side: Retrieves the currently authenticated Supabase Auth user.
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Server-Side: Retrieves the user's role and details from the `profiles` table.
 */
export async function getCurrentProfile(): Promise<AdminProfile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      // Fallback profile based on user metadata if profiles record is pending trigger
      return {
        id: user.id,
        email: user.email || 'admin@mcucreations.com',
        fullName: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'MCU Admin',
        role: ((user.user_metadata?.role as AdminRole) || 'admin'),
        avatarUrl: user.user_metadata?.avatar_url as string | undefined,
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name || profile.email.split('@')[0],
      role: profile.role as AdminRole,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a profile has one of the allowed roles.
 */
export function hasRole(profile: AdminProfile | null, allowedRoles: AdminRole[]): boolean {
  if (!profile) return false;
  if (profile.role === 'super_admin') return true; // Super admin possesses all permissions
  return allowedRoles.includes(profile.role);
}

/**
 * Server-Side Guard: Ensures user is authenticated and has an admin role.
 * Redirects unauthenticated users to `/admin/login` and unauthorized users to `/admin/unauthorized`.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const profile = await getCurrentProfile();
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/admin/unauthorized');
  }

  return profile;
}

/**
 * Server-Side Guard: Ensures user has specific roles.
 */
export async function requireRole(allowedRoles: AdminRole[]): Promise<AdminProfile> {
  const profile = await requireAdmin();

  if (!hasRole(profile, allowedRoles)) {
    redirect('/admin/unauthorized');
  }

  return profile;
}
