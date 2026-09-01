'use client';

import React, { useState } from 'react';
import { Container, Section, Input, Textarea, Select, Modal } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Handshake, Award, Building, ArrowRight, ShieldCheck, CheckCircle2, Send, Users, Layers, Compass } from 'lucide-react';
import Link from 'next/link';
import { submitEnquiry } from '@/services/enquiries.service';

export function BusinessClientWrapper() {
  const [isRfpModalOpen, setIsRfpModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [budget, setBudget] = useState('₹2 Lakhs – ₹5 Lakhs');
  const [projectScope, setProjectScope] = useState('Corporate Annual Summit');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry({
        type: 'general',
        fullName,
        email,
        phone,
        companyName,
        subject: `Corporate Brief: ${projectScope} (${budget})`,
        message: `${message}\nScope: ${projectScope}\nBudget Range: ${budget}`,
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
    setIsRfpModalOpen(false);
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
                CORPORATE EVENT SOLUTIONS
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Event Management & <br />
              <span className="italic font-normal text-[#B88932]">Corporate Coordination.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              MCU (Mentor Crew Units) Creations provides professional event planning, venue coordination, and on-ground management for corporate gatherings, conclaves, and expos across Coimbatore and Tamil Nadu.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsRfpModalOpen(true)}
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
              >
                <span>Submit Event Brief</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Core Portals */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-12">
          <SectionHeader
            number="02"
            badge="ENGAGEMENT"
            title="Event Collaboration Models"
            subtitle="Explore exhibition spaces, sponsorship opportunities, or end-to-end event management."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-card p-8 flex flex-col justify-between group bg-white">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                  Exhibition Stalls
                </h3>
                <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                  Book shell scheme stalls or custom bare pavilions to showcase your business offerings.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/exhibitors" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                  <span>Explore Stalls</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="luxury-card p-8 flex flex-col justify-between group bg-white">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                  Event Sponsorship
                </h3>
                <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                  Gain main-stage presence, banner positioning, and recognition across regional gatherings.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/sponsors" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                  <span>Explore Tiers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="luxury-card p-8 flex flex-col justify-between group bg-white">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                  Turnkey Management
                </h3>
                <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed">
                  Engage MCU Creations for complete end-to-end planning, stage alignment, and on-ground coordination.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8DED0]">
                <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                  <span>Explore Capabilities</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. RFP Modal */}
      <Modal
        isOpen={isRfpModalOpen}
        onClose={submitted ? handleReset : () => setIsRfpModalOpen(false)}
        title={submitted ? 'Brief Received!' : 'Submit Corporate Event Brief'}
        description={
          submitted
            ? 'Our event coordination team will review your specifications and prepare an execution proposal.'
            : 'Share your event parameters to receive a customized coordination proposal.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/25 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Event Brief Logged</h3>
            <p className="text-xs text-[#75695C] max-w-sm mx-auto">
              Thank you, <span className="text-[#3A2A1E] font-semibold">{fullName}</span> from{' '}
              <span className="text-[#3A2A1E] font-semibold">{companyName}</span>. We will analyze your scope for <span className="text-[#B88932] font-bold">{projectScope}</span> and connect with you at <span className="font-mono text-[#3A2A1E]">{email}</span>.
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
                placeholder="e.g. S. Karthik"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Organization / Company *"
                placeholder="e.g. Nexus Enterprises"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email *"
                type="email"
                placeholder="karthik@nexus.in"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Event Format / Scope"
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                options={[
                  { value: 'Corporate Annual Summit', label: 'Corporate Annual Summit' },
                  { value: 'Industry Trade Conclave', label: 'Industry Trade Conclave' },
                  { value: 'B2B Product Launch & Expo', label: 'B2B Product Launch & Expo' },
                  { value: 'Executive Conference', label: 'Executive Conference' },
                  { value: 'Community Gathering', label: 'Community Gathering' },
                ]}
              />
              <Select
                label="Budget Range"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                options={[
                  { value: '₹2 Lakhs – ₹5 Lakhs', label: '₹2 Lakhs – ₹5 Lakhs' },
                  { value: '₹5 Lakhs – ₹15 Lakhs', label: '₹5 Lakhs – ₹15 Lakhs' },
                  { value: '₹15 Lakhs – ₹30 Lakhs', label: '₹15 Lakhs – ₹30 Lakhs' },
                  { value: 'Custom Enterprise Budget', label: 'Custom Enterprise Budget' },
                ]}
              />
            </div>

            <Textarea
              label="Event Details & Scope"
              placeholder="Outline attendee volume, dates, venue preferences, staging requirements..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DED0]">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#75695C] hover:text-[#3A2A1E]"
                onClick={() => setIsRfpModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-luxury-primary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                {loading ? <span>Submitting...</span> : <span>Submit Brief</span>}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
