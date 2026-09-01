import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-Only Admin Supabase Client using Service Role Key.
 * NEVER import or execute this file in client-side code / components.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('CRITICAL SECURITY ERROR: Attempted to instantiate admin Supabase client on the browser/client-side.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase URL or Service Role Key missing in environment.');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
