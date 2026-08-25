import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
] as const

/** Shared marketing-site header — light bar, used on every page for consistent nav. */
export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5" aria-label="MCU Events home">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><span className="font-serif text-lg font-bold">M</span></span>
          <span className="font-serif text-base font-bold tracking-tight text-primary">MCU <span className="font-medium text-muted-foreground">Events</span></span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-foreground/75 lg:flex">
          {NAV_LINKS.map(link => <Link key={link.to} to={link.to} className="transition-colors hover:text-primary" activeProps={{ className: 'text-primary font-semibold' }}>{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/contact" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">Talk to us</Link>
          <Link to="/events" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Register now</Link>
        </div>
        <button className="rounded-lg p-2 text-primary lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
          <div className="grid gap-4 text-sm font-medium text-foreground">
            {NAV_LINKS.map(link => <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</Link>)}
            <Link to="/contact" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-3 text-center font-semibold text-foreground">Talk to us</Link>
            <Link to="/events" onClick={() => setOpen(false)} className="rounded-lg bg-primary px-4 py-3 text-center font-semibold text-primary-foreground">Register now</Link>
          </div>
        </div>
      )}
    </header>
  )
}
