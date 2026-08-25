import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { EVENT_CATEGORIES, formatEventDate, slugify } from '@/lib/events'
import { supabase, type EventRow, type EventCategory, type EventStatus } from '@/lib/supabase'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/events')({ head: () => ({ meta: [{ title: 'Events | MCU Events' }] }), component: EventsAdmin })

type FormState = {
  id: string | null
  title: string
  slug: string
  category: EventCategory
  tagline: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  status: EventStatus
}

const EMPTY_FORM: FormState = { id: null, title: '', slug: '', category: 'Trade Show', tagline: '', description: '', start_date: '', end_date: '', location: '', venue: '', status: 'upcoming' }

function EventsAdmin() {
  const [rows, setRows] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  async function load() {
    if (!supabase) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: true })
    if (error) toast.error(error.message)
    else setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount; `load` is also called imperatively after create/edit/delete to refresh the list
    void load()
  }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setOpen(true)
  }

  function openEdit(event: EventRow) {
    setForm({ id: event.id, title: event.title, slug: event.slug, category: event.category, tagline: event.tagline ?? '', description: event.description ?? '', start_date: event.start_date, end_date: event.end_date ?? '', location: event.location, venue: event.venue ?? '', status: event.status })
    setSlugTouched(true)
    setOpen(true)
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value))
      return next
    })
  }

  async function handleDelete(event: EventRow) {
    if (!supabase) return
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('events').delete().eq('id', event.id)
    if (error) { toast.error(error.message); return }
    toast.success('Event deleted.')
    void load()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) { toast.error('Supabase is not connected yet.'); return }
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      category: form.category,
      tagline: form.tagline || null,
      description: form.description || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      location: form.location,
      venue: form.venue || null,
      status: form.status,
    }
    const { error } = form.id
      ? await supabase.from('events').update(payload).eq('id', form.id)
      : await supabase.from('events').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(form.id ? 'Event updated.' : 'Event created.')
    setOpen(false)
    void load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-semibold text-primary">Events</h1><p className="mt-1 text-sm text-muted-foreground">Trade shows, expos, conferences, and corporate events on the public site.</p></div>
        <Button onClick={openCreate}><Plus className="size-4" />New event</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading events...</div>
      ) : !supabase ? (
        <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-muted-foreground"><CalendarDays className="mx-auto mb-3 size-8 text-accent" /><p className="font-medium text-foreground">Backend not connected</p><p className="mt-1 text-sm">Add your Supabase credentials to manage events.</p></div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-muted-foreground"><CalendarDays className="mx-auto mb-3 size-8 text-accent" /><p className="font-medium text-foreground">No events yet</p><p className="mt-1 text-sm">Create your first event to publish it on the site.</p></div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {rows.map(event => (
              <div key={event.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3"><p className="font-medium text-primary">{event.title}</p><StatusBadge status={event.status} /></div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="accent">{event.category}</Badge><span>{formatEventDate(event)}</span></div>
                <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
                <div className="mt-3 flex gap-3"><button onClick={() => openEdit(event)} className="inline-flex items-center gap-1 text-sm font-medium text-primary"><Pencil className="size-3.5" />Edit</button><button onClick={() => handleDelete(event)} className="inline-flex items-center gap-1 text-sm font-medium text-destructive"><Trash2 className="size-3.5" />Delete</button></div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>{['Event', 'Category', 'Dates', 'Location', 'Status', ''].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map(event => (
                  <tr key={event.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4 font-medium text-primary">{event.title}</td>
                    <td className="px-4 py-4"><Badge variant="accent">{event.category}</Badge></td>
                    <td className="px-4 py-4 text-muted-foreground">{formatEventDate(event)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{event.location}</td>
                    <td className="px-4 py-4"><StatusBadge status={event.status} /></td>
                    <td className="px-4 py-4"><div className="flex justify-end gap-3"><button onClick={() => openEdit(event)} className="text-muted-foreground hover:text-primary" aria-label={`Edit ${event.title}`}><Pencil className="size-4" /></button><button onClick={() => handleDelete(event)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${event.title}`}><Trash2 className="size-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>{form.id ? 'Edit event' : 'New event'}</SheetTitle></SheetHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 px-4">
            <div><Label htmlFor="title">Title *</Label><Input id="title" required className="mt-2" value={form.title} onChange={e => update('title', e.target.value)} /></div>
            <div><Label htmlFor="slug">URL slug *</Label><Input id="slug" required className="mt-2" value={form.slug} onChange={e => { setSlugTouched(true); update('slug', slugify(e.target.value)) }} /><p className="mt-1 text-xs text-muted-foreground">/events/{form.slug || 'your-event-slug'}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="category">Category *</Label><select id="category" required className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30" value={form.category} onChange={e => update('category', e.target.value as EventCategory)}>{EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><Label htmlFor="status">Status *</Label><select id="status" required className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30" value={form.status} onChange={e => update('status', e.target.value as EventStatus)}><option value="draft">Draft</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select></div>
            </div>
            <div><Label htmlFor="tagline">Tagline</Label><Input id="tagline" className="mt-2" value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="One line that sells the event" /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" className="mt-2 min-h-24" value={form.description} onChange={e => update('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="start_date">Start date *</Label><Input id="start_date" required type="date" className="mt-2" value={form.start_date} onChange={e => update('start_date', e.target.value)} /></div>
              <div><Label htmlFor="end_date">End date</Label><Input id="end_date" type="date" className="mt-2" value={form.end_date} onChange={e => update('end_date', e.target.value)} /></div>
            </div>
            <div><Label htmlFor="location">Location (city, state) *</Label><Input id="location" required className="mt-2" value={form.location} onChange={e => update('location', e.target.value)} /></div>
            <div><Label htmlFor="venue">Venue</Label><Input id="venue" className="mt-2" value={form.venue} onChange={e => update('venue', e.target.value)} /></div>
            <SheetFooter className="px-0"><Button type="submit" disabled={saving} className="w-full">{saving ? <Loader2 className="animate-spin" /> : form.id ? 'Save changes' : 'Create event'}</Button></SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function StatusBadge({ status }: { status: EventStatus }) {
  if (status === 'draft') return <Badge variant="muted">Draft</Badge>
  if (status === 'past') return <Badge variant="secondary">Past</Badge>
  return <Badge variant="success">Upcoming</Badge>
}
