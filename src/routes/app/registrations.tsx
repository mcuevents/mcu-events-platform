import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase, type EventRegistration } from '@/lib/supabase'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/registrations')({ head: () => ({ meta: [{ title: 'Registrations | MCU Events' }] }), component: Registrations })

function Registrations() {
  const [rows, setRows] = useState<EventRegistration[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase.from('event_registrations').select('*, events(title, slug)').order('created_at', { ascending: false })
      if (error) toast.error(error.message)
      else setRows((data ?? []) as unknown as EventRegistration[])
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = rows.filter(row => `${row.full_name} ${row.company_name} ${row.email} ${row.industry} ${row.events?.title ?? ''}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-primary">Registrations</h1><p className="mt-1 text-sm text-muted-foreground">Visitor interest across all events.</p></div>
    <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search registrations" value={query} onChange={e => setQuery(e.target.value)} /></div>

    {loading ? (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading registrations...</div>
    ) : !supabase ? (
      <EmptyState title="Backend not connected" text="Add your Supabase credentials to view live registrations." />
    ) : filtered.length === 0 ? (
      <EmptyState title="No registrations found" text={query ? 'Try a different search term.' : 'Submissions from the register form will show up here.'} />
    ) : (
      <>
        {/* Mobile: card list */}
        <div className="grid gap-3 md:hidden">
          {filtered.map(row => (
            <div key={row.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><p className="font-medium text-primary">{row.full_name}</p><span className="shrink-0 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</span></div>
              <p className="mt-0.5 text-sm text-muted-foreground">{row.company_name} · {row.designation}</p>
              {row.events?.title && <Badge variant="accent" className="mt-2">{row.events.title}</Badge>}
              <a href={`mailto:${row.email}`} className="mt-2 block text-sm text-accent">{row.email}</a>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span>{row.industry}</span><span>{row.city}</span><span>{row.number_of_visitors} visitor{row.number_of_visitors === 1 ? '' : 's'}</span></div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>{['Name', 'Company', 'Event', 'Email', 'Industry', 'Visitors', 'Date'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(row => <tr key={row.id} className="border-b border-border last:border-0"><td className="px-4 py-4 font-medium text-primary">{row.full_name}</td><td className="px-4 py-4">{row.company_name}</td><td className="px-4 py-4">{row.events?.title ? <Badge variant="accent">{row.events.title}</Badge> : <span className="text-muted-foreground">—</span>}</td><td className="px-4 py-4"><a href={`mailto:${row.email}`} className="hover:text-accent">{row.email}</a></td><td className="px-4 py-4">{row.industry}</td><td className="px-4 py-4">{row.number_of_visitors}</td><td className="px-4 py-4 text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
        </div>
      </>
    )}
  </div>
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-muted-foreground"><Users className="mx-auto mb-3 size-8 text-accent" /><p className="font-medium text-foreground">{title}</p><p className="mt-1 text-sm">{text}</p></div>
}
