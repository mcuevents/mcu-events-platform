import React from 'react';
import { Container, Section } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Target, ArrowRight, Compass, Calendar, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About Us | MCU (Mentor Crew Units) Creations',
  description:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and creating meaningful experiences for businesses, organizations and communities.',
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/about'),
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#FCFBF8]">
      {/* 1. Hero Section */}
      <div className="py-16 lg:py-24 luxury-hero-bg border-b border-[#E8DED0]">
        <Container>
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="text-[#B88932] text-xs">◆</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                ABOUT MCU CREATIONS
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-[#3A2A1E] leading-tight">
              Creating Experiences<br />
              <span className="text-[#B88932]">With Purpose.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed">
              MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and creating meaningful experiences for businesses, organizations and communities.
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Mission & Vision */}
      <Section spacing="lg" className="border-b border-[#E8DED0]">
        <Container className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl border border-[#E8DED0] bg-white space-y-4 shadow-sm hover:border-[#B88932] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-light text-[#D4B06A]">01</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88932]">
                  OUR MISSION
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3A2A1E]">
                Thoughtful, Seamless Event Delivery
              </h2>
              <p className="text-sm text-[#75695C] leading-relaxed">
                To deliver thoughtfully planned, professionally coordinated, and reliably executed events that bring communities and enterprises together in meaningful ways.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl border border-[#E8DED0] bg-white space-y-4 shadow-sm hover:border-[#B88932] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-light text-[#D4B06A]">02</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B88932]">
                  OUR VISION
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3A2A1E]">
                Excellence Through Dedication
              </h2>
              <p className="text-sm text-[#75695C] leading-relaxed">
                To become a trusted, premier event-management partner in Tamil Nadu, recognized for creative integrity, clear communication, and precise execution.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Startup Foundations & Principles */}
      <Section spacing="lg" className="bg-gradient-to-b from-[#FCFBF8] via-[#F8F5EE] to-[#FCFBF8] border-b border-[#E8DED0]">
        <Container className="space-y-12">
          <SectionHeader
            badge="OUR FOUNDATIONS"
            title="Our Principles & Commitments"
            subtitle="As an emerging startup founded in 2026, we focus on genuine strengths: meticulous preparation, honest communication, and tireless on-ground execution."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="luxury-card p-7 space-y-3">
              <div className="flex items-center gap-2 text-[#B88932]">
                <Calendar className="h-5 w-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">01</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Dedicated Startup Agility</h3>
              <p className="text-xs text-[#75695C] leading-relaxed">
                We bring fresh enthusiasm, rapid responsiveness, and personal attention to every client and event collaborator.
              </p>
            </div>

            <div className="luxury-card p-7 space-y-3">
              <div className="flex items-center gap-2 text-[#B88932]">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">02</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Transparent Collaboration</h3>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Open communication, realistic planning timelines, and honest budgeting with zero hidden surprises.
              </p>
            </div>

            <div className="luxury-card p-7 space-y-3">
              <div className="flex items-center gap-2 text-[#B88932]">
                <Compass className="h-5 w-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">03</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Attendee-Centric Flow</h3>
              <p className="text-xs text-[#75695C] leading-relaxed">
                Every floor design and schedule is built around guest comfort, clear navigation, and engaging gathering spaces.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Company Facts & Office */}
      <Section spacing="lg" className="border-b border-[#E8DED0]">
        <Container>
          <div className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-12 space-y-8 shadow-sm">
            <div className="space-y-2 pb-4 border-b border-[#E8DED0]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                OFFICIAL DETAILS
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A2A1E]">
                MCU (Mentor Crew Units) Creations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <span className="text-[#75695C] uppercase text-[11px] font-semibold block">Company & Brand</span>
                <p className="font-serif font-bold text-base text-[#3A2A1E]">MCU Creations</p>
                <p className="text-[#75695C]">Founded in 2026 in Coimbatore, Tamil Nadu, India</p>
              </div>

              <div className="space-y-2">
                <span className="text-[#75695C] uppercase text-[11px] font-semibold block">Office Address</span>
                <p className="text-[#75695C] leading-relaxed">
                  3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam, Coimbatore, Tamil Nadu - 641004, India
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[#75695C] uppercase text-[11px] font-semibold block">Direct Lines</span>
                <div className="space-y-1">
                  <p className="font-mono font-bold text-[#2B2118]">7010377731 / 700667500</p>
                  <p className="text-[#75695C]">mcuevents26@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Contact CTA */}
      <Section spacing="lg">
        <Container>
          <div className="rounded-3xl bg-white border border-[#E8DED0] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_12px_32px_rgba(43,33,24,0.03)]">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                CONNECT WITH US
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1E]">
                Planning an Event in Coimbatore or Tamil Nadu?
              </h3>
              <p className="text-xs sm:text-sm text-[#75695C]">
                Reach out to MCU Creations to discuss your event schedule, venue logistics, and coordination requirements.
              </p>
            </div>
            <Link href="/contact">
              <button
                type="button"
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 shrink-0"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
