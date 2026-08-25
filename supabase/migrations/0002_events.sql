-- MCU Events — multi-event support
-- Run after 0001_init.sql in the Supabase SQL editor (or `supabase db push`).
-- Adds an `events` table so the site can run more than one trade show / expo /
-- conference / corporate event at a time, and links registrations to a specific
-- event.

-- ── events ────────────────────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Trade Show' check (category in ('Trade Show', 'Expo', 'Conference', 'Corporate')),
  tagline text,
  description text,
  start_date date not null,
  end_date date,
  location text not null,
  venue text,
  hero_image_url text,
  status text not null default 'upcoming' check (status in ('draft', 'upcoming', 'past')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_start_date_idx on public.events (start_date desc);
create index if not exists events_status_idx on public.events (status);

alter table public.events enable row level security;

create policy "Anyone can view published events"
  on public.events for select
  to anon, authenticated
  using (status <> 'draft');

create policy "Authenticated staff can view all events"
  on public.events for select
  to authenticated
  using (true);

create policy "Authenticated staff can create events"
  on public.events for insert
  to authenticated
  with check (true);

create policy "Authenticated staff can update events"
  on public.events for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated staff can delete events"
  on public.events for delete
  to authenticated
  using (true);

-- keep updated_at current on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ── event_registrations: link to a specific event ───────────────────
alter table public.event_registrations
  add column if not exists event_id uuid references public.events(id) on delete set null;

create index if not exists event_registrations_event_id_idx
  on public.event_registrations (event_id);

-- ── seed data ─────────────────────────────────────────────────────────
insert into public.events (slug, title, category, tagline, description, start_date, end_date, location, venue, status)
values
  (
    'codissia-trade-fair-2026',
    'Codissia Trade Fair',
    'Trade Show',
    'South India''s premier business-to-business marketplace',
    'Be part of one of South India''s most important business platforms. Three days of exhibitors, buyers, and decision-makers from across manufacturing, engineering, and industrial sectors.',
    '2026-11-18', '2026-11-20',
    'Coimbatore, Tamil Nadu', 'CODISSIA Trade Fair Complex',
    'upcoming'
  ),
  (
    'south-india-business-forum-2027',
    'South India Business Forum',
    'Conference',
    'Where regional leaders shape what comes next',
    'A one-day forum bringing together business leaders, policymakers, and investors for focused conversations on growth across South India.',
    '2027-02-06', '2027-02-06',
    'Chennai, Tamil Nadu', 'Chennai Trade Centre',
    'upcoming'
  ),
  (
    'techconnect-industrial-expo-2026',
    'TechConnect Industrial Expo',
    'Expo',
    'Where manufacturing meets what''s next',
    'An exhibition floor dedicated to automation, robotics, and industrial technology — built for engineers, plant heads, and procurement teams.',
    '2026-09-10', '2026-09-12',
    'Bengaluru, Karnataka', 'BIEC',
    'upcoming'
  ),
  (
    'annual-leadership-summit-2026',
    'Annual Leadership Summit',
    'Corporate',
    'A gathering for the people who set the pace',
    'MCU Events'' flagship corporate summit — keynotes, roundtables, and an evening awards gala celebrating leadership across industries.',
    '2026-12-04', '2026-12-04',
    'Coimbatore, Tamil Nadu', 'Vivanta Coimbatore',
    'upcoming'
  )
on conflict (slug) do nothing;
