'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Container, Section } from '@/components/ui';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  Layers,
  Compass,
  ShieldCheck,
  Users,
  Grid,
  Maximize2,
  Clock,
} from 'lucide-react';
import { UpcomingEventNotification } from '@/components/home/UpcomingEventNotification';
import { FloorPlanModal } from '@/components/home/FloorPlanModal';
import { HomeContactForm } from '@/components/home/HomeContactForm';

const categories = [
  'Home Appliances',
  'Electronics',
  'Furniture',
  'Interior',
  'Solar Power',
  'IT Technology',
  'Smart Home',
  'Automobile',
  'Fashion',
  'Lifestyle',
  'Food & Beverages',
  'Business Services',
  'Finance & Insurance',
  'Education',
  'Franchise',
];

export default function HomePage() {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FCFBF8] text-[#2B2118] selection:bg-[#B88932]/20 selection:text-[#2B2118]">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (#home)                                      */}
      {/* ============================================================ */}
      <section
        id="home"
        className="relative overflow-hidden luxury-hero-bg pt-16 pb-20 lg:pt-28 lg:pb-32 border-b border-[#E8DED0]"
      >
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Eyebrows */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#B88932]">01</span>
                  <span className="text-[#D4B06A]/60 text-xs">/</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B88932]">
                    MCU CREATIONS
                  </span>
                  <div className="h-px w-8 bg-[#D4B06A]/60" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#75695C]">
                  EVENT MANAGEMENT · COIMBATORE, TN
                </p>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.25rem] font-normal text-[#3A2A1E] leading-[1.12] tracking-tight">
                BUILD YOUR <br />
                <span className="italic font-normal text-[#B88932]">OWN BUSINESS</span>
              </h1>

              {/* Concise Description */}
              <p className="text-sm sm:text-base text-[#75695C] leading-relaxed max-w-xl">
                MCU Creations is an emerging Expo & Exhibition Management Company focused on creating professional, engaging, and business-driven exhibitions.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo('upcoming-event')}
                  className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 transition-all hover:shadow-md"
                >
                  <span>Upcoming Event</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('contact')}
                  className="btn-luxury-secondary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:shadow-sm"
                >
                  <span>Get in Touch</span>
                </button>
              </div>
            </div>

            {/* Right Column: Refined Brand Composition with Official MCU Logo */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md flex items-center justify-center p-8 sm:p-12">
                {/* Extremely subtle thin gold circular accents */}
                <div className="absolute inset-0 rounded-full border border-[#D4B06A]/20 pointer-events-none" />
                <div className="absolute -inset-6 rounded-full border border-[#D4B06A]/10 pointer-events-none" />
                <div className="absolute -inset-12 rounded-full border border-[#D4B06A]/5 pointer-events-none" />

                {/* Official Brand Logo */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <Image
                    src="/logo.png"
                    alt="MCU (Mentor Crew Units) Creations"
                    width={380}
                    height={253}
                    priority
                    className="w-full max-w-[320px] sm:max-w-[360px] h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
                  />
                  <div className="h-px w-16 bg-[#D4B06A]/60" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#B88932] font-mono">
                    COIMBATORE · TAMIL NADU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/* 2. ABOUT SECTION (#about)                                    */}
      {/* ============================================================ */}
      <Section id="about" spacing="lg" className="bg-white border-b border-[#E8DED0]">
        <Container size="lg" className="space-y-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">02</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B88932]">
                ABOUT US
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3A2A1E]">
              Connecting Brands, <br />
              <span className="italic font-normal text-[#B88932]">Businesses & Audiences.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Block 1: ABOUT CODISSIA */}
            <div className="rounded-3xl border border-[#E8DED0] bg-[#FCFBF8] p-8 sm:p-10 space-y-5 shadow-[0_8px_24px_rgba(43,33,24,0.02)] transition-all hover:border-[#B88932]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B88932] font-mono">
                    EXHIBITION INFRASTRUCTURE
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E]">
                    About CODISSIA
                  </h3>
                </div>
                <Building className="h-6 w-6 text-[#B88932]/70 shrink-0" />
              </div>

              <p className="text-sm text-[#75695C] leading-relaxed">
                CODISSIA is well known for organizing industrial exhibitions and trade fairs, bringing together exhibitors and visitors from different sectors. Its exhibition infrastructure provides a professional environment for businesses to showcase products, discover new technologies, build partnerships, and explore new market opportunities.
              </p>

              <div className="pt-2 text-[11px] uppercase font-semibold tracking-wider text-[#B88932] flex items-center gap-2">
                <span>Premier Regional Trade Venue</span>
                <span className="h-1 w-1 rounded-full bg-[#B88932]" />
                <span>Coimbatore</span>
              </div>
            </div>

            {/* Block 2: ABOUT MCU */}
            <div className="rounded-3xl border border-[#E8DED0] bg-[#FCFBF8] p-8 sm:p-10 space-y-5 shadow-[0_8px_24px_rgba(43,33,24,0.02)] transition-all hover:border-[#B88932]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DED0]">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B88932] font-mono">
                    MANAGEMENT COMPANY
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E]">
                    About MCU
                  </h3>
                </div>
                <Users className="h-6 w-6 text-[#B88932]/70 shrink-0" />
              </div>

              <p className="text-sm text-[#75695C] leading-relaxed">
                Mentor Crew Units is an emerging Expo & Exhibition Management Company focused on creating professional, engaging, and business-driven exhibitions. We bring brands, manufacturers, entrepreneurs, businesses, and customers together through well-planned exhibitions and trade events.
              </p>

              <div className="pt-2 text-[11px] uppercase font-semibold tracking-wider text-[#B88932] flex items-center gap-2">
                <span>MCU Creations</span>
                <span className="h-1 w-1 rounded-full bg-[#B88932]" />
                <span>Mentor Crew Units</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 3. WHAT WE DO SECTION (#what-we-do)                         */}
      {/* ============================================================ */}
      <Section id="what-we-do" spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container size="lg" className="space-y-12">
          {/* Header Row */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">03</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B88932]">
                WHAT WE DO
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3A2A1E] leading-tight">
              End-to-end <br />
              <span className="italic font-normal text-[#B88932]">event management.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#75695C] leading-relaxed">
              From concept to execution, we handle every detail so you can focus on what truly matters.
            </p>
          </div>

          {/* 4 Spacious Editorial Rows */}
          <div className="space-y-0 rounded-3xl border border-[#E8DED0] bg-white overflow-hidden shadow-[0_12px_32px_rgba(43,33,24,0.03)] divide-y divide-[#E8DED0]">
            {/* Row 01 */}
            <div className="p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[#FCFBF8]/80 group">
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#D4B06A] group-hover:text-[#B88932] transition-colors">
                  01
                </span>
                <div className="h-10 w-px bg-[#E8DED0] hidden sm:block" />
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                    Concept & Planning
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C]">
                    Turning ideas into well-planned, meaningful events.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932] shrink-0 self-start md:self-auto">
                Blueprint & Strategy
              </span>
            </div>

            {/* Row 02 */}
            <div className="p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[#FCFBF8]/80 group">
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#D4B06A] group-hover:text-[#B88932] transition-colors">
                  02
                </span>
                <div className="h-10 w-px bg-[#E8DED0] hidden sm:block" />
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                    Coordination
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C]">
                    Managing venues, vendors and every moving part.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932] shrink-0 self-start md:self-auto">
                Venues & Logistics
              </span>
            </div>

            {/* Row 03 */}
            <div className="p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[#FCFBF8]/80 group">
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#D4B06A] group-hover:text-[#B88932] transition-colors">
                  03
                </span>
                <div className="h-10 w-px bg-[#E8DED0] hidden sm:block" />
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                    On-Ground Management
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C]">
                    Flawless execution with precision and care.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932] shrink-0 self-start md:self-auto">
                Live Supervision
              </span>
            </div>

            {/* Row 04 */}
            <div className="p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-[#FCFBF8]/80 group">
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#D4B06A] group-hover:text-[#B88932] transition-colors">
                  04
                </span>
                <div className="h-10 w-px bg-[#E8DED0] hidden sm:block" />
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                    Guest Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75695C]">
                    Creating seamless and memorable experiences.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B88932] shrink-0 self-start md:self-auto">
                Hospitality & Flow
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 4. UPCOMING EVENT SECTION (#upcoming-event)                 */}
      {/* ============================================================ */}
      <Section id="upcoming-event" spacing="lg" className="bg-white border-b border-[#E8DED0]">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Event Visual Graphic */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-[#E8DED0] bg-[#FCFBF8] p-4 sm:p-6 shadow-[0_16px_40px_rgba(43,33,24,0.04)] overflow-hidden group">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-sm border border-[#E8DED0] bg-white">
                  <Image
                    src="/images/one-zone-brochure-p1.jpg"
                    alt="One Zone 2K26 - CODISSIA Hall B, Coimbatore"
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Editorial Event Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-[#B88932]">04</span>
                <span className="text-[#D4B06A]/60 text-xs">/</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B88932]">
                  UPCOMING EVENT
                </span>
                <div className="h-px w-8 bg-[#D4B06A]/60" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2A1E] leading-tight">
                  One Zone 2K26
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B88932]">
                  EXPO · TRADE SHOW · BUSINESS EVENTS
                </p>
              </div>

              {/* Event Metadata Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                  <div className="flex items-center gap-2 text-[#B88932]">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">EVENT DATES</span>
                  </div>
                  <p className="font-serif text-sm sm:text-base font-bold text-[#3A2A1E]">
                    30 & 31 October · 1 November 2026
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
                  <div className="flex items-center gap-2 text-[#B88932]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">OFFICIAL VENUE</span>
                  </div>
                  <p className="font-serif text-sm sm:text-base font-bold text-[#3A2A1E]">
                    CODISSIA Hall B · Coimbatore
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#75695C] leading-relaxed">
                A business-focused expo and trade show bringing brands, businesses, manufacturers, entrepreneurs and customers together.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo('event-details')}
                  className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 transition-all hover:shadow-md"
                >
                  <span>View Event Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setFloorPlanOpen(true)}
                  className="btn-luxury-secondary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 transition-all"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-[#B88932]" />
                  <span>View Floor Plan</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 5. EVENT DETAILS SECTION (#event-details)                   */}
      {/* ============================================================ */}
      <Section id="event-details" spacing="lg" className="bg-[#FCFBF8] border-b border-[#E8DED0]">
        <Container size="lg" className="space-y-14">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">05</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B88932]">
                ONE ZONE 2K26 · EVENT DETAILS
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3A2A1E]">
              Comprehensive Event & <br />
              <span className="italic font-normal text-[#B88932]">Exhibition Scope.</span>
            </h2>

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#75695C]">
              30 & 31 OCTOBER · 1 NOVEMBER 2026 · CODISSIA HALL B, COIMBATORE
            </p>
          </div>

          {/* 4 Expo Highlight Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED0] text-center space-y-1.5 shadow-sm">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88932] block">
                200+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E] block">
                Commercial Stalls
              </span>
              <span className="text-[11px] text-[#75695C] block">Hall B Layout</span>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED0] text-center space-y-1.5 shadow-sm">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88932] block">
                100+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E] block">
                Regional Brands
              </span>
              <span className="text-[11px] text-[#75695C] block">Multi-Sector Platform</span>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED0] text-center space-y-1.5 shadow-sm">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88932] block">
                B2B & B2C
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E] block">
                Networking
              </span>
              <span className="text-[11px] text-[#75695C] block">Direct Deal Flow</span>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED0] text-center space-y-1.5 shadow-sm">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88932] block">
                Thousands
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E] block">
                Trade Visitors
              </span>
              <span className="text-[11px] text-[#75695C] block">Targeted Turnout</span>
            </div>
          </div>

          {/* Large Ultra-Realistic Expo Showcase Image & Floor Plan Access */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E8DED0] bg-white p-4 sm:p-6 shadow-[0_16px_40px_rgba(43,33,24,0.04)] space-y-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] max-h-[580px] w-full rounded-2xl overflow-hidden border border-[#E8DED0] shadow-sm">
                <Image
                  src="/images/expo-crowd-showcase.jpg"
                  alt="MCU Creations One Zone 2K26 Expo Exhibition Hall"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B88932] font-mono block">
                    CODISSIA HALL B · ONE ZONE 2K26
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                    Hall-B Exhibition Layout & Spatial Architecture
                  </h3>
                  <p className="text-xs text-[#75695C] max-w-xl">
                    Explore the complete layout including Silver, Gold, Diamond, and Premium stall configurations, stage locations, entry/exit points, and food court zones.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFloorPlanOpen(true)}
                    className="btn-luxury-primary rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 transition-all hover:shadow-md"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>View Floor Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollTo('contact')}
                    className="btn-luxury-secondary rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:shadow-sm"
                  >
                    <span>Book Stalls</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 6. WHO CAN PARTICIPATE SECTION (#who-can-participate)        */}
      {/* ============================================================ */}
      <Section id="who-can-participate" spacing="lg" className="bg-white border-b border-[#E8DED0]">
        <Container size="lg" className="space-y-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">06</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B88932]">
                EXHIBITOR CATEGORIES
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3A2A1E]">
              Who Can Participate
            </h2>

            <p className="text-sm text-[#75695C] leading-relaxed">
              One Zone 2K26 welcomes leading manufacturers, distributors, service providers, and brands across 19 major industry sectors.
            </p>
          </div>

          {/* 19 Categories Grid with Thin Borders & Gold Accents */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {categories.map((cat, idx) => (
              <div
                key={cat}
                className="p-4 sm:p-5 rounded-2xl border border-[#E8DED0] bg-[#FCFBF8] space-y-2 transition-all hover:border-[#B88932] hover:bg-white hover:shadow-[0_8px_20px_rgba(43,33,24,0.03)] group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#D4B06A] group-hover:text-[#B88932] transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E8DED0] group-hover:bg-[#B88932] transition-colors" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#3A2A1E] leading-snug">
                  {cat}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 7. CONTACT SECTION (#contact)                                */}
      {/* ============================================================ */}
      <Section id="contact" spacing="lg" className="bg-[#FCFBF8]">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Left: Heading & Verified Office Address */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#B88932]">07</span>
                  <span className="text-[#D4B06A]/60 text-xs">/</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B88932]">
                    GET IN TOUCH
                  </span>
                  <div className="h-px w-8 bg-[#D4B06A]/60" />
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3A2A1E] leading-tight">
                  Let's create <br />
                  <span className="italic font-normal text-[#B88932]">something memorable.</span>
                </h2>

                <p className="text-sm text-[#75695C] leading-relaxed">
                  Reach out to MCU Creations to reserve your exhibition stall for One Zone 2K26 or discuss your corporate event management requirements.
                </p>
              </div>

              {/* Office Address Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED0] space-y-7 shadow-[0_12px_32px_rgba(43,33,24,0.03)]">
                {/* 1. Office Location */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] text-[#B88932] shrink-0 mt-1">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-[#B88932] block">
                      OFFICE ADDRESS
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#3A2A1E]">
                      MCU (Mentor Crew Units) Creations
                    </h4>
                    <div className="text-sm sm:text-[15px] text-[#4A3E34] leading-[1.8] font-normal pt-0.5">
                      <p>3rd Floor,</p>
                      <p>Masakalipalayam,</p>
                      <p>Ram Lakshman Nagar,</p>
                      <p>Uppilipalayam,</p>
                      <p>Coimbatore,</p>
                      <p className="font-semibold text-[#2B2118] pt-0.5">Tamil Nadu – 641004</p>
                    </div>
                  </div>
                </div>

                {/* 2. Direct Phone Lines */}
                <div className="pt-6 border-t border-[#E8DED0] flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] text-[#B88932] shrink-0 mt-1">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-[#B88932] block">
                      DIRECT PHONE NUMBERS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                      <a
                        href="tel:7010377731"
                        className="flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] hover:border-[#B88932] hover:bg-white text-[#2B2118] hover:text-[#B88932] transition-all group shadow-sm"
                      >
                        <Phone className="h-4 w-4 text-[#B88932] shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-mono font-bold text-sm sm:text-base tracking-wide">
                          7010377731
                        </span>
                      </a>

                      <a
                        href="tel:700667500"
                        className="flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] hover:border-[#B88932] hover:bg-white text-[#2B2118] hover:text-[#B88932] transition-all group shadow-sm"
                      >
                        <Phone className="h-4 w-4 text-[#B88932] shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-mono font-bold text-sm sm:text-base tracking-wide">
                          700667500
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Official Email */}
                <div className="pt-6 border-t border-[#E8DED0] flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] text-[#B88932] shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-[#B88932] block">
                      OFFICIAL EMAIL
                    </span>
                    <a
                      href="mailto:mcuevents26@gmail.com"
                      className="inline-block text-sm sm:text-[15px] font-medium text-[#2B2118] hover:text-[#B88932] transition-colors"
                    >
                      mcuevents26@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Booking & Enquiry Form */}
            <div className="lg:col-span-7">
              <HomeContactForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================ */}
      {/* 8. 5-SECOND DELAYED UPCOMING EVENT POPUP                     */}
      {/* ============================================================ */}
      <UpcomingEventNotification />

      {/* ============================================================ */}
      {/* 9. HALL-B FLOOR PLAN MODAL LIGHTBOX                          */}
      {/* ============================================================ */}
      <FloorPlanModal
        isOpen={floorPlanOpen}
        onClose={() => setFloorPlanOpen(false)}
      />
    </div>
  );
}
