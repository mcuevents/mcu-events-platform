import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SharedAppLayout } from '@/layouts/shared-app-layout'
import { supabase } from '@/lib/supabase'

/**
 * App shell layout — mounted at the REAL `/app` segment (not a pathless `_app`).
 *
 * Everything under `src/routes/app/` renders inside this sidebar chrome:
 *   src/routes/app/index.tsx     → /app          (the dashboard home)
 *   src/routes/app/settings.tsx  → /app/settings (add pages like this)
 *
 * WHY A NAMED SEGMENT, NOT `_app`: a `_`-prefixed layout is PATHLESS — it adds no
 * URL segment, so `_app/index.tsx` IS the `/` route and collides with the root
 * `src/routes/index.tsx` (and a childless `_app.tsx` collides the same way). The
 * build then fails with "Conflicting configuration paths … '/', '/'". Under `/app`
 * that collision is impossible: `app/index.tsx` can only ever be `/app`.
 *
 * AUTH: this layout gates the whole `/app` subtree behind a Supabase session —
 * unauthenticated visitors are redirected to `/admin`. The check runs in a
 * `useEffect` (never during render), so no `BlinkClientBoundary` is needed here:
 * the server always renders the same "checking" placeholder and the client swaps
 * it out after mount — no hydration mismatch.
 */
export const Route = createFileRoute('/app')({
  component: AppLayout,
})

type AuthState = 'checking' | 'authed' | 'unconfigured'

function AppLayout() {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>('checking')

  useEffect(() => {
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time env check on mount, not a render-driven update
      setState('unconfigured')
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) setState('authed')
      else navigate({ to: '/admin' })
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: '/admin' })
    })
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [navigate])

  if (state === 'checking') {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-accent" aria-label="Checking session" />
      </div>
    )
  }

  if (state === 'unconfigured') {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-5">
        <div className="max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent"><ShieldAlert className="size-5" /></div>
          <h1 className="mt-6 text-xl font-semibold text-primary">Backend not connected</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Add a Supabase URL and anon key to your <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code> file to enable admin sign-in and view registrations and enquiries. See the README for setup steps.</p>
          <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <SharedAppLayout appName="MCU Events">
      <Outlet />
    </SharedAppLayout>
  )
}
