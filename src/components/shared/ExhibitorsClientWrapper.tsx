'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Input, Textarea, Select, Modal } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { submitEnquiry } from '@/services/enquiries.service';
import { CheckCircle2, Send, ArrowRight, Store } from 'lucide-react';

const STALL_PACKAGES = [
  {
    name: 'Standard Shell Scheme (3m x 3m)',
    size: '9 Sq.m',
    idealFor: 'Enterprises & Product Showcases',
    features: [
      'Modular wall panels with company fascia board',
      '1 Information counter + 2 chairs + 1 power point',
      'LED spotlights & lighting setup',
      'Exhibitor passes & directory inclusion',
    ],
    badge: 'Standard Space',
  },
  {
    name: 'Prime Corner Booth (6m x 3m)',
    size: '18 Sq.m',
    idealFor: 'Established Regional Brands & Multi-Product Displays',
    features: [
      'Dual open-side corner exposure for enhanced visitor flow',
      '2 Discussion tables + 4 chairs + reception counter',
      'Multiple LED spotlights and power points',
      'Exhibitor passes and event catalog feature',
    ],
    badge: 'Corner Visibility',
  },
  {
    name: 'Island Custom Pavilion (6m x 6m)',
    size: '36 Sq.m',
    idealFor: 'Flagship Corporate Showcases & Demonstrations',
    features: [
      'Four-side open prime central hall location',
      'Bare space ready for custom architectural fabrication',
      'Dedicated 3-phase power supply and logistics coordination',
      'Priority attendee access and catalog feature',
    ],
    badge: 'Island Pavilion',
  },
];

interface ExhibitorsClientWrapperProps {
  exhibitors: EntityPartner[];
}

export function ExhibitorsClientWrapper({ exhibitors }: ExhibitorsClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState(STALL_PACKAGES[0].name);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Manufacturing & Engineering');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBookStall = (stallName?: string) => {
    if (stallName) setSelectedStall(stallName);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry({
        type: 'exhibitor',
        fullName,
        email,
        phone,
        companyName,
        subject: `Exhibitor Space Booking: ${selectedStall} (${sector})`,
        message: `${message}\nSpace Preference: ${selectedStall}\nSector: ${sector}`,
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
                EXHIBITION SPACES
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Exhibition Stalls & <br />
              <span className="italic font-normal text-[#B88932]">Pavilion Spaces.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              Showcase your enterprise products and business services at events managed by MCU (Mentor Crew Units) Creations in Coimbatore and across Tamil Nadu.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
                onClick={() => handleBookStall()}
              >
                <span>Book Exhibition Space</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Stall Packages Grid */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-12">
          <SectionHeader
            number="02"
            badge="LAYOUTS"
            title="Stall & Pavilion Packages"
            subtitle="Standardized and custom exhibition spaces designed for optimal visitor engagement and vendor convenience."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STALL_PACKAGES.map((pkg, idx) => (
              <div
                key={pkg.name}
                className="rounded-3xl border border-[#E8DED0] bg-white p-8 flex flex-col justify-between shadow-sm hover:border-[#B88932] transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DED0]">
                    <span className="font-serif text-2xl font-light text-[#D4B06A]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B88932] font-mono">
                      {pkg.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#3A2A1E]">
                      {pkg.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-[#B88932] mt-0.5">
                      Area: {pkg.size}
                    </p>
                  </div>

                  <p className="text-xs text-[#75695C] italic">
                    Ideal for: {pkg.idealFor}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#75695C] leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E8DED0]">
                  <button
                    type="button"
                    className="w-full btn-luxury-secondary rounded-full py-3 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2"
                    onClick={() => handleBookStall(pkg.name)}
                  >
                    <span>Reserve {pkg.size}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Exhibitors Directory */}
      {exhibitors && exhibitors.length > 0 && (
        <Section spacing="lg" className="bg-white border-t border-[#E8DED0]">
          <Container className="space-y-12">
            <SectionHeader
              number="03"
              badge="DIRECTORY"
              title="Registered Exhibitors"
              subtitle="Participating enterprises and brands showcasing at MCU Creations events."
              align="left"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {exhibitors.map((exhibitor) => (
                <PartnerCard key={exhibitor.id} partner={exhibitor} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Enquiry Received!' : 'Book Exhibition Space'}
        description={
          submitted
            ? 'Our floor logistics team will send you the hall layout and stall availability confirmation.'
            : 'Submit your requirements to receive floor plans and booking parameters.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/25 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Booking Request Logged</h3>
            <p className="text-xs text-[#75695C] max-w-sm mx-auto">
              Thank you, <span className="text-[#3A2A1E] font-semibold">{fullName}</span> from{' '}
              <span className="text-[#3A2A1E] font-semibold">{companyName}</span>. We will share floor plan availability for <span className="text-[#B88932] font-bold">{selectedStall}</span> to <span className="font-mono text-[#3A2A1E]">{email}</span>.
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
                placeholder="e.g. K. Narayanan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Company / Brand Name *"
                placeholder="e.g. Premier Tech Industries"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email *"
                type="email"
                placeholder="narayanan@premiertech.in"
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
                label="Stall Space Configuration"
                value={selectedStall}
                onChange={(e) => setSelectedStall(e.target.value)}
                options={STALL_PACKAGES.map((s) => ({ value: s.name, label: `${s.size} - ${s.name}` }))}
              />
              <Select
                label="Industry Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                options={[
                  { value: 'Manufacturing & Engineering', label: 'Manufacturing & Engineering' },
                  { value: 'Automotive & Logistics', label: 'Automotive & Logistics' },
                  { value: 'Textiles & Apparel', label: 'Textiles & Apparel' },
                  { value: 'IT & Electronics', label: 'IT & Electronics' },
                  { value: 'Healthcare & Pharma', label: 'Healthcare & Pharma' },
                  { value: 'Retail & FMCG', label: 'Retail & FMCG' },
                  { value: 'General Enterprise', label: 'General Enterprise' },
                ]}
              />
            </div>

            <Textarea
              label="Stall Setup Requirements"
              placeholder="Detail your display requirements, machinery/equipment dimensions, power loads, or custom backdrop needs..."
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
                {loading ? <span>Sending...</span> : <span>Submit Request</span>}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
