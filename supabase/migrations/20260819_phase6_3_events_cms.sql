-- ============================================================================
-- MCU CREATIONS — PHASE 6.3: EVENT MANAGEMENT CMS SCHEMA & POLICIES
-- ============================================================================

-- 1. Extend 'events' table with CMS publication, spatial & alliance fields
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS external_registration_url TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Tamil Nadu',
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS banner_image TEXT,
  ADD COLUMN IF NOT EXISTS featured_image TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ticket_types JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sponsors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS exhibitors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS partners JSONB DEFAULT '[]'::jsonb;

-- Indexes for fast filtering and slug lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_is_archived ON events(is_archived);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES FOR EVENTS
-- ============================================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can view only published, non-archived, non-draft events
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events" ON events
  FOR SELECT
  TO public, anon
  USING (
    is_published = true 
    AND is_archived = false 
    AND status != 'draft'
  );

-- Authenticated admins, super admins, and event managers can view all events (including drafts and archived)
DROP POLICY IF EXISTS "Admins can view all events" ON events;
CREATE POLICY "Admins can view all events" ON events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager', 'content_manager')
    )
  );

-- Authenticated admins, super admins, and event managers can insert events
DROP POLICY IF EXISTS "Admins can insert events" ON events;
CREATE POLICY "Admins can insert events" ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager')
    )
  );

-- Authenticated admins, super admins, and event managers can update events
DROP POLICY IF EXISTS "Admins can update events" ON events;
CREATE POLICY "Admins can update events" ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager')
    )
  );

-- Authenticated super admins and admins can delete/archive events
DROP POLICY IF EXISTS "Admins can delete events" ON events;
CREATE POLICY "Admins can delete events" ON events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Service role has full access
DROP POLICY IF EXISTS "Service role has full access to events" ON events;
CREATE POLICY "Service role has full access to events" ON events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
