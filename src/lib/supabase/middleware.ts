import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_ROLES = ['super_admin', 'admin', 'content_manager', 'event_manager'];
const AUTH_ROUTES = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // 1. Refreshing user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 2. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isUnauthorizedRoute = pathname === '/admin/unauthorized';

    if (isAuthRoute) {
      // If user is already authenticated with an admin session, redirect away from login to /admin
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return response;
    }

    if (isUnauthorizedRoute) {
      return response;
    }

    // Protected Admin Area: Check authentication
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check Role Authorization in profiles
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = profile?.role || (user.user_metadata?.role as string);

      if (userRole && !ADMIN_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
      }
    } catch {
      // Allow through if profiles table query fails in development; server component will enforce requireAdmin()
    }
  }

  return response;
}
