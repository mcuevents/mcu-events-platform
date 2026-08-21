import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Award, Compass, Handshake, Sparkles, Target, Users2 } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

const values = [
  { title: 'Purpose first', text: 'Every event starts with a clear outcome — not a checklist of features.', icon: Target },
  { title: 'Partnership', text: 'We work as an extension of your team, not a vendor working a brief.', icon: Handshake },
  { title: 'Craft', text: 'From floor plans to follow-up, we sweat the details others skip.', icon: Sparkles },
  { title: 'Trust', text: "Clear communication and dependable delivery, event after event.", icon: Award },
]

const timeline = [
  { year: '2011', text: 'MCU Events founded in Coimbatore with a single regional trade show.' },
  { year: '2015', text: 'Expanded into industrial expos across South India.' },
  { year: '2019', text: 'Launched our corporate events practice for annual meets and summits.' },
  { year: '2024', text: 'Crossed 150 events delivered across 12 industry sectors.' },
]

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [
    { title: 'About Us | MCU Events' },
    { name: 'description', content: 'MCU Events is a business and corporate events management company delivering trade shows, expos, conferences, and corporate experiences across South India.' },
  ]}),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-dot-grid px-5 pb-20 pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">About MCU Events</p>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-primary lg:text-6xl">A team built to bring<br /><span className="text-accent">businesses together.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">We're a business and corporate events management company — trade shows, industrial expos, conferences, and corporate experiences, planned and delivered end to end.</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-32">
          <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Our story</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-primary lg:text-5xl">From one trade show to a full events practice.</h2></div>
          <div className="max-w-2xl">
            <p className="text-xl leading-8 text-foreground/80">MCU Events started with a simple belief: the right event can change the trajectory of a business. What began as a single regional trade fair has grown into a full-service events practice trusted by exhibitors, sponsors, and corporates across South India.</p>
            <p className="mt-6 leading-7 text-muted-foreground">Today we plan and run trade shows, industrial expos, business conferences, and corporate gatherings — handling everything from strategy and floor plans to on-ground operations, so our clients can focus on the conversations that matter.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-4">
              <div><p className="font-serif text-4xl text-primary">15+</p><p className="mt-1 text-sm text-muted-foreground">Years in business</p></div>
              <div><p className="font-serif text-4xl text-primary">150+</p><p className="mt-1 text-sm text-muted-foreground">Events delivered</p></div>
              <div><p className="font-serif text-4xl text-primary">25k</p><p className="mt-1 text-sm text-muted-foreground">Connections made</p></div>
              <div><p className="font-serif text-4xl text-primary">12</p><p className="mt-1 text-sm text-muted-foreground">Industry sectors</p></div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/60 px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">What we stand for</p><h2 className="mt-4 font-serif text-4xl text-primary lg:text-5xl">The values behind every event.</h2></div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {values.map(({ title, text, icon: Icon }, index) => (
                <article key={title} className={`group rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md ${index === 1 ? 'lg:translate-y-6' : ''}`}>
                  <Icon className="size-8 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-12 text-xl font-semibold text-primary">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Our journey</p><h2 className="mt-4 font-serif text-4xl leading-tight text-primary lg:text-5xl">Growing one event at a time.</h2></div>
            <div className="grid gap-6 border-l border-border pl-8">
              {timeline.map(item => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-[calc(2rem+5px)] top-1.5 size-2.5 rounded-full bg-accent" />
                  <p className="font-serif text-2xl text-primary">{item.year}</p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/60 px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Why clients choose us</p><h2 className="mt-4 font-serif text-4xl text-primary lg:text-5xl">A single, accountable partner.</h2></div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div><Compass className="size-6 text-accent" /><h3 className="mt-4 font-semibold text-primary">End-to-end delivery</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Strategy, production, and on-ground execution under one roof.</p></div>
              <div><Users2 className="size-6 text-accent" /><h3 className="mt-4 font-semibold text-primary">Deep sector experience</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Twelve industries and counting — we know what each audience expects.</p></div>
              <div><Handshake className="size-6 text-accent" /><h3 className="mt-4 font-semibold text-primary">Long-term partnerships</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Most of our clients come back for their next event, and the one after that.</p></div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm lg:p-14">
            <h2 className="font-serif text-3xl font-bold text-primary lg:text-4xl">Let's plan your next event.</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="rounded-lg bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Talk to our team <ArrowRight className="ml-2 inline size-4" /></Link>
              <Link to="/events" className="rounded-lg border border-border px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">See upcoming events</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
