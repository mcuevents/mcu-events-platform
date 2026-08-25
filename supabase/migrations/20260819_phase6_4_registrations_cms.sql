-- ============================================================================
-- MCU CREATIONS — PHASE 6.4: REGISTRATION MANAGEMENT SCHEMA & POLICIES
-- ============================================================================

-- 1. Create Performance Indexes for Registration Manifest Queries
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON event_registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at_desc ON event_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_type ON event_registrations(registration_type);

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES FOR REGISTRATIONS
-- ============================================================================

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Public can ONLY insert registrations (submission flow)
DROP POLICY IF EXISTS "Public can insert event registrations" ON event_registrations;
CREATE POLICY "Public can insert event registrations" ON event_registrations
  FOR INSERT
  TO public, anon
  WITH CHECK (true);

-- Authenticated admins, super admins, and event managers can view all registrations
DROP POLICY IF EXISTS "Admins can view registrations" ON event_registrations;
CREATE POLICY "Admins can view registrations" ON event_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'event_manager')
    )
  );

-- Authenticated admins, super admins, and event managers can update registration status
DROP POLICY IF EXISTS "Admins can update registrations" ON event_registrations;
CREATE POLICY "Admins can update registrations" ON event_registrations
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

-- Super Admins can delete registrations if required by data retention compliance
DROP POLICY IF EXISTS "Super admins can delete registrations" ON event_registrations;
CREATE POLICY "Super admins can delete registrations" ON event_registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Service role has full access
DROP POLICY IF EXISTS "Service role has full access to registrations" ON event_registrations;
CREATE POLICY "Service role has full access to registrations" ON event_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
