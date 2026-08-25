# MCU Events

Vite + React + TypeScript + Tailwind CSS + TanStack Router site for MCU Events,
a business & corporate events management company running trade shows, expos,
conferences, and corporate experiences. Backed by Supabase (Postgres + Auth)
for event management, registrations, contact enquiries, and an authenticated
admin dashboard.

## Site map

- `/` — home page (hero, about, services, dynamic upcoming events, testimonials)
- `/about` — company story, values, timeline
- `/services` — capability pages (trade shows, expos, conferences, corporate)
- `/events` — full events calendar, filterable by category
- `/events/$slug` — individual event detail page with a Register CTA
- `/register` — multi-event registration form (event selectable via dropdown
  or a `?event=slug` query param from an event detail page)
- `/contact` — general enquiry form
- `/admin` — staff sign-in
- `/app` — authenticated dashboard: manage events, registrations, enquiries

## Backend setup (Supabase)

To connect a real backend:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run the migrations in `supabase/migrations/`
   **in order**:
   - `0001_init.sql` — `contact_submissions` and `event_registrations` tables
     with row-level security (anyone can submit a form, only signed-in staff
     can read the results).
   - `0002_events.sql` — adds the `events` table (trade shows / expos /
     conferences / corporate events shown on the public site), links
     `event_registrations` to a specific event, and seeds four sample events.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key
   (Project Settings → API in the Supabase dashboard).
4. Create at least one admin user: Supabase dashboard → Authentication →
   Users → Add user. Sign in with those credentials at `/admin` to reach the
   dashboard at `/app`.

Without a `.env`, the forms and dashboard show a "not connected" message
instead of throwing, and the public site falls back to a small set of sample
events — the marketing pages work fine on their own.

### Managing events

Once connected, sign in at `/admin` and go to **Events** in the dashboard to
create, edit, and publish events. Each event has a `status` of `draft`
(hidden from the public site), `upcoming`, or `past`. Registrations submitted
on `/register` are linked to the event the visitor selected, and show up
under **Registrations** with the event name.

### Contact details

The placeholder email, phone, and address in the header/footer/contact page
are illustrative — swap them for the real details in `src/components/SiteFooter.tsx`
and `src/routes/contact.tsx` when ready.

## Features

- **Linting**: TypeScript (`tsc --noEmit`), ESLint, and Stylelint
- **Shadcn/ui**: Pre-configured with all Shadcn components
- **Modern Stack**: Vite + React + TypeScript + Tailwind CSS

## Available Scripts

```bash
# Run all linting (types + JS + CSS)
npm run lint

# Individual linting
npm run lint:types # TypeScript (tsc --noEmit)
npm run lint:js    # ESLint
npm run lint:css   # Stylelint
```
