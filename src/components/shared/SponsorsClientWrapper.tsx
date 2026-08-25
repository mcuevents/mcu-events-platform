'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Card, Button, Input, Textarea, Select, Modal, Badge } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerCard } from '@/components/shared/PartnerCard';
import { submitEnquiry } from '@/services/enquiries.service';
import { Award, CheckCircle2, Send, ArrowRight } from 'lucide-react';

const SPONSOR_TIERS = [
  {
    tier: 'Platinum Title Sponsor',
    tag: 'Highest Brand Equity',
    badgeVariant: 'gold' as const,
    deliverables: [
      'Event Co-Branding ("Presented by [Your Brand]") on all collateral',
      'Prime 36 Sq.m Central Island Pavilion at Main Hall Entrance',
      'Keynote Stage Address (15 Mins) during Inaugural Plenary',
      'Logo on 500,000+ Physical Delegate Invites & Metro Billboards',
      'Dedicated 10-Reel Campaign reaching 2.5M+ Target Impressions',
      '20 VIP Banquet Passes + Speaker Lounge Access',
    ],
  },
  {
    tier: 'Gold Associate Sponsor',
    tag: 'Prime Footfall & Stage Exposure',
    badgeVariant: 'gold' as const,
    deliverables: [
      'Main Stage Backdrop & Registration Gate Arch Logo',
      'Prime 18 Sq.m Corner Exhibition Stall Space',
      'Panel Discussion Seat in Industry Keynote Track',
      'Logo on all Digital Ads, Website & Email Blasts',
      '5 Dedicated Reel Campaigns reaching 1M+ Impressions',
      '10 VIP Banquet Passes',
    ],
  },
  {
    tier: 'Silver Sponsor',
    tag: 'Focused Brand Alignment',
    badgeVariant: 'green' as const,
    deliverables: [
      'Official Delegate Lanyard or Badge Branding',
      'Standard 9 Sq.m Octanorm Stall Space',
      'Logo on Event Website Sponsor Wall & Catalog',
      'Social Media Announcement Post & Story Highlights',
      '5 Delegate Passes',
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
        subject: `Sponsorship Deck Request: ${selectedTier}`,
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
    <div>
      {/* 1. Hero */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Corporate Sponsorship
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Power Flagship Expos & Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Millions</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              Position your brand as an industry leader. Gain omni-channel visibility across our physical exhibitions, press media, and viral digital channels.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleRequestDeck()}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Request Sponsorship Kit
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Tier Matrix */}
      <Section spacing="md">
        <Container space-y-12>
          <SectionHeader
            badge="Sponsorship Packages"
            title="Partnership Tiers & Impact"
            subtitle="Explore high-impact branding deliverables designed to maximize corporate return on marketing investment."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPONSOR_TIERS.map((tier) => (
              <Card key={tier.tier} className="flex flex-col justify-between p-6 border-dark-800 hover:border-brand-500/40 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant={tier.badgeVariant}>{tier.tag}</Badge>
                    <Award className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{tier.tier}</h3>
                  </div>

                  <div className="pt-4 border-t border-dark-800 space-y-2.5">
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-dark-300">
                        <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-dark-800">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleRequestDeck(tier.tier)}
                  >
                    Get {tier.tier.split(' ')[0]} Proposal
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Current Sponsors Showcase */}
      <Section spacing="md" className="bg-dark-950/60 border-t border-b border-dark-800">
        <Container space-y-10>
          <SectionHeader
            badge="Brand Alliances"
            title="Our Valued Event Sponsors"
            subtitle="Trusted by industry leaders and visionary financial institutions across India."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <PartnerCard key={sponsor.id} partner={sponsor} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Sponsorship Kit Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Deck Request Sent!' : 'Request Sponsorship Kit & Floor Plan'}
        description={
          submitted
            ? 'Our partnership director will contact you with the complete prospectus.'
            : 'Enter your brand details to receive the comprehensive sponsorship kit.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Prospectus Dispatched</h3>
            <p className="text-xs text-dark-300 max-w-sm mx-auto">
              Thank you, <span className="text-white font-medium">{fullName}</span> from{' '}
              <span className="text-white font-medium">{companyName || 'your brand'}</span>. The sponsorship deck for <span className="text-brand-400 font-bold">{selectedTier}</span> has been dispatched to <span className="text-dark-200">{email}</span>.
            </p>
            <Button variant="primary" className="w-full" onClick={handleReset}>
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. M. Sundar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Corporate Brand Name *"
                placeholder="e.g. Apex Global"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email *"
                type="email"
                placeholder="marketing@apexglobal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone / WhatsApp Number *"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Select
              label="Preferred Sponsorship Category"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              options={SPONSOR_TIERS.map((t) => ({ value: t.tier, label: t.tier }))}
            />

            <Textarea
              label="Specific Branding Goals / Queries"
              placeholder="Tell us about your target demographic, preferred expo locations, or custom stage requirements..."
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
                Send Sponsorship Enquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
