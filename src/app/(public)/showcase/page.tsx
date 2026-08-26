'use client';

import React, { useState } from 'react';
import { Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Textarea, Select, Badge, Breadcrumbs, StatCard, StatusBadge, DataTable, LoadingState, EmptyState, ErrorState } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Hero } from '@/components/shared/Hero';
import { EventCard } from '@/components/events/EventCard';
import { BlogCard } from '@/components/shared/BlogCard';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { TestimonialCard } from '@/components/shared/TestimonialCard';
import { Calendar, Users, MessageSquare, Sparkles, ArrowRight, Shield, Star, CheckCircle } from 'lucide-react';
import { Event, BlogPost, EntityPartner, Testimonial } from '@/types';

// Mock demonstration data for UI system showcase
const sampleEvent: Event = {
  id: 'evt-1',
  title: 'Business & Franchise Expo 2026',
  slug: 'business-franchise-expo-2026',
  description: 'The region\'s premier B2B franchise and business growth expo connecting top brands with investors and entrepreneurs.',
  category: 'exhibition',
  status: 'upcoming',
  startDate: '2026-08-29T09:00:00Z',
  endDate: '2026-08-30T18:00:00Z',
  locationName: 'CODISSIA Trade Fair Complex',
  address: 'Avinashi Road',
  city: 'Coimbatore',
  bannerImage: '',
  organizerName: 'MCU Creations',
  organizerContact: 'events@mcucreations.com',
  ticketTypes: [{ id: 't1', name: 'Delegate Pass', price: 499, currency: 'INR', available: 500 }],
  isFeatured: true,
  registrationOpen: true,
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
};

const sampleBlog: BlogPost = {
  id: 'blog-1',
  title: 'Maximizing Sponsor ROI at High-Impact Corporate Expos',
  slug: 'maximizing-sponsor-roi-expos',
  excerpt: 'Key strategies for event organizers and brand sponsors to drive measurable engagement and lead generation.',
  content: '',
  coverImage: '',
  authorName: 'MCU Marketing Team',
  category: 'Event Marketing',
  tags: ['Sponsorship', 'Expos', 'B2B'],
  isPublished: true,
  publishedAt: '2026-08-15T00:00:00Z',
  createdAt: '2026-08-15T00:00:00Z',
  updatedAt: '2026-08-15T00:00:00Z',
};

const samplePartner: EntityPartner = {
  id: 'part-1',
  category: 'sponsor',
  name: 'Apex Global Enterprises',
  logoUrl: '',
  description: 'Official Platinum Event Sponsor for national business summits.',
  tier: 'platinum',
  displayOrder: 1,
  isActive: true,
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
};

const sampleTestimonial: Testimonial = {
  id: 'test-1',
  clientName: 'Rajesh Kumar',
  clientTitle: 'Managing Director',
  companyName: 'Vanguard Retail Ltd',
  content: 'MCU Creations executed our 2-day franchise expo flawlessly. Visitor turnout exceeded expectations and our social media engagement skyrocketed.',
  rating: 5,
  displayOrder: 1,
  isFeatured: true,
};

export default function DesignSystemShowcasePage() {
  const [selectedSelect, setSelectedSelect] = useState('');

  return (
    <div>
      {/* 1. Hero System Demonstration */}
      <Hero
        eyebrow="MCU CREATIONS DESIGN SYSTEM v2.0"
        title={
          <span>
            Brand Identity, Typography & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500">UI Primitives</span>
          </span>
        }
        subtitle="Centralized CSS design tokens, warm gold accents, card foundations, and responsive components built for MCU Creations."
        primaryCta={{ label: 'Explore Components', href: '#components', icon: <ArrowRight className="h-4 w-4" /> }}
        secondaryCta={{ label: 'Public Website Home', href: '/', variant: 'secondary' }}
        stats={[
          { label: 'Color Tokens', value: '15+' },
          { label: 'UI Components', value: '20+' },
          { label: 'Responsive Breakpoints', value: '8' },
          { label: 'WCAG Accessibility', value: 'AAA' },
        ]}
      />

      <Section spacing="md" id="components">
        <Container space-y-16>
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={[{ label: 'Design System & Component Library' }]} />

          {/* 2. Color System Tokens */}
          <div className="space-y-6">
            <SectionHeader
              badge="Design Tokens"
              title="Color Palette & Surface Hierarchy"
              subtitle="Deep dark surface tokens with MCU Creations Signature Warm Gold accent."
              align="left"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                <div className="h-10 w-full rounded-md bg-background border border-border" />
                <span className="text-xs font-bold text-white block">Background</span>
                <span className="text-[10px] text-dark-400 font-mono">var(--background)</span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="h-10 w-full rounded-md bg-surface border border-border" />
                <span className="text-xs font-bold text-white block">Surface</span>
                <span className="text-[10px] text-dark-400 font-mono">var(--surface)</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2">
                <div className="h-10 w-full rounded-md bg-surface-secondary border border-border" />
                <span className="text-xs font-bold text-white block">Secondary Surface</span>
                <span className="text-[10px] text-dark-400 font-mono">var(--surface-secondary)</span>
              </div>
              <div className="p-4 rounded-xl bg-brand-500 text-dark-950 space-y-2">
                <div className="h-10 w-full rounded-md bg-brand-500 shadow-md shadow-brand-500/20" />
                <span className="text-xs font-bold text-dark-950 block">Warm Gold Accent</span>
                <span className="text-[10px] text-dark-900 font-mono">#e6b200</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 space-y-2">
                <div className="h-10 w-full rounded-md bg-emerald-500/20 border border-emerald-500/40" />
                <span className="text-xs font-bold text-emerald-400 block">Live Status</span>
                <span className="text-[10px] font-mono">#059669</span>
              </div>
              <div className="p-4 rounded-xl bg-border space-y-2">
                <div className="h-10 w-full rounded-md bg-border-light" />
                <span className="text-xs font-bold text-white block">Border Light</span>
                <span className="text-[10px] text-dark-300 font-mono">var(--border)</span>
              </div>
            </div>
          </div>

          {/* 3. Typography Scale */}
          <div className="space-y-6">
            <SectionHeader
              badge="Typography"
              title="Typographic Hierarchy"
              subtitle="Inter font family with bold headings and readable body text."
              align="left"
            />
            <Card className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-400">Hero Heading (text-4xl to 6xl, font-black)</span>
                <h1 className="text-3xl sm:text-5xl font-black text-white">Creating Unforgettable Events</h1>
              </div>
              <div className="pt-2 border-t border-dark-800">
                <span className="text-[10px] font-mono uppercase text-brand-400">Section Heading (text-2xl to 3xl, font-extrabold)</span>
                <h2 className="text-2xl font-extrabold text-white">Our Core Capabilities & Expos</h2>
              </div>
              <div className="pt-2 border-t border-dark-800">
                <span className="text-[10px] font-mono uppercase text-brand-400">Subheading (text-lg, font-bold)</span>
                <h3 className="text-lg font-bold text-white">Business & Franchise Expo 2026</h3>
              </div>
              <div className="pt-2 border-t border-dark-800">
                <span className="text-[10px] font-mono uppercase text-brand-400">Body Text (text-sm/base, text-dark-300)</span>
                <p className="text-sm text-dark-300 leading-relaxed max-w-2xl">
                  MCU Creations brings businesses, brands, and audiences together through turnkey event operations and high-converting social media marketing.
                </p>
              </div>
            </Card>
          </div>

          {/* 4. Button Variants & States */}
          <div className="space-y-6">
            <SectionHeader
              badge="Buttons & Controls"
              title="Button Component Variants"
              subtitle="Supports primary warm gold, secondary, outline, ghost, danger, and loading spinner states."
              align="left"
            />
            <Card className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Primary Accent CTA
                </Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Accent</Button>
                <Button variant="ghost">Ghost Link</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </Card>
          </div>

          {/* 5. Status Badges & Event Statuses */}
          <div className="space-y-6">
            <SectionHeader
              badge="Badges & Indicators"
              title="Event Status Indicators"
              subtitle="Accessible visual status tags for events and enquiries."
              align="left"
            />
            <Card className="p-6 flex flex-wrap gap-4 items-center">
              <StatusBadge status="upcoming" />
              <StatusBadge status="live" />
              <StatusBadge status="completed" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="postponed" />
              <StatusBadge status="new" />
              <Badge variant="gold">Platinum Sponsor</Badge>
              <Badge variant="green">Exhibitor Active</Badge>
            </Card>
          </div>

          {/* 6. Card System Demonstrations */}
          <div className="space-y-6">
            <SectionHeader
              badge="Card Foundations"
              title="Event, Blog, Partner & Testimonial Cards"
              subtitle="Reusable card components with consistent hover micro-interactions."
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EventCard event={sampleEvent} />
              <BlogCard post={sampleBlog} />
              <PartnerCard partner={samplePartner} />
              <TestimonialCard testimonial={sampleTestimonial} />
            </div>
          </div>

          {/* 7. Form Controls System */}
          <div className="space-y-6">
            <SectionHeader
              badge="Form Controls"
              title="Input, Select & Textarea Primitives"
              subtitle="Accessible input fields with labels, focus rings, helper text, and validation errors."
              align="left"
            />
            <Card className="p-6 max-w-3xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="John Doe" helperText="Enter primary contact name" />
                <Input label="Email Address" type="email" placeholder="john@mcucreations.com" error="Valid business email required" />
              </div>
              <Select
                label="Enquiry Category"
                value={selectedSelect}
                onChange={(e) => setSelectedSelect(e.target.value)}
                placeholder="Choose category..."
                options={[
                  { value: 'expos', label: 'Business & Franchise Expos' },
                  { value: 'corporate', label: 'Corporate Event Management' },
                  { value: 'marketing', label: 'Digital & Social Media Marketing' },
                ]}
              />
              <Textarea label="Event Requirements" placeholder="Describe booth size, venue preferences..." rows={3} />
            </Card>
          </div>

          {/* 8. Admin UI Visual Language Primitives */}
          <div className="space-y-6">
            <SectionHeader
              badge="Admin UI Foundation"
              title="CMS Visual Language Primitives"
              subtitle="Foundational Stat Cards and Data Table primitives for future admin dashboard interfaces."
              align="left"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard title="Active Events" value="12" icon={<Calendar className="h-5 w-5" />} trend={{ value: "+25%", isPositive: true }} />
              <StatCard title="Total Registrations" value="1,480" icon={<Users className="h-5 w-5" />} trend={{ value: "+18%", isPositive: true }} />
              <StatCard title="Pending Enquiries" value="42" icon={<MessageSquare className="h-5 w-5" />} description="Requires telecaller response" />
            </div>

            <DataTable
              columns={[
                { header: 'Event Title', accessorKey: 'title' },
                { header: 'Category', accessorKey: 'category' },
                { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
                { header: 'Location', cell: (row) => `${row.locationName}, ${row.city}` },
              ]}
              data={[sampleEvent]}
              keyExtractor={(row) => row.id}
            />
          </div>

          {/* 9. State Components */}
          <div className="space-y-6">
            <SectionHeader
              badge="Feedback States"
              title="Loading, Empty & Error States"
              subtitle="Standardized state components for async data bounds."
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4"><LoadingState label="Loading items..." /></Card>
              <EmptyState title="No Records" description="Empty data view placeholder" />
              <ErrorState title="Connection Error" description="Unable to connect to service" onRetry={() => {}} />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
