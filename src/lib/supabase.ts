import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type EventCategory = 'Trade Show' | 'Expo' | 'Conference' | 'Corporate'
export type EventStatus = 'draft' | 'upcoming' | 'past'

export type EventRow = {
  id: string
  slug: string
  title: string
  category: EventCategory
  tagline: string | null
  description: string | null
  start_date: string
  end_date: string | null
  location: string
  venue: string | null
  hero_image_url: string | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export type EventRegistration = {
  id: string
  event_id: string | null
  full_name: string
  company_name: string
  designation: string
  email: string
  phone: string
  city: string
  industry: string
  number_of_visitors: number
  requirements: string | null
  consent: boolean
  created_at: string
  events?: Pick<EventRow, 'title' | 'slug'> | null
}

export type ContactSubmission = {
  id: string
  full_name: string
  company_name: string
  email: string
  phone: string
  subject: string
  message: string
  created_at: string
}
