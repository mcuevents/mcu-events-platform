import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/app/')({
  head: () => ({ meta: [{ title: 'MCU Events Admin Dashboard' }, { name: 'description', content: 'Manage MCU Events registrations and enquiries.' }] }),
  component: DashboardHome,
})

function DashboardHome() {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">MCU Events · Private workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">Good morning, team.</h1><p className="mt-1 text-sm text-muted-foreground">Your event operations overview.</p></div><div className="grid gap-4 sm:grid-cols-3"><Stat icon={Users} label="Registrations" value="—" /><Stat icon={FileText} label="Enquiries" value="—" /><Stat icon={CalendarDays} label="Next event" value="18 Nov" /></div><Card><CardHeader><CardTitle className="text-base">Manage your event pipeline</CardTitle></CardHeader><CardContent><p className="max-w-xl text-sm leading-6 text-muted-foreground">Connect Supabase and use the workspace navigation to review Codissia registrations and contact submissions securely.</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/app/registrations" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">View registrations <ArrowRight className="ml-2 inline size-4" /></Link><Link to="/app/enquiries" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-primary">View enquiries</Link></div></CardContent></Card></div>
}
function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) { return <Card><CardContent className="flex items-center gap-4 pt-6"><div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent"><Icon className="size-5" /></div><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold text-primary">{value}</p></div></CardContent></Card> }
