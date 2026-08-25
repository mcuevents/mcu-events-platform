'use client';

import React, { useState } from 'react';
import { ServiceItem } from '@/types/cms';
import { Container, Section } from '@/components/ui';
import { CheckCircle2, ArrowRight, Sparkles, Layers, Compass, Users, Building, ShieldCheck, Clock } from 'lucide-react';
import { ServiceQuoteModal } from '@/components/shared/ServiceQuoteModal';

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
      title: 'Event Management',
      eyebrow: 'END-TO-END EXECUTION',
      headline: 'Thoughtful planning. Precise coordination. Memorable execution.',
      description:
        'MCU (Mentor Crew Units) Creations manages gatherings with meticulous attention to detail. From inaugural corporate conclaves to multi-day business expos, we orchestrate every stage seamlessly.',
      points: [
        'Comprehensive timeline and schedule management',
        'Direct coordination with venue administrators and floor staff',
        'Real-time problem solving and on-ground supervision',
        'Post-event wrap-up and debrief reports',
      ],
    },
    {
      number: '02',
      title: 'Event Planning & Logistics',
      eyebrow: 'CONCEPT → PLANNING → EXECUTION',
      headline: 'From blueprint to floor layout, engineered for flawless flow.',
      description:
        'We translate event visions into concrete logistical frameworks. Our team structures floor allocations, delegate flows, stall allocations, and vendor timelines so everything moves on schedule.',
      points: [
        'Spatial layout design and stall placement mapping',
        'Audiovisual, lighting, and stage setup coordination',
        'Vendor sourcing, briefing, and schedule alignment',
        'Safety protocols and crowd movement planning',
      ],
    },
    {
      number: '03',
      title: 'Guest Experience & Hospitality',
      eyebrow: 'MEANINGFUL ENGAGEMENT',
      headline: 'Creating meaningful experiences for every guest and attendee.',
      description:
        'The heartbeat of every gathering is how participants feel. We handle delegate check-ins, guest guidance, reception desks, and VIP assistance with hospitality and warmth.',
      points: [
        'Smooth digital and on-site badge desk coordination',
        'Helpdesk support and attendee directional guidance',
        'Speaker and dignitary coordination assistance',
        'Feedback collection and hospitality support',
      ],
    },
  ];

  return (
    <div className="bg-[#FCFBF8]">
      {/* 1. Hero */}
      <div className="py-16 lg:py-24 luxury-hero-bg border-b border-[#E8DED0]">
        <Container>
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="text-[#B88932] text-xs">◆</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                EVENT MANAGEMENT
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-[#3A2A1E] leading-tight">
              Thoughtful Planning.<br />
              <span className="text-[#B88932]">Professional Execution.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed">
              MCU (Mentor Crew Units) Creations is a Coimbatore startup founded in 2026, focused on event management and creating meaningful, professionally executed experiences.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => handleOpenQuote('Event Management')}
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
              >
                <span>Request Event Enquiry</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Editorial Capability Blocks */}
      <Section spacing="lg">
        <Container className="space-y-16">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.number}
              className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-12 lg:p-14 transition-all duration-300 hover:border-[#B88932] hover:shadow-[0_16px_40px_rgba(43,33,24,0.04)] space-y-8"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED0]">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-light text-[#D4B06A]">
                    {cap.number}
                  </span>
                  <div className="h-8 w-px bg-[#E8DED0]" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88932] block">
                      {cap.eyebrow}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1E]">
                      {cap.title}
                    </h2>
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
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#3A2A1E] font-normal leading-snug">
                    {cap.headline}
                  </h3>
                  <p className="text-sm text-[#75695C] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FCFBF8] border border-[#E8DED0] space-y-3">
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
          ))}
        </Container>
      </Section>

      {/* 3. Capability Matrix */}
      <Section spacing="lg" className="bg-gradient-to-b from-[#FCFBF8] via-[#F8F5EE] to-[#FCFBF8] border-t border-b border-[#E8DED0]">
        <Container className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
              EVENT MANAGEMENT CAPABILITIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3A2A1E]">
              What We Bring to Every Event
            </h2>
            <p className="text-xs sm:text-sm text-[#75695C]">
              A complete suite of event coordination capabilities tailored for businesses and organizations in Coimbatore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="luxury-card p-6 space-y-3">
              <Compass className="h-6 w-6 text-[#B88932]" />
              <h4 className="font-serif text-base font-bold text-[#3A2A1E]">Concept & Strategy</h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Clear theme definition, program scheduling, and objective alignment.
              </p>
            </div>

            <div className="luxury-card p-6 space-y-3">
              <Building className="h-6 w-6 text-[#B88932]" />
              <h4 className="font-serif text-base font-bold text-[#3A2A1E]">Venue Coordination</h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Liaison with trade centers, hall layout planning, and vendor space allocations.
              </p>
            </div>

            <div className="luxury-card p-6 space-y-3">
              <Layers className="h-6 w-6 text-[#B88932]" />
              <h4 className="font-serif text-base font-bold text-[#3A2A1E]">Event Branding & Setup</h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Stage backdrops, directional signage, stall branding, and pass materials.
              </p>
            </div>

            <div className="luxury-card p-6 space-y-3">
              <ShieldCheck className="h-6 w-6 text-[#B88932]" />
              <h4 className="font-serif text-base font-bold text-[#3A2A1E]">On-ground Management</h4>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Live supervision, timekeeping, attendee helpdesks, and team coordination.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Service Quote Modal */}
      <ServiceQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        services={
          services.length > 0
            ? services
            : [
                { id: '1', title: 'Event Management', slug: 'event-management', shortDescription: '', fullDescription: '', iconName: 'Calendar', features: [], category: 'event_management', displayOrder: 1, isActive: true },
                { id: '2', title: 'Event Planning & Logistics', slug: 'event-planning', shortDescription: '', fullDescription: '', iconName: 'Calendar', features: [], category: 'event_management', displayOrder: 2, isActive: true },
                { id: '3', title: 'Guest Experience & Hospitality', slug: 'guest-experience', shortDescription: '', fullDescription: '', iconName: 'Calendar', features: [], category: 'event_management', displayOrder: 3, isActive: true },
              ]
        }
        defaultService={selectedService}
      />
    </div>
  );
}
