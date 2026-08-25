-- ============================================================================
-- MCU CREATIONS — PHASE 6.8–6.9: BLOG, SERVICES & SITE SETTINGS SCHEMA
-- ============================================================================

-- 1. Create 'blog_posts' table if not exists
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL DEFAULT 'Industry Insights',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);

-- 2. Create 'services' table if not exists
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Briefcase',
  features TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'event_management' CHECK (category IN ('event_management', 'digital_marketing', 'social_media', 'branding')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- 3. Create 'site_settings' table if not exists for site configs (Homepage, Social, SEO, Platform)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published blog posts
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT TO public, anon
  USING (is_published = true);

-- Public can SELECT active services
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
  FOR SELECT TO public, anon
  USING (is_active = true);

-- Public can SELECT site settings (for hero, social, seo metadata)
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT TO public, anon
  USING (true);

-- Authenticated admins have full CRUD on blog_posts
DROP POLICY IF EXISTS "Admins manage blog posts" ON blog_posts;
CREATE POLICY "Admins manage blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  );

-- Authenticated admins have full CRUD on services
DROP POLICY IF EXISTS "Admins manage services" ON services;
CREATE POLICY "Admins manage services" ON services
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  );

-- Authenticated admins have full CRUD on site_settings
DROP POLICY IF EXISTS "Admins manage site settings" ON site_settings;
CREATE POLICY "Admins manage site settings" ON site_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'content_manager'))
  );

-- Service role has unrestricted access
DROP POLICY IF EXISTS "Service role blog posts" ON blog_posts;
CREATE POLICY "Service role blog posts" ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role services" ON services;
CREATE POLICY "Service role services" ON services FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role site settings" ON site_settings;
CREATE POLICY "Service role site settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
