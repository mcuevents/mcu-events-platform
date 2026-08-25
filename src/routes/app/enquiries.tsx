import { createFileRoute } from '@tanstack/react-router'
import { FileText, Loader2, Mail, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { supabase, type ContactSubmission } from '@/lib/supabase'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/enquiries')({ head: () => ({ meta: [{ title: 'Contact Enquiries | MCU Events' }] }), component: Enquiries })

function Enquiries() {
  const [rows, setRows] = useState<ContactSubmission[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      if (error) toast.error(error.message)
      else setRows(data ?? [])
      setLoading(false)
    }
    void load()
  }, [])

  const filtered = rows.filter(row => `${row.full_name} ${row.company_name} ${row.email} ${row.subject}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-primary">Contact enquiries</h1><p className="mt-1 text-sm text-muted-foreground">Messages from the MCU Events website.</p></div>
    <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search enquiries" value={query} onChange={e => setQuery(e.target.value)} /></div>

    {loading ? (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading enquiries...</div>
    ) : !supabase ? (
      <EmptyState icon={Mail} title="Backend not connected" text="Add your Supabase credentials to view live contact enquiries." />
    ) : filtered.length === 0 ? (
      <EmptyState icon={FileText} title="No enquiries found" text={query ? 'Try a different search term.' : 'Submissions from the contact form will show up here.'} />
    ) : (
      <>
        {/* Mobile: card list */}
        <div className="grid gap-3 md:hidden">
          {filtered.map(row => (
            <div key={row.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><p className="font-medium text-primary">{row.full_name}</p><span className="shrink-0 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</span></div>
              <p className="mt-0.5 text-sm text-muted-foreground">{row.company_name}</p>
              <a href={`mailto:${row.email}`} className="mt-2 block text-sm text-accent">{row.email}</a>
              <p className="mt-3 text-sm font-medium text-foreground">{row.subject}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{row.message}</p>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>{['Name', 'Company', 'Email', 'Subject', 'Message', 'Date'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(row => <tr key={row.id} className="border-b border-border last:border-0"><td className="px-4 py-4 font-medium text-primary">{row.full_name}</td><td className="px-4 py-4">{row.company_name}</td><td className="px-4 py-4"><a href={`mailto:${row.email}`} className="hover:text-accent">{row.email}</a></td><td className="max-w-44 px-4 py-4">{row.subject}</td><td className="max-w-64 px-4 py-4 text-muted-foreground">{row.message}</td><td className="px-4 py-4 text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
        </div>
      </>
    )}
  </div>
}

function EmptyState({ icon: Icon, title, text }: { icon: typeof FileText; title: string; text: string }) {
  return <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-muted-foreground"><Icon className="mx-auto mb-3 size-8 text-accent" /><p className="font-medium text-foreground">{title}</p><p className="mt-1 text-sm">{text}</p></div>
}
