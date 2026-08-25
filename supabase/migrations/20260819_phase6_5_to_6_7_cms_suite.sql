-- ============================================================================
-- MCU CREATIONS — PHASE 6.5–6.7: CMS SUITE DATABASE MIGRATION & RLS POLICIES
-- ============================================================================

-- 1. Create 'gallery_items' table if not exists
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'events',
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_items(display_order);

-- 2. Create 'video_items' table if not exists
CREATE TABLE IF NOT EXISTS video_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  platform TEXT NOT NULL DEFAULT 'youtube',
  category TEXT NOT NULL DEFAULT 'events',
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create 'partners' table if not exists
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'partner' CHECK (category IN ('partner', 'sponsor', 'exhibitor')),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  tier TEXT NOT NULL DEFAULT 'general' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze', 'media', 'general')),
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  booth_number TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create 'team_members' table if not exists
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT NOT NULL,
  email TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create 'testimonials' table if not exists
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  company_name TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES FOR CMS TABLES
-- ============================================================================

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published records
DROP POLICY IF EXISTS "Public can view gallery" ON gallery_items;
CREATE POLICY "Public can view gallery" ON gallery_items FOR SELECT TO public, anon USING (is_published = true);

DROP POLICY IF EXISTS "Public can view videos" ON video_items;
CREATE POLICY "Public can view videos" ON video_items FOR SELECT TO public, anon USING (is_published = true);

DROP POLICY IF EXISTS "Public can view partners" ON partners;
CREATE POLICY "Public can view partners" ON partners FOR SELECT TO public, anon USING (is_active = true);

DROP POLICY IF EXISTS "Public can view team" ON team_members;
CREATE POLICY "Public can view team" ON team_members FOR SELECT TO public, anon USING (is_active = true);

DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT TO public, anon USING (is_published = true);

-- Authenticated admins have full CRUD
DROP POLICY IF EXISTS "Admins manage gallery" ON gallery_items;
CREATE POLICY "Admins manage gallery" ON gallery_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
);

DROP POLICY IF EXISTS "Admins manage videos" ON video_items;
CREATE POLICY "Admins manage videos" ON video_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
);

DROP POLICY IF EXISTS "Admins manage partners" ON partners;
CREATE POLICY "Admins manage partners" ON partners FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager', 'event_manager'))
);

DROP POLICY IF EXISTS "Admins manage team" ON team_members;
CREATE POLICY "Admins manage team" ON team_members FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
);

DROP POLICY IF EXISTS "Admins manage testimonials" ON testimonials;
CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
);

-- Service role has full access
DROP POLICY IF EXISTS "Service role gallery" ON gallery_items;
CREATE POLICY "Service role gallery" ON gallery_items FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role videos" ON video_items;
CREATE POLICY "Service role videos" ON video_items FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role partners" ON partners;
CREATE POLICY "Service role partners" ON partners FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role team" ON team_members;
CREATE POLICY "Service role team" ON team_members FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role testimonials" ON testimonials;
CREATE POLICY "Service role testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
