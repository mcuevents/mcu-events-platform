'use client';

import React, { useState } from 'react';
import { EntityPartner } from '@/types/partners';
import { Container, Section, Button, Input, Textarea, Select, Modal } from '@/components/ui';
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
    <div>
      {/* 1. Hero */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Strategic Alliances
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Collaborate & Co-Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Mega Summits</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              We partner with premier trade exhibition centers, trade chambers, media organizations, and industry bodies to produce landmark conventions across South India.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Propose a Partnership
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Partner Network Grid */}
      <Section spacing="md">
        <Container space-y-10>
          <SectionHeader
            badge="Ecosystem"
            title="Institutional & Venue Partners"
            subtitle="The foundational network enabling MCU Creations to deliver stadium-scale event excellence."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Co-Hosting Model Banner */}
      <Section spacing="sm" className="bg-dark-950/70 border-t border-b border-dark-800">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-dark-900 via-dark-900 to-dark-950 border border-dark-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-bold text-white">Looking to Co-Host an Industry Expo?</h3>
              <p className="text-sm text-dark-300">
                Are you an association or chamber looking for turnkey event management, ticket funnels, and sponsor monetization? Partner with MCU Creations.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="shrink-0"
              onClick={() => setIsModalOpen(true)}
              rightIcon={<Handshake className="h-4 w-4" />}
            >
              Start Co-Hosting Dialogue
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Partnership Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={submitted ? handleReset : () => setIsModalOpen(false)}
        title={submitted ? 'Partnership Enquiry Received!' : 'Propose a Partnership'}
        description={
          submitted
            ? 'Our leadership team will reach out to schedule an introductory alignment call.'
            : 'Fill in your organization details to explore co-hosting or strategic alliance.'
        }
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Proposal Received</h3>
            <p className="text-xs text-dark-300 max-w-sm mx-auto">
              Thank you, <span className="text-white font-medium">{fullName}</span> from{' '}
              <span className="text-white font-medium">{companyName}</span>. We will review your collaboration proposal and get back to you shortly.
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
                placeholder="e.g. S. Vignesh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Organization / Chamber Name *"
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
                placeholder="+91 98421 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Select
              label="Partnership Category"
              value={partnershipType}
              onChange={(e) => setPartnershipType(e.target.value)}
              options={[
                { value: 'Venue / Infrastructure', label: 'Venue / Convention Center Alliance' },
                { value: 'Trade Chamber / Association', label: 'Trade Chamber / Industry Association' },
                { value: 'Media & Broadcasting Network', label: 'Media & Broadcasting Network' },
                { value: 'Co-Hosted Expo / Summit', label: 'Joint / Co-Hosted Expo Proposal' },
              ]}
            />

            <Textarea
              label="Collaboration Synopsis"
              placeholder="Outline your proposal, proposed summit dates, venue capacity, or delegation strength..."
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
                Submit Proposal
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
