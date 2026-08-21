import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Loader2, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { FALLBACK_EVENTS, formatEventDate } from '@/lib/events'
import { supabase, type EventRow } from '@/lib/supabase'

export const Route = createFileRoute('/events/$slug')({
  head: () => ({ meta: [
    { title: 'Event | MCU Events' },
    { name: 'description', content: 'Event details from MCU Events — trade shows, expos, conferences, and corporate events.' },
  ]}),
  component: EventDetailPage,
})

function EventDetailPage() {
  const { slug } = Route.useParams()
  const [event, setEvent] = useState<EventRow | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    async function load() {
      if (supabase) {
        const { data } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle()
        if (!active) return
        if (data) { setEvent(data); return }
      }
      const fallback = FALLBACK_EVENTS.find(e => e.slug === slug)
      if (active) setEvent(fallback ?? null)
    }
    void load()
    return () => { active = false }
  }, [slug])

  if (event === undefined) {
    return <div className="grid min-h-dvh place-items-center bg-background"><Loader2 className="size-6 animate-spin text-accent" /></div>
  }

  if (event === null) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto flex min-h-[60dvh] max-w-2xl flex-col items-center justify-center px-5 text-center">
          <h1 className="font-serif text-4xl text-primary">Event not found</h1>
          <p className="mt-3 text-muted-foreground">This event may have been removed or the link is incorrect.</p>
          <Link to="/events" className="mt-6 text-sm font-semibold text-primary underline underline-offset-4">Browse all events</Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-primary px-5 pb-20 pt-20 text-primary-foreground lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent"><ArrowLeft className="size-4" />All events</Link>
            <div className="mt-6 flex flex-wrap items-center gap-3"><Badge variant="accent">{event.category}</Badge>{event.status === 'past' && <Badge variant="muted">Past event</Badge>}</div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.1] lg:text-5xl">{event.title}</h1>
            {event.tagline && <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/70">{event.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2"><CalendarDays className="size-4 text-accent" />{formatEventDate(event)}</div>
              <div className="flex items-center gap-2"><MapPin className="size-4 text-accent" />{event.venue ? `${event.venue}, ${event.location}` : event.location}</div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary">About this event</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{event.description ?? 'More details coming soon.'}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              <div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Meet the market.</strong><br />Connect with the right buyers and decision-makers.</p></div>
              <div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Full-service support.</strong><br />From registration to on-ground assistance.</p></div>
              <div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><p className="text-sm leading-6"><strong className="text-primary">Built to deliver.</strong><br />Programming designed around outcomes, not just attendance.</p></div>
            </div>
          </div>
          <div className="h-fit rounded-xl border border-border bg-card p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Ready to join?</p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-primary">{event.status === 'past' ? 'This event has concluded' : `Register for ${event.title}`}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{event.status === 'past' ? 'Get in touch to hear about our next edition.' : 'Tell us a little about your business and our team will follow up with everything you need.'}</p>
            {event.status === 'past' ? (
              <Link to="/contact" className="mt-6 flex h-12 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Contact our team <ArrowRight className="ml-2 size-4" /></Link>
            ) : (
              <Link to="/register" search={{ event: event.slug }} className="mt-6 flex h-12 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Register now <ArrowRight className="ml-2 size-4" /></Link>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
