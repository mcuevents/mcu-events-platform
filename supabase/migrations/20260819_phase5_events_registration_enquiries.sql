-- ============================================================================
-- MCU CREATIONS — PHASE 5: EVENT MANAGEMENT, REGISTRATION & ENQUIRY SCHEMA
-- ============================================================================

-- 1. Base 'events' table definition (if not exists)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'exhibition',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'postponed')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'Tamil Nadu',
  country TEXT DEFAULT 'India',
  pincode TEXT,
  banner_image TEXT NOT NULL,
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  ticket_types JSONB DEFAULT '[]'::jsonb,
  organizer_name TEXT NOT NULL,
  organizer_contact TEXT NOT NULL,
  organizer_email TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Extend 'events' table with registration availability & enriched fields
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS registration_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS registration_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS speakers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- 2. Create 'event_registrations' table if not exists
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id TEXT NOT NULL,
  registration_type TEXT NOT NULL DEFAULT 'visitor' CHECK (registration_type IN ('visitor', 'exhibitor', 'sponsor', 'business_enquiry', 'other')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  designation TEXT,
  attendees_count INTEGER NOT NULL DEFAULT 1 CHECK (attendees_count > 0 AND attendees_count <= 20),
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
  reference_code TEXT UNIQUE NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup and duplicate check
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON event_registrations(lower(email));
CREATE INDEX IF NOT EXISTS idx_registrations_reference_code ON event_registrations(reference_code);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status);

-- 3. Create 'enquiries' table if not exists
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('general', 'event', 'exhibitor', 'sponsor', 'partnership', 'digital_marketing', 'social_media')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  designation TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  service_id TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast enquiry filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(type);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_event_id ON enquiries(event_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- EVENTS: Public can only view published, non-draft events
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events" ON events
  FOR SELECT
  USING (status != 'draft');

-- REGISTRATIONS: Public can INSERT only (cannot read others' registrations)
DROP POLICY IF EXISTS "Public can insert event registrations" ON event_registrations;
CREATE POLICY "Public can insert event registrations" ON event_registrations
  FOR INSERT
  WITH CHECK (true);

-- ENQUIRIES: Public can INSERT only (cannot read others' enquiries or admin notes)
DROP POLICY IF EXISTS "Public can insert enquiries" ON enquiries;
CREATE POLICY "Public can insert enquiries" ON enquiries
  FOR INSERT
  WITH CHECK (true);

-- SERVICE ROLE / ADMINS: Full access to all tables
DROP POLICY IF EXISTS "Service role has full access to registrations" ON event_registrations;
CREATE POLICY "Service role has full access to registrations" ON event_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to enquiries" ON enquiries;
CREATE POLICY "Service role has full access to enquiries" ON enquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to events" ON events;
CREATE POLICY "Service role has full access to events" ON events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
