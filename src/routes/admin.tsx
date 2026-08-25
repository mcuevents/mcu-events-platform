import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin')({ head: () => ({ meta: [{ title: 'Admin Login | MCU Events' }, { name: 'description', content: 'Secure MCU Events administration.' }] }), component: AdminPage })

function AdminPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/app' })
    })
  }, [navigate])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) { toast.error('Supabase is not connected yet.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Signed in. Loading your dashboard…')
    navigate({ to: '/app' })
  }

  return <div className="min-h-dvh bg-secondary/40"><SiteHeader /><main className="mx-auto flex min-h-[calc(100dvh-65px)] max-w-md items-center px-5 py-16"><div className="w-full rounded-xl border border-border bg-card p-8 shadow-sm sm:p-10"><div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground"><LockKeyhole className="size-5" /></div><p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">Private access</p><h1 className="mt-3 font-serif text-3xl font-bold text-primary">Admin login</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in with your Supabase admin account to view event registrations and contact enquiries.</p><form onSubmit={submit} className="mt-8 grid gap-5"><div><Label htmlFor="admin-email">Email address</Label><div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="admin-email" required type="email" autoComplete="email" className="h-11 pl-9" value={email} onChange={e => setEmail(e.target.value)} /></div></div><div><Label htmlFor="admin-password">Password</Label><Input id="admin-password" required type="password" autoComplete="current-password" className="mt-2 h-11" value={password} onChange={e => setPassword(e.target.value)} /></div><Button disabled={loading} className="h-11 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">{loading ? 'Signing in...' : 'Sign in securely'}</Button></form><div className="mt-7 flex gap-2 border-t border-border pt-5 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />Access is protected by Supabase Authentication and row-level security.</div></div></main></div>
}
