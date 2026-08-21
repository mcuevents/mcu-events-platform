import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Building2, CalendarDays, ChevronRight, Globe2, Loader2, MoveUpRight, Quote, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HeroParticles } from '@/components/HeroParticles'
import { HeroVisual } from '@/components/HeroVisual'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { FALLBACK_EVENTS, formatEventDate, formatEventDay } from '@/lib/events'
import { supabase, type EventRow } from '@/lib/supabase'

const services = [
  { title: 'Trade Shows', text: 'High-impact platforms that bring serious buyers, makers, and decision-makers into one room.', icon: Building2 },
  { title: 'Expos & Exhibitions', text: 'End-to-end exhibition experiences designed to make every brand interaction count.', icon: Globe2 },
  { title: 'Corporate Events', text: 'Purposeful gatherings that align teams, celebrate progress, and move businesses forward.', icon: Users },
  { title: 'Business Events', text: 'Conferences and forums shaped around meaningful conversations and measurable outcomes.', icon: CalendarDays },
]

const stats = [
  { icon: CalendarDays, value: '150+', label: 'Events delivered' },
  { icon: Users, value: '25k', label: 'Connections made' },
  { icon: Building2, value: '12', label: 'Industry sectors' },
  { icon: Sparkles, value: '98%', label: 'Client retention' },
]

const industries = ['Manufacturing', 'Automotive', 'Textiles & Apparel', 'IT & Electronics', 'Healthcare', 'Infrastructure', 'Renewable Energy', 'FMCG & Retail']

const testimonials = [
  { quote: 'The floor plan and visitor flow were the best we’ve seen at any regional trade fair — our booth had a queue by 10am.', name: 'Exhibitor', role: 'Manufacturing sector' },
  { quote: 'MCU handled everything from stage production to speaker logistics. We just showed up and delivered the keynote.', name: 'Delegate', role: 'Business conference attendee' },
  { quote: 'Our annual meet finally felt like an event, not a formality. The team sweated details we hadn’t even thought of.', name: 'Client', role: 'Corporate events partner' },
]

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'MCU Events | Creating Experiences. Connecting Businesses.' },
    { name: 'description', content: 'MCU Events creates trade shows, expos, business events, and corporate experiences that connect ambitious businesses.' },
  ]}),
  component: Home,
})

function Home() {
  const [events, setEvents] = useState<EventRow[]>(FALLBACK_EVENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase.from('events').select('*').eq('status', 'upcoming').order('start_date', { ascending: true }).limit(3)
      if (!error && data && data.length > 0) setEvents(data)
      setLoading(false)
    }
    void load()
  }, [])

  const featured = events.filter(e => e.status !== 'past').slice(0, 3)

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <SiteHeader />

      <main>
        {/* Hero — dark, animated particle backdrop */}
        <section className="relative isolate overflow-hidden bg-hero-dark px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <HeroParticles />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-accent" />Event partners for ambitious businesses
            </div>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">Creating experiences.<br /><span className="text-accent">Connecting businesses.</span></h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/65">MCU Events designs and delivers the moments where industries meet, ideas move, and lasting business relationships begin.</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#services" className="rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-md transition-colors hover:bg-accent/90">Explore our services <ArrowRight className="ml-2 inline size-4" /></a>
              <Link to="/events" className="rounded-lg border border-white/20 px-6 py-3.5 font-semibold text-white transition-colors hover:border-accent hover:text-accent">See upcoming events</Link>
            </div>
          </div>

          <div className="relative mt-14 lg:mt-16"><HeroVisual /></div>
        </section>

        {/* Stats strip */}
        <section className="border-b border-border bg-secondary/40 px-5 py-12 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                <Icon className="mx-auto size-5 text-accent" strokeWidth={1.75} />
                <p className="mt-3 font-serif text-3xl font-bold text-primary">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">The MCU difference</p>
            <h2 className="mt-4 max-w-md font-serif text-3xl font-bold leading-tight text-primary lg:text-4xl">Built for the moments that matter.</h2>
            <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">More about us <MoveUpRight className="size-4" /></Link>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-8 text-foreground/80">We believe the right event can change the trajectory of a business. That is why every MCU experience is built with a clear purpose: to create meaningful connections at scale.</p>
            <p className="mt-6 leading-7 text-muted-foreground">From the first floor plan to the final handshake, our team brings strategic thinking, operational precision, and a deep understanding of business communities to every detail.</p>
          </div>
        </section>

        {/* Industries strip */}
        <section className="border-y border-border bg-secondary/50 px-5 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Trusted across industries</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {industries.map(name => <span key={name} className="text-sm font-medium text-muted-foreground/90">{name}</span>)}
            </div>
          </div>
        </section>

        {/* Services — full-bleed navy band */}
        <section id="services" className="bg-primary px-5 py-20 text-primary-foreground lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What we do</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground lg:text-4xl">One partner. Every possibility.</h2>
              </div>
              <Link to="/services" className="font-semibold text-primary-foreground hover:text-accent">View all capabilities <MoveUpRight className="ml-1 inline size-4" /></Link>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, text, icon: Icon }, index) => (
                <article key={title} className="group rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 transition-colors hover:border-accent/60 hover:bg-primary-foreground/10">
                  <div className="flex items-center justify-between">
                    <Icon className="size-7 text-accent" strokeWidth={1.75} />
                    <span className="font-mono text-xs text-primary-foreground/50">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-primary-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/65">{text}</p>
                  <ChevronRight className="mt-6 size-4 text-accent transition-transform group-hover:translate-x-1" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section id="events" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Mark your calendar</p>
              <h2 className="mt-4 max-w-lg font-serif text-3xl font-bold leading-tight text-primary lg:text-4xl">Where business finds its next chapter.</h2>
            </div>
            <Link to="/events" className="font-semibold text-primary hover:text-accent">View all events <MoveUpRight className="ml-1 inline size-4" /></Link>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center py-12 text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Loading events...</div>
          ) : (
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {featured.map(event => {
                const { day, month } = formatEventDay(event)
                return (
                  <Link key={event.id} to="/events/$slug" params={{ slug: event.slug }} className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                    <div className="flex items-start justify-between"><Badge variant="accent">{event.category}</Badge><ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div>
                    <div className="mt-6 flex items-baseline gap-3"><p className="font-serif text-4xl font-bold text-primary">{day}</p><p className="text-xs font-bold tracking-[0.16em] text-muted-foreground">{month}</p></div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{event.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Testimonials */}
        <section className="bg-secondary/50 px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What people say</p>
            <h2 className="mt-4 max-w-lg font-serif text-3xl font-bold leading-tight text-primary lg:text-4xl">Trusted by exhibitors, delegates, and partners.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map(t => (
                <figure key={t.quote} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <Quote className="size-5 text-accent" />
                  <blockquote className="mt-4 text-sm leading-7 text-foreground/80">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4 text-sm"><span className="font-semibold text-primary">{t.name}</span><span className="text-muted-foreground"> · {t.role}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="contact" className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 rounded-2xl border border-border bg-card p-10 text-center shadow-sm lg:flex-row lg:p-14 lg:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Let's make it happen</p>
              <h2 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight text-primary lg:text-4xl">Have an event in mind? Let's talk.</h2>
            </div>
            <Link to="/contact" className="shrink-0 rounded-lg bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90">Start a conversation <ArrowRight className="ml-2 inline size-4" /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
