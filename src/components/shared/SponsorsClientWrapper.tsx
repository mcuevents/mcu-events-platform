'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Input, Textarea, Select, Modal } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { submitEnquiry } from '@/services/enquiries.service';
import { Award, CheckCircle2, Send, ArrowRight } from 'lucide-react';

const SPONSOR_TIERS = [
  {
    tier: 'Platinum Title Partner',
    tag: 'Prominent Event Visibility',
    deliverables: [
      'Event Co-Branding on all primary entrance arches and stage backdrops',
      'Prime central exhibition pavilion at main hall entrance',
      'Plenary keynote address opportunity during event inaugural session',
      'Prominent branding across official passes, badge lanyards, and event schedules',
      'VIP passes and dedicated lounge access for leadership delegations',
    ],
  },
  {
    tier: 'Gold Associate Partner',
    tag: 'Prime Floor & Stage Presence',
    deliverables: [
      'Main stage backdrop logo placement and seminar hall banner display',
      'Prime corner exhibition space in main trade concourse',
      'Participation in industry panel discussion track',
      'Logo on all event schedules, print materials, and official website listing',
      'VIP passes for company executives',
    ],
  },
  {
    tier: 'Silver Partner',
    tag: 'Targeted Gathering Alignment',
    deliverables: [
      'Official delegate badge or handbook branding presence',
      'Standard exhibition space in designated thematic zone',
      'Logo on official event directory and web partner wall',
      'Delegate passes for team members',
    ],
  },
];

interface SponsorsClientWrapperProps {
  sponsors: EntityPartner[];
}

export function SponsorsClientWrapper({ sponsors }: SponsorsClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(SPONSOR_TIERS[0].tier);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequestDeck = (tierName?: string) => {
    if (tierName) setSelectedTier(tierName);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry({
        type: 'sponsor',
        fullName,
        email,
        phone,
        companyName,
        subject: `Sponsorship Enquiry: ${selectedTier}`,
        message: `${message}\nRequested Tier: ${selectedTier}`,
      });

      setLoading(false);
      if (res.success) {
        setSubmitted(true);
      }
    } catch {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setMessage('');
    setIsModalOpen(false);
  };

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
                EVENT SPONSORSHIP
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Sponsorship & <br />
              <span className="italic font-normal text-[#B88932]">Brand Presence.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              Elevate your organization's presence across premier business gatherings and conventions managed by MCU Creations in Coimbatore and across Tamil Nadu.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                onClick={() => handleRequestDeck()}
              >
                <span>Request Sponsorship Scope</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Sponsorship Tiers Grid */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-12">
          <SectionHeader
            number="02"
            badge="TIERS"
            title="Sponsorship Opportunities"
            subtitle="Explore high-impact presence options designed to align your brand with regional business audiences."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPONSOR_TIERS.map((tier, idx) => (
              <div
                key={tier.tier}
                className="rounded-3xl border border-[#E8DED0] bg-white p-8 flex flex-col justify-between shadow-sm hover:border-[#B88932] transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DED0]">
                    <span className="font-serif text-2xl font-light text-[#D4B06A]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B88932] font-mono">
                      {tier.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                    {tier.tier}
                  </h3>

                  <ul className="space-y-3 pt-2">
                    {tier.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs text-[#75695C] leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E8DED0]">
                  <button
                    type="button"
                    className="w-full btn-luxury-secondary rounded-full py-3 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2"
                    onClick={() => handleRequestDeck(tier.tier)}
                  >
                    <span>Enquire for {tier.tier.split(' ')[0]}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Partner Directory */}
      {sponsors && sponsors.length > 0 && (
        <Section spacing="lg" className="bg-white border-t border-[#E8DED0]">
          <Container className="space-y-12">
            <SectionHeader
              number="03"
              badge="DIRECTORY"
              title="Event Brand Partners"
              subtitle="Organizations and enterprise brands supporting gatherings managed by MCU Creations."
              align="left"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsors.map((sponsor) => (
                <PartnerCard key={sponsor.id} partner={sponsor} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Sponsorship Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Enquiry Received!' : 'Request Sponsorship Scope'}
        description={
          submitted
            ? 'Our team will review your requirements and share detailed event schedules.'
            : 'Fill in your details below to discuss partnership deliverables.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/25 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Sponsorship Enquiry Logged</h3>
            <p className="text-xs text-[#75695C] max-w-sm mx-auto">
              Thank you, <span className="text-[#3A2A1E] font-semibold">{fullName}</span> from{' '}
              <span className="text-[#3A2A1E] font-semibold">{companyName}</span>. We will share sponsorship documentation for <span className="text-[#B88932] font-bold">{selectedTier}</span> to <span className="font-mono text-[#3A2A1E]">{email}</span>.
            </p>
            <button
              type="button"
              className="w-full btn-luxury-primary rounded-full py-3 text-xs font-semibold uppercase tracking-wider"
              onClick={handleReset}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Anand Ram"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Company / Brand Name *"
                placeholder="e.g. Apex Global Industries"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email *"
                type="email"
                placeholder="anand@apexglobal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="7010377731"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Select
              label="Selected Sponsorship Tier"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              options={SPONSOR_TIERS.map((t) => ({ value: t.tier, label: t.tier }))}
            />

            <Textarea
              label="Event Specifics & Objectives"
              placeholder="Tell us about the event type, target sector, or particular branding requirements..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DED0]">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#75695C] hover:text-[#3A2A1E]"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-luxury-primary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                {loading ? <span>Sending...</span> : <span>Send Enquiry</span>}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
