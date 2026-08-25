import { Link } from '@tanstack/react-router'

/**
 * Shared marketing-site footer. Contact details are placeholders — swap in
 * the real email, phone, and address once the client provides them.
 */
export function SiteFooter() {
  return (
    <footer className="bg-primary px-5 pb-8 text-primary-foreground/70 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 border-t border-primary-foreground/15 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold tracking-[0.12em] text-primary-foreground">MCU <span className="font-normal text-primary-foreground/60">EVENTS</span></p>
          <p className="mt-4 max-w-xs text-sm leading-6">Expos · Trade Shows · Business Events · Corporate Experiences</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Explore</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/about" className="hover:text-accent">About us</Link>
            <Link to="/services" className="hover:text-accent">Services</Link>
            <Link to="/events" className="hover:text-accent">Events</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Connect</p>
          <div className="mt-4 grid gap-3 text-sm">
            <a href="mailto:mcuevents20@gmail.com" className="hover:text-accent">Email our team</a>
            <Link to="/contact" className="hover:text-accent">Contact us</Link>
            <Link to="/admin" className="hover:text-accent">Admin login</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Contact</p>
          <p className="mt-4 text-sm leading-6">mcuevents20@gmail.com<br />Coimbatore, Tamil Nadu</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs md:flex-row">
        <span>© 2026 MCU Events. All Rights Reserved.</span>
        <span>Designed for meaningful business connections.</span>
      </div>
    </footer>
  )
}
