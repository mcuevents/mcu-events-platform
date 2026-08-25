import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FALLBACK_EVENTS, formatEventDate } from '@/lib/events'
import { supabase, type EventRow } from '@/lib/supabase'
import { toast } from 'sonner'
import { z } from 'zod'

const registerSearchSchema = z.object({
  event: z.string().optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: registerSearchSchema,
  head: () => ({ meta: [{ title: 'Register for an Event | MCU Events' }, { name: 'description', content: 'Register your interest in an MCU Events trade show, expo, or corporate event.' }] }),
  component: RegisterPage,
})

function RegisterPage() {
  const { event: eventSlug } = Route.useSearch()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<EventRow[]>(FALLBACK_EVENTS)
  const [form, setForm] = useState({ event_id: '', full_name: '', company_name: '', designation: '', email: '', phone: '', city: '', industry: '', number_of_visitors: '1', requirements: '', consent: false })
  const update = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    async function load() {
      if (!supabase) { return }
      const { data, error } = await supabase.from('events').select('*').neq('status', 'draft').order('start_date', { ascending: true })
      if (!error && data) setEvents(data)
    }
    void load()
  }, [])

  useEffect(() => {
    if (events.length === 0) return
    const match = eventSlug ? events.find(e => e.slug === eventSlug) : undefined
    const preferred = match ?? events.find(e => e.status === 'upcoming') ?? events[0]
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time default selection once events/URL param are known, not a render-driven update
    setForm(prev => (prev.event_id ? prev : { ...prev, event_id: preferred.id }))
  }, [events, eventSlug])

  const selectedEvent = events.find(e => e.id === form.event_id)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.consent) { toast.error('Please accept the consent to continue.'); return }
    if (!supabase) { toast.error('Supabase is not connected yet. Please connect the project to Supabase.'); return }
    if (!form.event_id) { toast.error('Please select an event.'); return }
    setLoading(true)
    const { error } = await supabase.from('event_registrations').insert({ ...form, number_of_visitors: Number(form.number_of_visitors) })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setSubmitted(true)
    toast.success('Registration submitted successfully.')
  }

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{selectedEvent ? `${selectedEvent.title} · ${formatEventDate(selectedEvent)}` : 'Register your interest'}</p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.1] text-primary lg:text-5xl">Register your interest.</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">Tell us a little about yourself and our team will be in touch with everything you need for the event.</p>
          <div className="mt-10 space-y-5">
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Meet the market.</strong><br />Discover products and ideas shaping your industry.</p></div>
            <div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Build connections.</strong><br />Make introductions that continue beyond the show floor.</p></div>
            <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Your details stay secure.</strong><br />We only use this information to coordinate your visit.</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-9">
          {submitted ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
              <div className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent"><CheckCircle2 className="size-8" /></div>
              <h2 className="mt-6 font-serif text-3xl font-bold text-primary">You're on the list.</h2>
              <p className="mt-4 max-w-sm leading-7 text-muted-foreground">Registration submitted successfully. Our team will contact you shortly.</p>
              <Link to="/" className="mt-8 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Return home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><h2 className="font-serif text-2xl font-bold text-primary">Tell us about you</h2><p className="mt-2 text-sm text-muted-foreground">All fields marked with * are required.</p></div>
              <div className="sm:col-span-2">
                <Label htmlFor="event_id">Event *</Label>
                <select id="event_id" required className="mt-2 flex h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30" value={form.event_id} onChange={e => update('event_id', e.target.value)}>
                  {events.length === 0 && <option value="">No events available</option>}
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title} — {formatEventDate(ev)}</option>)}
                </select>
              </div>
              <Field label="Full name" required value={form.full_name} onChange={v => update('full_name', v)} />
              <Field label="Company name" required value={form.company_name} onChange={v => update('company_name', v)} />
              <Field label="Designation" required value={form.designation} onChange={v => update('designation', v)} />
              <Field label="Email address" required type="email" value={form.email} onChange={v => update('email', v)} />
              <Field label="Phone number" required type="tel" value={form.phone} onChange={v => update('phone', v)} />
              <Field label="City" required value={form.city} onChange={v => update('city', v)} />
              <Field label="Industry" required value={form.industry} onChange={v => update('industry', v)} />
              <Field label="Number of visitors" required type="number" min="1" value={form.number_of_visitors} onChange={v => update('number_of_visitors', v)} />
              <div className="sm:col-span-2"><Label htmlFor="requirements">Requirements / message</Label><Textarea id="requirements" className="mt-2 min-h-28" value={form.requirements} onChange={e => update('requirements', e.target.value)} placeholder="Tell us how we can make your visit more valuable" /></div>
              <label className="flex gap-3 text-sm leading-6 sm:col-span-2"><input type="checkbox" className="mt-1 size-4 accent-[var(--accent)]" checked={form.consent} onChange={e => update('consent', e.target.checked)} />I consent to MCU Events using my details to contact me about this event.</label>
              <Button type="submit" disabled={loading} className="h-12 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 sm:col-span-2">{loading ? <><Loader2 className="animate-spin" />Submitting...</> : <>Register now <ArrowRight /></>}</Button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Field({ label, required, value, onChange, type = 'text', min }: { label: string; required?: boolean; value: string; onChange: (value: string) => void; type?: string; min?: string }) {
  return <div><Label htmlFor={label}>{label}{required && ' *'}</Label><Input id={label} required={required} type={type} min={min} className="mt-2 h-11" value={value} onChange={e => onChange(e.target.value)} /></div>
}
