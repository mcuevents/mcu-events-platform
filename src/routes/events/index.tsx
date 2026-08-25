import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Loader2, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { EVENT_CATEGORIES, FALLBACK_EVENTS, formatEventDate } from '@/lib/events'
import { supabase, type EventRow } from '@/lib/supabase'

export const Route = createFileRoute('/events/')({
  head: () => ({ meta: [
    { title: 'Upcoming Events | MCU Events' },
    { name: 'description', content: 'Browse upcoming trade shows, expos, conferences, and corporate events from MCU Events.' },
  ]}),
  component: EventsPage,
})

function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>(FALLBACK_EVENTS)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('All')

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase.from('events').select('*').neq('status', 'draft').order('start_date', { ascending: true })
      if (!error && data) setEvents(data)
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter)
  const upcoming = filtered.filter(e => e.status !== 'past')
  const past = filtered.filter(e => e.status === 'past')

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-dot-grid px-5 pb-16 pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our calendar</p>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-primary lg:text-6xl">Where business finds its next chapter.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Trade shows, expos, conferences, and corporate gatherings — find the event that fits your business.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {['All', ...EVENT_CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === cat ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="mt-14 flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading events...</div>
          ) : upcoming.length === 0 && past.length === 0 ? (
            <div className="mt-14 rounded-2xl border border-border bg-card px-6 py-16 text-center text-muted-foreground"><CalendarDays className="mx-auto mb-3 size-8 text-accent" /><p className="font-medium text-foreground">No events in this category yet</p><p className="mt-1 text-sm">Check back soon, or try another filter.</p></div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mt-14 grid gap-5 md:grid-cols-2">
                  {upcoming.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              )}
              {past.length > 0 && (
                <div className="mt-16">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Past events</p>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {past.map(event => <EventCard key={event.id} event={event} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function EventCard({ event }: { event: EventRow }) {
  return (
    <Link to="/events/$slug" params={{ slug: event.slug }} className="group relative overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="accent">{event.category}</Badge>
        {event.status === 'past' && <Badge variant="muted">Past</Badge>}
      </div>
      <h2 className="mt-6 font-serif text-2xl font-bold text-primary">{event.title}</h2>
      {event.tagline && <p className="mt-2 text-sm leading-6 text-muted-foreground">{event.tagline}</p>}
      <div className="mt-6 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><CalendarDays className="size-4 text-accent" />{formatEventDate(event)}</div>
        <div className="flex items-center gap-2"><MapPin className="size-4 text-accent" />{event.location}</div>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-accent">View details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
    </Link>
  )
}
