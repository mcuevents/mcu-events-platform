import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, FileText, Users, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatEventDate } from '@/lib/events'
import { supabase, type EventRow } from '@/lib/supabase'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/')({
  head: () => ({ meta: [{ title: 'MCU Events Admin Dashboard' }, { name: 'description', content: 'Manage MCU Events registrations and enquiries.' }] }),
  component: DashboardHome,
})

function DashboardHome() {
  const [registrations, setRegistrations] = useState<number | null>(null)
  const [enquiries, setEnquiries] = useState<number | null>(null)
  const [nextEvent, setNextEvent] = useState<EventRow | null | undefined>(undefined)

  useEffect(() => {
    if (!supabase) return
    async function load() {
      const [regs, contacts, events] = await Promise.all([
        supabase!.from('event_registrations').select('*', { count: 'exact', head: true }),
        supabase!.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase!.from('events').select('*').eq('status', 'upcoming').order('start_date', { ascending: true }).limit(1),
      ])
      if (regs.error) toast.error(regs.error.message)
      else setRegistrations(regs.count ?? 0)
      if (contacts.error) toast.error(contacts.error.message)
      else setEnquiries(contacts.count ?? 0)
      if (events.error) toast.error(events.error.message)
      else setNextEvent(events.data?.[0] ?? null)
    }
    void load()
  }, [])

  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">MCU Events · Private workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">Good morning, team.</h1><p className="mt-1 text-sm text-muted-foreground">Your event operations overview.</p></div><div className="grid gap-4 sm:grid-cols-3"><Stat icon={Users} label="Registrations" value={registrations === null ? '—' : String(registrations)} href="/app/registrations" /><Stat icon={FileText} label="Enquiries" value={enquiries === null ? '—' : String(enquiries)} href="/app/enquiries" /><Stat icon={CalendarDays} label="Next event" value={nextEvent === undefined ? '—' : nextEvent ? nextEvent.title : 'None scheduled'} sub={nextEvent ? formatEventDate(nextEvent) : undefined} href="/app/events" /></div><Card><CardHeader><CardTitle className="text-base">Manage your event pipeline</CardTitle></CardHeader><CardContent><p className="max-w-xl text-sm leading-6 text-muted-foreground">Publish events, review registrations, and follow up on contact enquiries coming in from the public website.</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/app/events" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Manage events <ArrowRight className="ml-2 inline size-4" /></Link><Link to="/app/registrations" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary">View registrations</Link><Link to="/app/enquiries" className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary">View enquiries</Link></div></CardContent></Card></div>
}
function Stat({ icon: Icon, label, value, sub, href }: { icon: LucideIcon; label: string; value: string; sub?: string; href?: string }) {
  const content = <CardContent className="flex items-center gap-4 pt-6"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Icon className="size-5" /></div><div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 truncate text-2xl font-semibold text-primary">{value}</p>{sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}</div></CardContent>
  if (!href) return <Card>{content}</Card>
  return <Link to={href}><Card className="transition-shadow hover:shadow-md">{content}</Card></Link>
}
