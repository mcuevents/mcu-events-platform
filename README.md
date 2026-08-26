# MCU Creations

Next.js 14 (App Router) marketing site for **MCU (Mentor Crew Units) Creations**,
a Coimbatore-based event management and digital engagement company. The site
is fully static/mock-data driven — there is no database or backend service to
configure. All content lives in code and ships with the app.

## Site map

- `/` — home page (hero, about, services, upcoming events, testimonials)
- `/about` — company story and values
- `/services` — capability pages (event management, digital marketing, social media)
- `/business` — business/franchise-focused landing page
- `/events` — full events listing, filterable by category and status
- `/events/[slug]` — individual event detail page
- `/exhibitors`, `/sponsors`, `/partners` — partner directory pages by category
- `/gallery`, `/media` — photo gallery and video highlights
- `/blog`, `/blog/[slug]` — articles
- `/showcase` — portfolio/showcase page
- `/contact` — general enquiry form

## Content & data

There's no admin dashboard or database — all site content (events, blog
posts, partners, services, testimonials, team members, gallery/video items)
lives in `src/lib/mockData.ts`. Edit that file directly to add, remove, or
update content; the public pages read from it through the thin service
functions in `src/services/*.service.ts`.

Site-wide settings (contact details, social links, branding, footer, SEO
defaults, the announcement bar) live as defaults in
`src/services/globalSettings.service.ts`.

Contact and registration forms (`ContactClientWrapper`, event registration/
enquiry modals) resolve locally via `src/services/enquiries.service.ts` and
show a success state, but nothing is persisted anywhere — wire that file up
to a real endpoint or email service if you need submissions to go somewhere.

## Available Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # next lint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the Netlify build configuration and
custom domain setup....
