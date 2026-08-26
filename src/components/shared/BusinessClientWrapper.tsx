'use client';

import React, { useState } from 'react';
import { Container, Section, Card, Button, Input, Textarea, Select, Modal } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Handshake, Award, Building, ArrowRight, ShieldCheck, CheckCircle2, Send, BarChart3, Users, Layers, Compass } from 'lucide-react';
import Link from 'next/link';
import { submitEnquiry } from '@/services/enquiries.service';

export function BusinessClientWrapper() {
  const [isRfpModalOpen, setIsRfpModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [budget, setBudget] = useState('₹5 Lakhs – ₹15 Lakhs');
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
        subject: `Corporate RFP: ${projectScope} (${budget})`,
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
    <div className="bg-[#FAF8F5]">
      {/* 1. Hero */}
      <div className="py-16 lg:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F8F5EE] to-[#FAF8F5] border-b border-[#EAE0D5]">
        <Container>
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="text-[#B8862B] text-xs">◆</span>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#B8862B] font-mono">
                B2B EVENT SOLUTIONS
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-[#2C241C] leading-tight">
              Event Management & <span className="text-[#B8862B]">Corporate Coordination</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E6258] leading-relaxed">
              MCU Creations provides professional event planning, venue coordination, and on-ground management for conferences, trade expos, and corporate gatherings.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsRfpModalOpen(true)}
                className="gold-gradient-btn rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] flex items-center gap-2"
              >
                <span>Submit Event Brief</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Core Portals */}
      <Section spacing="lg">
        <Container className="space-y-12">
          <SectionHeader
            badge="ENGAGEMENT"
            title="Choose Your Event Partnership Model"
            subtitle="Explore exhibitor spaces, sponsorship opportunities, or event management collaborations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-between p-8 bg-white border border-[#EAE0D5] rounded-3xl shadow-sm hover:border-[#B8862B]/50 transition-colors">
              <div className="space-y-4">
                <span className="font-serif text-3xl font-light text-[#D4AF6A]">01</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C241C]">Exhibitors & Stalls</h3>
                  <p className="text-xs sm:text-sm text-[#6E6258] mt-2 leading-relaxed">
                    Book dedicated stalls and pavilion displays at upcoming expos to showcase your brand and connect with attendees.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F3ECE4]">
                <Link href="/events">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] hover:text-[#9E701C] transition-colors">
                    <span>View Upcoming Expos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 bg-white border border-[#EAE0D5] rounded-3xl shadow-sm hover:border-[#B8862B]/50 transition-colors">
              <div className="space-y-4">
                <span className="font-serif text-3xl font-light text-[#D4AF6A]">02</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C241C]">Event Sponsors</h3>
                  <p className="text-xs sm:text-sm text-[#6E6258] mt-2 leading-relaxed">
                    Feature your organization across stage backdrops, event branding, directional displays, and delegate passes.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F3ECE4]">
                <Link href="/contact">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] hover:text-[#9E701C] transition-colors">
                    <span>Request Sponsor Deck</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 bg-white border border-[#EAE0D5] rounded-3xl shadow-sm hover:border-[#B8862B]/50 transition-colors">
              <div className="space-y-4">
                <span className="font-serif text-3xl font-light text-[#D4AF6A]">03</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C241C]">Turnkey Event Management</h3>
                  <p className="text-xs sm:text-sm text-[#6E6258] mt-2 leading-relaxed">
                    Collaborate with MCU Creations for end-to-end conference coordination, venue logistics, and on-ground supervision.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F3ECE4]">
                <button
                  type="button"
                  onClick={() => setIsRfpModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] hover:text-[#9E701C] transition-colors"
                >
                  <span>Submit Event Brief</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Capability Pillars */}
      <Section spacing="lg" className="bg-gradient-to-b from-[#FAF8F5] via-[#F8F5EE] to-[#FAF8F5] border-t border-b border-[#EAE0D5]">
        <Container className="space-y-12">
          <SectionHeader
            badge="WHY MCU CREATIONS"
            title="Dedicated Event Operations Support"
            subtitle="We handle the planning and logistics so you can focus on building meaningful connections."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EAE0D5] space-y-3 shadow-sm">
              <Compass className="h-6 w-6 text-[#B8862B]" />
              <h4 className="font-serif text-base font-bold text-[#2C241C]">Structured Planning</h4>
              <p className="text-xs text-[#6E6258] leading-relaxed">
                Detailed schedule design, floor layouts, and contingency frameworks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE0D5] space-y-3 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-[#B8862B]" />
              <h4 className="font-serif text-base font-bold text-[#2C241C]">Venue Coordination</h4>
              <p className="text-xs text-[#6E6258] leading-relaxed">
                On-site logistics management, stage support, and vendor alignment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE0D5] space-y-3 shadow-sm">
              <Users className="h-6 w-6 text-[#B8862B]" />
              <h4 className="font-serif text-base font-bold text-[#2C241C]">Guest & Delegate Reception</h4>
              <p className="text-xs text-[#6E6258] leading-relaxed">
                Attendee assistance, helpdesk support, and smooth check-in flow.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE0D5] space-y-3 shadow-sm">
              <Layers className="h-6 w-6 text-[#B8862B]" />
              <h4 className="font-serif text-base font-bold text-[#2C241C]">Staging & Branding</h4>
              <p className="text-xs text-[#6E6258] leading-relaxed">
                Stage backdrops, directional signage, and hall layout setup.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. RFP Modal */}
      <Modal
        isOpen={isRfpModalOpen}
        onClose={submitted ? handleReset : () => setIsRfpModalOpen(false)}
        title={submitted ? 'Event Brief Dispatched!' : 'Submit Event Brief / RFP'}
        description={
          submitted
            ? 'Our operations team will review your project parameters and get back to you promptly.'
            : 'Provide event parameters to receive a custom plan and quotation.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] mx-auto border border-[#B8862B]/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C241C]">Event Brief Received</h3>
            <p className="text-xs text-[#6E6258] max-w-sm mx-auto">
              Thank you, <span className="text-[#2C241C] font-medium">{fullName}</span> ({companyName}). We will review your project requirements and connect via <span className="text-[#B8862B] font-mono">{phone}</span>.
            </p>
            <button type="button" className="w-full gold-gradient-btn rounded-full py-3 text-xs font-bold uppercase tracking-wider" onClick={handleReset}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. R. Subramanian"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Enterprise / Organization *"
                placeholder="e.g. Kovai Industrial Group"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address *"
                type="email"
                placeholder="subramanian@company.com"
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
                label="Project Scope"
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                options={[
                  { value: 'Corporate Annual Summit', label: 'Corporate Annual Summit / Conclave' },
                  { value: 'Turnkey Exhibition / Trade Fair', label: 'Turnkey Exhibition / Trade Fair' },
                  { value: 'Dealer Meet & Product Launch', label: 'Dealer Meet & Product Launch' },
                  { value: 'Event Management & Staging', label: 'Event Management & Staging' },
                ]}
              />
              <Select
                label="Estimated Budget Range"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                options={[
                  { value: '₹2 Lakhs – ₹5 Lakhs', label: '₹2 Lakhs – ₹5 Lakhs' },
                  { value: '₹5 Lakhs – ₹15 Lakhs', label: '₹5 Lakhs – ₹15 Lakhs' },
                  { value: '₹15 Lakhs – ₹50 Lakhs', label: '₹15 Lakhs – ₹50 Lakhs' },
                  { value: '₹50 Lakhs+', label: '₹50 Lakhs+ (Mega Summit)' },
                ]}
              />
            </div>

            <Textarea
              label="Event Brief & Details"
              placeholder="Describe venue location preferences, expected attendee count, staging requirements..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-3 border-t border-[#F3ECE4]">
              <Button type="button" variant="ghost" onClick={() => setIsRfpModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={loading}
                className="gold-gradient-btn rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {loading ? <span>Sending...</span> : <span>Submit Brief</span>}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
