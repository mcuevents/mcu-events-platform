'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Input, Textarea, Select, Modal } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { submitEnquiry } from '@/services/enquiries.service';
import { Handshake, CheckCircle2, Send, ArrowRight } from 'lucide-react';

interface PartnersClientWrapperProps {
  partners: EntityPartner[];
}

export function PartnersClientWrapper({ partners }: PartnersClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [partnershipType, setPartnershipType] = useState('Venue / Infrastructure');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry({
        type: 'partnership',
        fullName,
        email,
        phone,
        companyName,
        subject: `Strategic Partnership: ${partnershipType}`,
        message: `${message}\nPartnership Focus: ${partnershipType}`,
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
                COLLABORATION
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Event Alliances & <br />
              <span className="italic font-normal text-[#B88932]">Venue Collaborations.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              MCU (Mentor Crew Units) Creations collaborates with convention centers, trade associations, and suppliers to deliver well-organized gathering experiences across Coimbatore and Tamil Nadu.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Propose a Collaboration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Partner Network Grid */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-12">
          <SectionHeader
            number="02"
            badge="ECOSYSTEM"
            title="Institutional & Venue Collaborators"
            subtitle="The network supporting MCU Creations in delivering reliable event management."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Co-Hosting Model Banner */}
      <Section spacing="lg" className="bg-white border-t border-b border-[#E8DED0]">
        <Container>
          <div className="rounded-3xl border border-[#E8DED0] bg-[#FCFBF8] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                EVENT COLLABORATION
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1E]">
                Planning a Joint Event or Expo?
              </h3>
              <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                Connect with MCU Creations for end-to-end planning, floor management, and on-ground execution.
              </p>
            </div>
            <button
              type="button"
              className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 shrink-0"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Connect with Our Team</span>
              <Handshake className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </Section>

      {/* 4. Partnership Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Enquiry Received!' : 'Propose an Event Collaboration'}
        description={
          submitted
            ? 'Our team will review your requirements and reach out promptly.'
            : 'Fill in your details below to discuss collaboration opportunities.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/25 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Collaboration Proposal Logged</h3>
            <p className="text-xs text-[#75695C] max-w-sm mx-auto">
              Thank you, <span className="text-[#3A2A1E] font-semibold">{fullName}</span> from{' '}
              <span className="text-[#3A2A1E] font-semibold">{companyName}</span>. We will review your enquiry and respond to <span className="font-mono text-[#3A2A1E]">{email}</span>.
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
                label="Your Name *"
                placeholder="e.g. S. Vignesh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Organization / Company Name *"
                placeholder="e.g. Regional Trade Association"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email *"
                type="email"
                placeholder="vignesh@association.org"
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
              label="Collaboration Focus"
              value={partnershipType}
              onChange={(e) => setPartnershipType(e.target.value)}
              options={[
                { value: 'Venue / Infrastructure', label: 'Venue / Convention Center Collaboration' },
                { value: 'Trade Chamber / Association', label: 'Trade Chamber / Association Alignment' },
                { value: 'Vendor & Staging Partner', label: 'Vendor & Staging Partner' },
                { value: 'Joint Event Management', label: 'Joint Event Management' },
              ]}
            />

            <Textarea
              label="Collaboration Scope"
              placeholder="Outline your event objectives, proposed dates, venue preferences, or delegation requirements..."
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
                {loading ? <span>Submitting...</span> : <span>Submit Proposal</span>}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
