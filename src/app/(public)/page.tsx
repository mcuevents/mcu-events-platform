import React from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { EventGrid } from '@/components/events/EventGrid';
import { getUpcomingEvents } from '@/services/events.service';
import {
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Compass,
  Award,
  Users,
  ShieldCheck,
  ClipboardList,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'MCU (Mentor Crew Units) Creations — Event Management',
  description:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on creating meaningful and professionally managed event experiences.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/'),
  },
};

export default async function HomePage() {
  const upcomingEvents = await getUpcomingEvents(3);

  return (
    <div className="space-y-0 bg-[#FCFBF8]">
      {/* 1. HERO SECTION — Minimal Luxury Layout (Zero Photography) */}
      <section className="relative overflow-hidden luxury-hero-bg pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-[#E8DED0]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2">
                <span className="text-[#B88932] text-xs">◆</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                  EVENT MANAGEMENT
                </span>
              </div>

              {/* Large Elegant Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-normal text-[#3A2A1E] leading-[1.12] tracking-tight">
                Great Events<br />
                Start With<br />
                <span className="font-normal text-[#B88932]">Great Planning.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg text-[#75695C] font-normal leading-relaxed max-w-xl">
                MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on creating meaningful and professionally managed event experiences.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center pt-2">
                <Link href="/events">
                  <button
                    type="button"
                    className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button
                    type="button"
                    className="btn-luxury-secondary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {/* Location & Year Badge */}
              <div className="pt-2 flex items-center gap-3 text-xs font-medium text-[#75695C]">
                <Calendar className="h-4 w-4 text-[#B88932]" />
                <span>Coimbatore, Tamil Nadu • Founded in 2026</span>
              </div>
            </div>

            {/* Right Side: Subtle Arched Luxury Brand Emblem (Zero Photography) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] border border-[#E8DED0] bg-white p-8 sm:p-10 shadow-[0_16px_40px_rgba(43,33,24,0.03)] flex flex-col justify-between overflow-hidden">
                {/* Thin Gold Decorative Arches */}
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-[#D4B06A]/20 pointer-events-none -mr-16 -mt-16" />
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full border border-[#B88932]/15 pointer-events-none -mr-8 -mt-8" />
                <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full border border-[#D4B06A]/20 pointer-events-none -ml-16 -mb-16" />

                {/* Top Brand Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold tracking-tight text-[#B88932]">MCU</span>
                    <span className="text-[10px] font-sans tracking-widest text-[#75695C] uppercase">CREATIONS</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#B88932] bg-[#B88932]/10 px-3 py-1 rounded-full border border-[#B88932]/20">
                    EST. 2026
                  </span>
                </div>

                {/* Central Emblem Statement */}
                <div className="space-y-4 py-8 relative z-10 text-center my-auto">
                  <div className="w-10 h-10 rounded-full border border-[#D4B06A] mx-auto flex items-center justify-center text-[#B88932]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="h-px w-12 bg-[#B88932] mx-auto" />
                  <p className="font-serif text-2xl sm:text-3xl text-[#3A2A1E] leading-snug font-normal">
                    Precision Planning.<br />
                    Meaningful Experiences.
                  </p>
                  <p className="text-xs text-[#75695C] tracking-wide">
                    Expositions • Conferences • Corporate Summits
                  </p>
                </div>

                {/* Bottom Footer Line */}
                <div className="pt-4 border-t border-[#E8DED0] flex items-center justify-between text-xs text-[#75695C] relative z-10">
                  <span className="text-[11px] uppercase tracking-wider text-[#B88932] font-medium">
                    Coimbatore • Tamil Nadu
                  </span>
                  <span className="text-[#B88932]">◆</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. WHAT WE DO SECTION (Immediate 4-Column Refined Bar) */}
      <section className="bg-white border-b border-[#E8DED0] py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8DED0]">
            {/* 01 Concept & Planning */}
            <div className="p-6 sm:px-8 first:pl-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-light text-[#D4B06A]">01</span>
                <Compass className="h-4 w-4 text-[#B88932]" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#3A2A1E] uppercase tracking-wide">
                Concept & Planning
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Theme formulation, space planning, agenda structuring, and milestone roadmapping.
              </p>
            </div>

            {/* 02 Coordination */}
            <div className="p-6 sm:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-light text-[#D4B06A]">02</span>
                <ClipboardList className="h-4 w-4 text-[#B88932]" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#3A2A1E] uppercase tracking-wide">
                Coordination
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Venue alignment, technical vendor synchronization, and staging logistics management.
              </p>
            </div>

            {/* 03 On-Ground Management */}
            <div className="p-6 sm:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-light text-[#D4AF6A]">03</span>
                <ShieldCheck className="h-4 w-4 text-[#B88932]" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#3A2A1E] uppercase tracking-wide">
                On-ground Management
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Live event supervision, timeline adherence, and dedicated venue oversight.
              </p>
            </div>

            {/* 04 Guest Experience */}
            <div className="p-6 sm:px-8 last:pr-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-light text-[#D4AF6A]">04</span>
                <Users className="h-4 w-4 text-[#B88932]" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#3A2A1E] uppercase tracking-wide">
                Guest Experience
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Seamless attendee reception, helpdesk hospitality, and smooth delegate assistance.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. ABOUT MCU CREATIONS SECTION */}
      <Section spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-[#B88932] text-xs">◆</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                  ABOUT MCU CREATIONS
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#3A2A1E] leading-tight">
                Creating Experiences<br />
                <span className="text-[#B88932]">With Purpose.</span>
              </h2>

              <p className="text-base text-[#75695C] leading-relaxed">
                MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and creating meaningful experiences for businesses, organizations and communities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-[#E8DED0] space-y-2">
                  <div className="flex items-center gap-2 text-[#B88932]">
                    <Compass className="h-4 w-4" />
                    <h4 className="font-serif text-sm font-bold text-[#3A2A1E]">Thoughtful Planning</h4>
                  </div>
                  <p className="text-xs text-[#75695C] leading-relaxed">
                    Meticulous spatial structuring, schedule design, and venue alignment for every occasion.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8DED0] space-y-2">
                  <div className="flex items-center gap-2 text-[#B88932]">
                    <ShieldCheck className="h-4 w-4" />
                    <h4 className="font-serif text-sm font-bold text-[#3A2A1E]">Professional Execution</h4>
                  </div>
                  <p className="text-xs text-[#75695C] leading-relaxed">
                    Reliable on-ground management, clear communication, and dedicated event coordination.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] hover:text-[#D4B06A] transition-colors">
                    <span>Learn More About MCU Creations</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Editorial Info Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-10 space-y-6 shadow-[0_12px_32px_rgba(43,33,24,0.03)]">
                <div className="space-y-2 pb-4 border-b border-[#E8DED0]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                    COMPANY OVERVIEW
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                    Built on Clarity & Dedication
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#75695C]">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                    <span>Founded in 2026 in Coimbatore, Tamil Nadu</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                    <span>Pure focus on professional event management & coordination</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                    <span>Committed to transparent collaboration and attendee experience</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DED0] flex items-center justify-between text-xs text-[#75695C]">
                  <span>Office: Coimbatore, India</span>
                  <span className="font-mono font-bold text-[#2B2118]">7010377731</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. EVENT MANAGEMENT SECTION (Central Business Focus) */}
      <Section spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container className="space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="text-[#B88932] text-xs">◆</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                EVENT MANAGEMENT
              </span>
              <span className="text-[#B88932] text-xs">◆</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#3A2A1E] tracking-tight leading-tight">
              Our Core Capabilities
            </h2>
            <p className="text-sm sm:text-base text-[#75695C] font-normal leading-relaxed max-w-2xl mx-auto">
              From thoughtful planning to on-ground execution, we focus on creating well-organized and meaningful event experiences.
            </p>
          </div>

          {/* 3 Editorial Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Block 01 */}
            <div className="luxury-card p-8 sm:p-9 flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
                  <span className="font-serif text-3xl font-light text-[#D4B06A]">
                    01
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932]">
                    MANAGEMENT
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E] group-hover:text-[#B88932] transition-colors">
                    Event Management
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                    Thoughtful planning. Precise coordination. Memorable execution. Complete end-to-end management of your gathering.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/services">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                    <span>Explore Scope</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Block 02 */}
            <div className="luxury-card p-8 sm:p-9 flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
                  <span className="font-serif text-3xl font-light text-[#D4B06A]">
                    02
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932]">
                    PLANNING
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E] group-hover:text-[#B88932] transition-colors">
                    Event Planning & Logistics
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                    Concept → Planning → Execution. Venue coordination, floor plan layouts, vendor alignment, and timeline scheduling.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/services">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                    <span>Explore Scope</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Block 03 */}
            <div className="luxury-card p-8 sm:p-9 flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
                  <span className="font-serif text-3xl font-light text-[#D4B06A]">
                    03
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932]">
                    EXPERIENCE
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E] group-hover:text-[#B88932] transition-colors">
                    Guest Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                    Creating meaningful experiences for every guest through smooth registration, on-ground assistance, and hospitality.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/services">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                    <span>Explore Scope</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-12 space-y-8 shadow-[0_8px_28px_rgba(43,33,24,0.02)]">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                Genuine Event Capabilities
              </h3>
              <p className="text-xs text-[#75695C]">
                Our capabilities are structured to ensure every aspect of your event is professionally managed.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">Concept & Planning</span>
                <span className="text-[10px] text-[#75695C]">Ideation & Roadmap</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">Event Coordination</span>
                <span className="text-[10px] text-[#75695C]">Timeline & Agenda</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">Venue & Vendors</span>
                <span className="text-[10px] text-[#75695C]">Layout & Tech Setup</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">Branding & Setup</span>
                <span className="text-[10px] text-[#75695C]">Stage & Signage</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">On-ground Operations</span>
                <span className="text-[10px] text-[#75695C]">Live Oversight</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                <span className="font-serif text-xs font-bold text-[#3A2A1E] block">Guest Experience</span>
                <span className="text-[10px] text-[#75695C]">Reception & Badges</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. UPCOMING EVENTS SECTION (Typography-Driven Cards) */}
      <Section spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-[#B88932] text-xs">◆</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                  CALENDAR
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3A2A1E] tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-sm text-[#75695C]">
                Explore upcoming business gatherings, expos, and conclaves organized by MCU Creations.
              </p>
            </div>

            <Link href="/events">
              <button
                type="button"
                className="btn-luxury-secondary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] shrink-0 flex items-center gap-2"
              >
                <span>View All Events</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          <EventGrid
            events={upcomingEvents}
            emptyTitle="No Upcoming Events Currently Listed"
            emptyDescription="New events will be published soon. Stay tuned or contact our team for more information."
          />
        </Container>
      </Section>

      {/* 6. WHY MCU CREATIONS (Principles Focus) */}
      <Section spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container className="space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="text-[#B88932] text-xs">◆</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                WHY MCU CREATIONS
              </span>
              <span className="text-[#B88932] text-xs">◆</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#3A2A1E] tracking-tight leading-tight">
              Our Commitment & Approach
            </h2>
            <p className="text-sm sm:text-base text-[#75695C] font-normal leading-relaxed">
              We approach every event with dedication, clear communication, and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Principle 01 */}
            <div className="luxury-card p-7 space-y-4">
              <span className="font-serif text-2xl font-light text-[#D4B06A]">
                01
              </span>
              <h4 className="font-serif text-lg font-bold text-[#3A2A1E]">
                Thoughtful Planning
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Structured timeline creation, stage layouts, and contingency planning to keep every detail on track.
              </p>
            </div>

            {/* Principle 02 */}
            <div className="luxury-card p-7 space-y-4">
              <span className="font-serif text-2xl font-light text-[#D4B06A]">
                02
              </span>
              <h4 className="font-serif text-lg font-bold text-[#3A2A1E]">
                Attention to Detail
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                From venue signage to guest reception desks, we focus on every touchpoint of attendee experience.
              </p>
            </div>

            {/* Principle 03 */}
            <div className="luxury-card p-7 space-y-4">
              <span className="font-serif text-2xl font-light text-[#D4B06A]">
                03
              </span>
              <h4 className="font-serif text-lg font-bold text-[#3A2A1E]">
                Creative Approach
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Crafting memorable moments and purposeful environments that resonate with delegates and partners.
              </p>
            </div>

            {/* Principle 04 */}
            <div className="luxury-card p-7 space-y-4">
              <span className="font-serif text-2xl font-light text-[#D4B06A]">
                04
              </span>
              <h4 className="font-serif text-lg font-bold text-[#3A2A1E]">
                Professional Execution
              </h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Prompt coordination, responsive on-site management, and reliable startup dedication.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. CONTACT CTA SECTION — Spacious, Minimal & Refined */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container>
          <div className="rounded-3xl border border-[#E8DED0] bg-white p-10 sm:p-16 lg:p-20 text-center space-y-6 shadow-[0_16px_40px_rgba(43,33,24,0.03)] relative overflow-hidden">
            {/* Subtle Abstract Ring Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#D4B06A]/15 pointer-events-none" />

            <div className="space-y-4 max-w-2xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2">
                <span className="text-[#B88932] text-xs">◆</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                  LET'S CREATE SOMETHING MEANINGFUL
                </span>
                <span className="text-[#B88932] text-xs">◆</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3A2A1E] leading-tight">
                Have an event in mind?
              </h3>

              <p className="text-sm sm:text-base text-[#75695C] leading-relaxed">
                Let's talk about how we can bring it to life with thoughtful planning and professional execution.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <button
                    type="button"
                    className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
