'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Card, Button, Input, Textarea, Select, Modal, Badge } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { submitEnquiry } from '@/services/enquiries.service';
import { CheckCircle2, Send, ArrowRight } from 'lucide-react';

const STALL_PACKAGES = [
  {
    name: 'Standard Shell Scheme (3m x 3m)',
    size: '9 Sq.m',
    idealFor: 'Startups, D2C Retail & Single Franchise Concepts',
    features: [
      'Modular Octanorm Wall Panels with Company Fascia Board',
      '1 Information Counter + 2 Chairs + 1 Waste Bin',
      '3 LED Spotlights & 5A Power Point',
      '2 Free Exhibitor Badges + Standard Catalog Listing',
    ],
    badge: 'Popular Choice',
  },
  {
    name: 'Prime Corner Booth (6m x 3m)',
    size: '18 Sq.m',
    idealFor: 'Established Regional Brands & Multi-Unit Franchises',
    features: [
      'Dual Open-Side Corner Exposure for 2X Footfall',
      '2 Discussion Tables + 6 Chairs + Lockable Reception Counter',
      '6 LED Spotlights & 15A Power Point Supply',
      '4 Exhibitor Badges + Half-Page Event Catalog Feature',
      'Mobile QR Lead Scanner App Access',
    ],
    badge: 'High Visibility',
  },
  {
    name: 'Island Custom Pavilion (6m x 6m)',
    size: '36 Sq.m',
    idealFor: 'National Brands, Heavy Equipment & Auto Pavilions',
    features: [
      'Four-Side Open Prime Central Hall Location',
      'Custom 3D Fabrication Ready Bare Space',
      '3-Phase 32A Power Supply + High-Speed Venue Mesh WiFi',
      '8 Exhibitor Badges + Full-Page Color Catalog Feature',
      'Stage Product Launch Slot & Press Release Distribution',
    ],
    badge: 'Flagship Space',
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
  const [sector, setSector] = useState('Retail & FMCG');
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
        subject: `Exhibitor Stall Booking: ${selectedStall} (${sector})`,
        message: `${message}\nStall Preference: ${selectedStall}\nSector: ${sector}`,
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
    <div>
      {/* 1. Hero Header */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Exhibitor & Vendor Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Showcase Your Brand to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">10,000+ Buyers</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              Book your exhibition stall at MCU Creations business expos. Connect with verified franchise investors, distributors, and corporate buyers.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleBookStall()}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Reserve Stall Space
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Stall Schemes & Sizes */}
      <Section spacing="md">
        <Container space-y-12>
          <SectionHeader
            badge="Stall Packages"
            title="Choose Your Exhibition Space"
            subtitle="Standardized octanorm modular stalls and bare space pavilions designed for maximum visitor engagement."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STALL_PACKAGES.map((pkg) => (
              <Card key={pkg.name} className="flex flex-col justify-between p-6 border-dark-800 hover:border-brand-500/40 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="gold">{pkg.badge}</Badge>
                    <span className="font-mono text-xs font-bold text-dark-300">{pkg.size}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="text-xs text-dark-400 mt-1">{pkg.idealFor}</p>
                  </div>

                  <div className="pt-4 border-t border-dark-800 space-y-2.5">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-dark-300">
                        <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-dark-800">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleBookStall(pkg.name)}
                  >
                    Enquire for {pkg.name.split(' ')[0]}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Featured Active Exhibitors */}
      <Section spacing="md" className="bg-dark-950/60 border-t border-b border-dark-800">
        <Container space-y-10>
          <SectionHeader
            badge="Directory"
            title="Featured Brands & Past Exhibitors"
            subtitle="Explore leading businesses and franchise networks that participate in MCU Creations summits."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exhibitors.map((exhibitor) => (
              <PartnerCard key={exhibitor.id} partner={exhibitor} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Stall Enquiry Received!' : 'Book an Exhibitor Stall'}
        description={
          submitted
            ? 'Our expo floor manager will reach out within 2 business hours.'
            : 'Fill in your brand and stall preference below.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Stall Request Registered</h3>
            <p className="text-xs text-dark-300 max-w-sm mx-auto">
              Thank you, <span className="text-white font-medium">{fullName}</span> from{' '}
              <span className="text-white font-medium">{companyName || 'your company'}</span>. We have sent the floor plan and pricing to <span className="text-dark-200">{email}</span>.
            </p>
            <Button variant="primary" className="w-full" onClick={handleReset}>
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Your Name *"
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Company / Brand Name *"
                placeholder="e.g. Chai Kings"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address *"
                type="email"
                placeholder="sales@chaikings.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone / WhatsApp *"
                type="tel"
                placeholder="+91 98421 88900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Stall Scheme"
                value={selectedStall}
                onChange={(e) => setSelectedStall(e.target.value)}
                options={STALL_PACKAGES.map((p) => ({ value: p.name, label: p.name }))}
              />
              <Select
                label="Business Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                options={[
                  { value: 'Food & Beverage', label: 'Food & Beverage (QSR)' },
                  { value: 'Retail & FMCG', label: 'Retail & FMCG' },
                  { value: 'Education & EdTech', label: 'Education & EdTech' },
                  { value: 'Automotive & EV', label: 'Automotive & EV' },
                  { value: 'IT & Software SaaS', label: 'IT & Software SaaS' },
                  { value: 'Healthcare & Wellness', label: 'Healthcare & Wellness' },
                ]}
              />
            </div>

            <Textarea
              label="Stall Requirements / Remarks"
              placeholder="Specify custom booth requirements, power needs, or preferred stall numbers on floor plan..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                rightIcon={<Send className="h-4 w-4" />}
              >
                Submit Stall Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
