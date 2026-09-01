'use client';

import React, { useState } from 'react';
import { ServiceItem } from '@/types/cms';
import { Container, Section } from '@/components/ui';
import { CheckCircle2, ArrowRight, Compass, Users, Building, ShieldCheck, ClipboardList, Layers } from 'lucide-react';
import { ServiceQuoteModal } from '@/components/shared/ServiceQuoteModal';
import { MagneticButton } from '@/components/shared/MagneticButton';

interface ServicesClientWrapperProps {
  services?: ServiceItem[];
}

export function ServicesClientWrapper({ services = [] }: ServicesClientWrapperProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Event Management');

  const handleOpenQuote = (serviceTitle?: string) => {
    if (serviceTitle) setSelectedService(serviceTitle);
    setIsQuoteModalOpen(true);
  };

  const capabilities = [
    {
      number: '01',
      title: 'Concept & Planning',
      eyebrow: 'STRATEGIC FOUNDATION',
      headline: 'Theme formulation, space planning, agenda structuring, and milestone roadmapping.',
      description:
        'MCU (Mentor Crew Units) Creations translates your gathering objectives into a structured, executable event roadmap. We establish thematic cohesion, timeline milestones, and spatial allocations from day one.',
      points: [
        'Comprehensive timeline and milestone roadmap formulation',
        'Theme formulation and visual identity guidelines',
        'Spatial layout design and floor capacity planning',
        'Budget alignment and contingency schedule mapping',
      ],
      icon: Compass,
    },
    {
      number: '02',
      title: 'Event Coordination',
      eyebrow: 'SEAMLESS ALIGNMENT',
      headline: 'Venue alignment, technical vendor synchronization, and staging logistics.',
      description:
        'We orchestrate all moving components with precision. Our team manages vendor briefings, staging logistics, technical checklists, and cross-team communications so every element functions harmoniously.',
      points: [
        'Venue synchronization and trade center liaison',
        'Audio-visual, lighting, and stage setup scheduling',
        'Cross-vendor brief distribution and delivery checklists',
        'Run-of-show cues and minute-by-minute schedules',
      ],
      icon: ClipboardList,
    },
    {
      number: '03',
      title: 'On-Ground Management',
      eyebrow: 'LIVE SUPERVISION',
      headline: 'Live event supervision, timeline adherence, and dedicated venue oversight.',
      description:
        'On event day, precision execution is paramount. Our on-ground leads monitor timeline adherence, manage crowd flow, coordinate floor staff, and resolve real-time operational requirements promptly.',
      points: [
        'Live stage and floor operational supervision',
        'Real-time problem solving and contingency management',
        'Timekeeping and session transition management',
        'Dedicated floor team coordination and oversight',
      ],
      icon: ShieldCheck,
    },
    {
      number: '04',
      title: 'Venue & Vendor Coordination',
      eyebrow: 'INFRASTRUCTURE & LOGISTICS',
      headline: 'Liaison with trade centers, hall layout planning, and vendor space allocations.',
      description:
        'Navigating venue rules and vendor schedules requires thorough organization. We manage site inspections, utility requirements, booth allocations, and loading-bay logistics effortlessly.',
      points: [
        'Trade center liaison and technical site assessments',
        'Exhibitor stall allocation and floor plan mapping',
        'Power, connectivity, and utility requirement audits',
        'Move-in and move-out schedule management',
      ],
      icon: Building,
    },
    {
      number: '05',
      title: 'Guest Experience & Hospitality',
      eyebrow: 'MEANINGFUL ENGAGEMENT',
      headline: 'Seamless attendee reception, helpdesk hospitality, and smooth delegate assistance.',
      description:
        'The heartbeat of every gathering is how participants feel. We handle delegate check-ins, guest guidance, reception desks, and VIP assistance with hospitality and warmth.',
      points: [
        'Smooth digital and on-site badge desk coordination',
        'Helpdesk support and attendee directional guidance',
        'Speaker and dignitary coordination assistance',
        'Feedback collection and hospitality support',
      ],
      icon: Users,
    },
    {
      number: '06',
      title: 'Event Production Support',
      eyebrow: 'VISUAL & TECHNICAL EXECUTION',
      headline: 'Stage backdrops, directional signage, audio-visual alignment, and branding setup.',
      description:
        'We ensure that every visual touchpoint communicates professionalism. From high-impact stage backdrops to clear directional signage and registration counters, every detail is aligned.',
      points: [
        'Stage backdrop and podium branding coordination',
        'Wayfinding and directional venue signage setup',
        'AV system test runs and acoustic checks',
        'Delegate kit and badge material distribution management',
      ],
      icon: Layers,
    },
  ];

  return (
    <div className="bg-[#FCFBF8]">
      {/* 1. Hero */}
      <div className="py-16 lg:py-24 luxury-hero-bg border-b border-[#E8DED0]">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">01</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88932]">
                EVENT MANAGEMENT SERVICES
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Thoughtful Planning. <br />
              <span className="italic font-normal text-[#B88932]">Professional Execution.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              MCU (Mentor Crew Units) Creations is a Coimbatore startup founded in 2026, focused exclusively on event management and creating meaningful, professionally executed experiences.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <MagneticButton
                as="button"
                onClick={() => handleOpenQuote('Concept & Planning')}
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em]"
              >
                <span>Request Event Quotation</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Editorial Capability Blocks */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">02</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88932]">
                FULL SCOPE
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#3A2A1E]">
              Core Event Capabilities
            </h2>
          </div>

          <div className="space-y-8">
            {capabilities.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div
                  key={cap.number}
                  className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-10 lg:p-12 transition-all duration-300 hover:border-[#B88932] hover:shadow-[0_16px_40px_rgba(43,33,24,0.04)] space-y-6"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED0]">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-3xl sm:text-4xl font-light text-[#D4B06A]">
                        {cap.number}
                      </span>
                      <div className="h-8 w-px bg-[#E8DED0]" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B88932] block">
                          {cap.eyebrow}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
                          {cap.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQuote(cap.title)}
                      className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] hover:text-[#D4B06A] transition-colors"
                    >
                      <span>Enquire for this Scope</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="font-serif text-lg sm:text-xl text-[#3A2A1E] font-normal leading-snug">
                        {cap.headline}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                        {cap.description}
                      </p>
                    </div>

                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] space-y-2.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3A2A1E] block mb-2">
                        Key Execution Focus:
                      </span>
                      {cap.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#75695C]">
                          <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. Service Quote Modal */}
      <ServiceQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        services={
          services.length > 0
            ? services
            : [
                { id: '1', title: 'Concept & Planning', slug: 'concept-planning', shortDescription: '', fullDescription: '', iconName: 'Compass', features: [], category: 'event_management', displayOrder: 1, isActive: true },
                { id: '2', title: 'Event Coordination', slug: 'event-coordination', shortDescription: '', fullDescription: '', iconName: 'ClipboardList', features: [], category: 'event_management', displayOrder: 2, isActive: true },
                { id: '3', title: 'On-Ground Management', slug: 'onground-management', shortDescription: '', fullDescription: '', iconName: 'ShieldCheck', features: [], category: 'event_management', displayOrder: 3, isActive: true },
                { id: '4', title: 'Venue & Vendor Coordination', slug: 'venue-vendors', shortDescription: '', fullDescription: '', iconName: 'Building', features: [], category: 'event_management', displayOrder: 4, isActive: true },
                { id: '5', title: 'Guest Experience & Hospitality', slug: 'guest-experience', shortDescription: '', fullDescription: '', iconName: 'Users', features: [], category: 'event_management', displayOrder: 5, isActive: true },
                { id: '6', title: 'Event Production Support', slug: 'production-support', shortDescription: '', fullDescription: '', iconName: 'Layers', features: [], category: 'event_management', displayOrder: 6, isActive: true },
              ]
        }
        defaultService={selectedService}
      />
    </div>
  );
}
