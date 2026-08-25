import type { EventCategory, EventRow } from '@/lib/supabase'

export const EVENT_CATEGORIES: EventCategory[] = ['Trade Show', 'Expo', 'Conference', 'Corporate']

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/** Static fallback events shown when Supabase isn't connected yet, so the
 * marketing site still looks complete during local preview / before setup. */
export const FALLBACK_EVENTS: EventRow[] = [
  {
    id: 'fallback-codissia', slug: 'codissia-trade-fair-2026', title: 'Codissia Trade Fair', category: 'Trade Show',
    tagline: "South India's premier business-to-business marketplace",
    description: "Be part of one of South India's most important business platforms. Three days of exhibitors, buyers, and decision-makers from across manufacturing, engineering, and industrial sectors.",
    start_date: '2026-11-18', end_date: '2026-11-20', location: 'Coimbatore, Tamil Nadu', venue: 'CODISSIA Trade Fair Complex',
    hero_image_url: null, status: 'upcoming', created_at: '', updated_at: '',
  },
  {
    id: 'fallback-sibf', slug: 'south-india-business-forum-2027', title: 'South India Business Forum', category: 'Conference',
    tagline: 'Where regional leaders shape what comes next',
    description: 'A one-day forum bringing together business leaders, policymakers, and investors for focused conversations on growth across South India.',
    start_date: '2027-02-06', end_date: '2027-02-06', location: 'Chennai, Tamil Nadu', venue: 'Chennai Trade Centre',
    hero_image_url: null, status: 'upcoming', created_at: '', updated_at: '',
  },
  {
    id: 'fallback-techconnect', slug: 'techconnect-industrial-expo-2026', title: 'TechConnect Industrial Expo', category: 'Expo',
    tagline: "Where manufacturing meets what's next",
    description: 'An exhibition floor dedicated to automation, robotics, and industrial technology — built for engineers, plant heads, and procurement teams.',
    start_date: '2026-09-10', end_date: '2026-09-12', location: 'Bengaluru, Karnataka', venue: 'BIEC',
    hero_image_url: null, status: 'upcoming', created_at: '', updated_at: '',
  },
  {
    id: 'fallback-leadership', slug: 'annual-leadership-summit-2026', title: 'Annual Leadership Summit', category: 'Corporate',
    tagline: 'A gathering for the people who set the pace',
    description: "MCU Events' flagship corporate summit — keynotes, roundtables, and an evening awards gala celebrating leadership across industries.",
    start_date: '2026-12-04', end_date: '2026-12-04', location: 'Coimbatore, Tamil Nadu', venue: 'Vivanta Coimbatore',
    hero_image_url: null, status: 'upcoming', created_at: '', updated_at: '',
  },
]

export function formatEventDate(event: Pick<EventRow, 'start_date' | 'end_date'>): string {
  const start = new Date(`${event.start_date}T00:00:00`)
  const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  if (!event.end_date || event.end_date === event.start_date) return startStr
  const end = new Date(`${event.end_date}T00:00:00`)
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  if (sameMonth) return `${start.getDate()}–${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
  return `${startStr} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export function formatEventDay(event: Pick<EventRow, 'start_date' | 'end_date'>): { day: string; month: string } {
  const start = new Date(`${event.start_date}T00:00:00`)
  if (event.end_date && event.end_date !== event.start_date) {
    const end = new Date(`${event.end_date}T00:00:00`)
    if (start.getMonth() === end.getMonth()) {
      return { day: `${start.getDate()}—${end.getDate()}`, month: start.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase() }
    }
  }
  return { day: String(start.getDate()).padStart(2, '0'), month: start.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase() }
}
