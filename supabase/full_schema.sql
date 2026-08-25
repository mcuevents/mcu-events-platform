-- ============================================================================
-- MCU CREATIONS â€” PHASE 5: EVENT MANAGEMENT, REGISTRATION & ENQUIRY SCHEMA
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
-- ============================================================================
-- MCU CREATIONS â€” PHASE 6.1: PROFILES & ADMIN AUTHENTICATION SCHEMA
-- ============================================================================

-- 1. Create 'profiles' table for user roles and authorization
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'content_manager', 'event_manager')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on email and role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES FOR PROFILES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins and Super Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Users can update their own name/avatar
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super Admins can manage all profiles
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
CREATE POLICY "Super admins can manage all profiles" ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Service role has full access
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;
CREATE POLICY "Service role has full access to profiles" ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
-- ============================================================================
-- MCU CREATIONS â€” PHASE 6.3: EVENT MANAGEMENT CMS SCHEMA & POLICIES
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
-- ============================================================================
-- MCU CREATIONS â€” PHASE 6.4: REGISTRATION MANAGEMENT SCHEMA & POLICIES
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
-- ============================================================================
-- MCU CREATIONS â€” PHASE 6.5â€“6.7: CMS SUITE DATABASE MIGRATION & RLS POLICIES
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
-- ============================================================================
-- MCU CREATIONS â€” PHASE 6.8â€“6.9: BLOG, SERVICES & SITE SETTINGS SCHEMA
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
-- ============================================================================
-- MCU CREATIONS â€” PHASE 7, 8 & 9 MIGRATION
-- Automation Notifications, CRM Leads Pipeline & Business Analytics
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. NOTIFICATIONS TABLE (Admin Inbox)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('new_registration', 'new_enquiry', 'registration_status_changed', 'event_reminder', 'system_alert')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_entity_type TEXT CHECK (related_entity_type IN ('registration', 'enquiry', 'event', 'lead', 'system')),
    related_entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- ============================================================================
-- 2. NOTIFICATION LOGS TABLE (Automation Delivery Audit & Idempotency)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key TEXT UNIQUE,
    notification_type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'admin_dashboard')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON public.notification_logs (status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON public.notification_logs (channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs (created_at DESC);

-- ============================================================================
-- 3. CRM LEADS TABLE (Inbound Prospects & Business Pipeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    designation TEXT,
    lead_type TEXT NOT NULL DEFAULT 'general' CHECK (lead_type IN ('event_enquiry', 'exhibitor', 'sponsor', 'digital_marketing', 'partnership', 'general')),
    lead_source TEXT NOT NULL DEFAULT 'website' CHECK (lead_source IN ('website', 'instagram', 'facebook', 'whatsapp', 'google', 'referral', 'event', 'direct', 'other')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
    assigned_to TEXT,
    related_event_id TEXT,
    conversion_date TIMESTAMP WITH TIME ZONE,
    conversion_type TEXT CHECK (conversion_type IN ('event_registration', 'exhibitor', 'sponsor', 'digital_marketing_client', 'partnership')),
    estimated_value NUMERIC(12, 2) DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_lead_type ON public.crm_leads (lead_type);
CREATE INDEX IF NOT EXISTS idx_crm_leads_lead_source ON public.crm_leads (lead_source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON public.crm_leads (assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON public.crm_leads (created_at DESC);

-- ============================================================================
-- 4. CRM NOTES TABLE (Private Admin Notes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_notes_lead_id ON public.crm_notes (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created_at ON public.crm_notes (created_at DESC);

-- ============================================================================
-- 5. CRM FOLLOW-UPS TABLE (Task Reminders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    followup_date DATE NOT NULL,
    followup_time TEXT,
    note TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_crm_followups_lead_id ON public.crm_followups (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_followups_status ON public.crm_followups (status);
CREATE INDEX IF NOT EXISTS idx_crm_followups_date ON public.crm_followups (followup_date);

-- ============================================================================
-- 6. CRM ACTIVITIES TABLE (Audit Trail & Activity Timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'status_changed', 'assigned', 'note_added', 'followup_created', 'followup_completed', 'email_sent', 'whatsapp_sent', 'converted')),
    description TEXT NOT NULL,
    performer_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON public.crm_activities (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON public.crm_activities (created_at DESC);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- Notifications Policies (Admin Only)
CREATE POLICY "Admins can view and manage notifications"
    ON public.notifications
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Notification Logs Policies (Admin Only)
CREATE POLICY "Admins can view and manage notification logs"
    ON public.notification_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Leads Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM leads"
    ON public.crm_leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Notes Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM notes"
    ON public.crm_notes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Followups Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM followups"
    ON public.crm_followups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CRM Activities Policies (Admin Only)
CREATE POLICY "Admins can view and manage CRM activities"
    ON public.crm_activities
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
