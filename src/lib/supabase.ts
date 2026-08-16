import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type EventRegistration = {
  id: string
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
