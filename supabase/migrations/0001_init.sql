-- MCU Events — initial schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`) for a
-- fresh project. Matches the TypeScript types in src/lib/supabase.ts.

create extension if not exists "pgcrypto";

-- ── contact_submissions ──────────────────────────────────────────────
-- Written by the public /contact form.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit a contact enquiry"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated staff can view contact enquiries"
  on public.contact_submissions for select
  to authenticated
  using (true);

-- ── event_registrations ──────────────────────────────────────────────
-- Written by the public /register (Codissia Trade Fair) form.
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  designation text not null,
  email text not null,
  phone text not null,
  city text not null,
  industry text not null,
  number_of_visitors integer not null default 1,
  requirements text,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists event_registrations_created_at_idx
  on public.event_registrations (created_at desc);

alter table public.event_registrations enable row level security;

create policy "Anyone can submit an event registration"
  on public.event_registrations for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated staff can view event registrations"
  on public.event_registrations for select
  to authenticated
  using (true);
