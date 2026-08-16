import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Building2, CalendarDays, ChevronRight, Globe2, Menu, MoveUpRight, Users, X } from 'lucide-react'
import { useState } from 'react'

const services = [
  { title: 'Trade Shows', text: 'High-impact platforms that bring serious buyers, makers, and decision-makers into one room.', icon: Building2 },
  { title: 'Expos & Exhibitions', text: 'End-to-end exhibition experiences designed to make every brand interaction count.', icon: Globe2 },
  { title: 'Corporate Events', text: 'Purposeful gatherings that align teams, celebrate progress, and move businesses forward.', icon: Users },
  { title: 'Business Events', text: 'Conferences and forums shaped around meaningful conversations and measurable outcomes.', icon: CalendarDays },
]

const events = [
  { date: '18—20', month: 'NOV 2026', title: 'Codissia Trade Fair', location: 'Coimbatore, Tamil Nadu', tone: 'from-[#142c52] via-[#264e79] to-[#c58a4e]' },
  { date: '06', month: 'FEB 2027', title: 'South India Business Forum', location: 'Chennai, Tamil Nadu', tone: 'from-[#7d5a44] via-[#b38b68] to-[#eee1c8]' },
]

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'MCU Events | Creating Experiences. Connecting Businesses.' },
    { name: 'description', content: 'MCU Events creates trade shows, expos, business events, and corporate experiences that connect ambitious businesses.' },
  ]}),
  component: Home,
})

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-3 text-primary-foreground" aria-label="MCU Events home">
            <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground shadow-lg"><span className="font-serif text-xl font-bold">M</span></span>
            <span className="text-lg font-bold tracking-[0.12em] text-primary-foreground">MCU <span className="font-normal text-primary-foreground/70">EVENTS</span></span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-primary-foreground/80 lg:flex">
            <a href="#about" className="transition-colors hover:text-accent">About</a><a href="#services" className="transition-colors hover:text-accent">Services</a><a href="#events" className="transition-colors hover:text-accent">Events</a><a href="#contact" className="transition-colors hover:text-accent">Contact</a>
            <Link to="/register" className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5">Register for Codissia <ArrowRight className="ml-2 inline size-4" /></Link>
          </div>
          <button className="rounded-lg p-2 text-primary-foreground lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
        </nav>
        {mobileOpen && <div className="mx-4 rounded-2xl border border-primary-foreground/10 bg-primary p-5 text-primary-foreground shadow-2xl lg:hidden"><div className="grid gap-4 text-sm"><a href="#about" onClick={() => setMobileOpen(false)}>About</a><a href="#services" onClick={() => setMobileOpen(false)}>Services</a><a href="#events" onClick={() => setMobileOpen(false)}>Events</a><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a><Link to="/register" className="rounded-full bg-accent px-4 py-3 text-center font-semibold text-accent-foreground">Register for Codissia</Link></div></div>}
      </header>

      <main>
        <section className="relative isolate min-h-[720px] overflow-hidden bg-primary text-primary-foreground lg:min-h-[840px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,color-mix(in_oklch,var(--accent)_26%,transparent),transparent_34%),linear-gradient(115deg,transparent_20%,oklch(0.18_0.05_255_/_0.42))]" />
          <div className="absolute -right-24 top-28 h-[520px] w-[520px] rounded-full border border-accent/30 lg:h-[720px] lg:w-[720px]" /><div className="absolute -right-8 top-52 h-[360px] w-[360px] rounded-full border border-primary-foreground/10 lg:h-[520px] lg:w-[520px]" />
          <div className="relative mx-auto grid max-w-7xl items-center px-5 pb-24 pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-52">
            <div className="max-w-2xl animate-fade-in"><div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent"><span className="h-px w-10 bg-accent" />Event partners for ambitious businesses</div><h1 className="font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl lg:text-[86px]">Creating experiences.<br /><em className="font-normal text-accent">Connecting businesses.</em></h1><p className="mt-7 max-w-lg text-lg leading-8 text-primary-foreground/72">MCU Events designs and delivers the moments where industries meet, ideas move, and lasting business relationships begin.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#services" className="group rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-xl transition-transform hover:-translate-y-1">Explore our services <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" /></a><Link to="/register" className="rounded-full border border-primary-foreground/30 px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:border-accent hover:text-accent">Register for Codissia</Link></div></div>
            <div className="relative mt-16 hidden h-[480px] lg:mt-0 lg:block"><div className="absolute right-8 top-8 h-[420px] w-[340px] rotate-3 rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center shadow-2xl" /><div className="absolute bottom-4 left-5 h-64 w-56 -rotate-6 rounded-[1.5rem] border-8 border-primary bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center shadow-2xl" /><div className="absolute bottom-0 right-0 rounded-2xl bg-accent p-5 text-accent-foreground shadow-xl"><p className="font-serif text-4xl">15+</p><p className="text-xs font-semibold uppercase tracking-wider">years of bringing<br />businesses together</p></div></div>
          </div><div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-32"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">The MCU difference</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-primary lg:text-5xl">Built for the moments that matter.</h2></div><div className="max-w-2xl"><p className="text-xl leading-8 text-foreground/80">We believe the right event can change the trajectory of a business. That is why every MCU experience is built with a clear purpose: to create meaningful connections at scale.</p><p className="mt-6 leading-7 text-muted-foreground">From the first floor plan to the final handshake, our team brings strategic thinking, operational precision, and a deep understanding of business communities to every detail.</p><div className="mt-8 grid gap-6 sm:grid-cols-3"><div><p className="font-serif text-4xl text-primary">150+</p><p className="mt-1 text-sm text-muted-foreground">Events delivered</p></div><div><p className="font-serif text-4xl text-primary">25k</p><p className="mt-1 text-sm text-muted-foreground">Connections made</p></div><div><p className="font-serif text-4xl text-primary">12</p><p className="mt-1 text-sm text-muted-foreground">Industry sectors</p></div></div></div></section>

        <section id="services" className="bg-secondary/60 px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">What we do</p><h2 className="mt-4 font-serif text-4xl text-primary lg:text-5xl">One partner. Every possibility.</h2></div><Link to="/services" className="font-semibold text-primary hover:text-accent">View all capabilities <MoveUpRight className="ml-1 inline size-4" /></Link></div><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{services.map(({ title, text, icon: Icon }, index) => <article key={title} className={`group rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${index === 1 ? 'lg:translate-y-8' : ''}`}><div className="flex items-center justify-between"><Icon className="size-8 text-accent" strokeWidth={1.5} /><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div><h3 className="mt-12 text-xl font-semibold text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p><ChevronRight className="mt-8 size-5 text-accent transition-transform group-hover:translate-x-1" /></article>)}</div></div></section>

        <section id="events" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Mark your calendar</p><h2 className="mt-4 font-serif text-4xl leading-tight text-primary lg:text-5xl">Where business finds its next chapter.</h2><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Meet the people, products, and perspectives shaping what comes next.</p></div><div className="grid gap-5">{events.map(event => <article key={event.title} className={`group relative min-h-64 overflow-hidden rounded-3xl bg-gradient-to-br ${event.tone} p-7 text-primary-foreground shadow-lg`}><div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.1_0.04_255_/_0.72),transparent_75%)]" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><p className="font-serif text-6xl leading-none">{event.date}</p><p className="mt-2 text-xs font-bold tracking-[0.2em] text-accent">{event.month}</p></div><span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs">Upcoming</span></div><div><h3 className="text-2xl font-semibold">{event.title}</h3><p className="mt-1 text-sm text-primary-foreground/70">{event.location}</p></div></div></article>)}</div></div></section>

        <section id="contact" className="bg-primary px-5 py-24 text-primary-foreground lg:px-8 lg:py-28"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Let’s make it happen</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight lg:text-6xl">Have an event in mind?<br /><em className="font-normal text-accent">Let’s talk.</em></h2></div><Link to="/contact" className="rounded-full bg-accent px-7 py-4 font-semibold text-accent-foreground transition-transform hover:-translate-y-1">Start a conversation <ArrowRight className="ml-2 inline size-4" /></Link></div></section>
      </main>

      <footer className="bg-primary px-5 pb-8 text-primary-foreground/70 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 border-t border-primary-foreground/15 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><p className="text-lg font-bold tracking-[0.12em] text-primary-foreground">MCU <span className="font-normal text-primary-foreground/60">EVENTS</span></p><p className="mt-4 max-w-xs text-sm leading-6">Expos · Trade Shows · Business Events · Corporate Experiences</p></div><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Explore</p><div className="mt-4 grid gap-3 text-sm"><a href="#about" className="hover:text-accent">About MCU</a><Link to="/services" className="hover:text-accent">Services</Link><a href="#events" className="hover:text-accent">Events</a></div></div><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Connect</p><div className="mt-4 grid gap-3 text-sm"><a href="mailto:mcuevents20@gmail.com" className="hover:text-accent">Email our team</a><a href="#contact" className="hover:text-accent">Contact us</a><Link to="/admin" className="hover:text-accent">Admin login</Link></div></div><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Contact</p><p className="mt-4 text-sm leading-6">mcuevents20@gmail.com<br />Coimbatore, Tamil Nadu</p></div></div><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs md:flex-row"><span>© 2026 MCU Events. All Rights Reserved.</span><span>Designed for meaningful business connections.</span></div></footer>
    </div>
  )
}
