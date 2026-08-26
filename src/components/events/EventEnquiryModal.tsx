'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { submitEnquiry } from '@/services/enquiries.service';
import { CheckCircle2, Send, AlertCircle, HelpCircle } from 'lucide-react';
import { Event } from '@/types/events';

export type EventEnquiryMode = 'event' | 'exhibitor' | 'sponsor' | 'general';

interface EventEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  mode?: EventEnquiryMode;
}

export function EventEnquiryModal({
  isOpen,
  onClose,
  event,
  mode = 'event',
}: EventEnquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('Retail & Franchising');
  const [stallType, setStallType] = useState('Modular Shell Scheme (9 Sq.m)');
  const [sponsorTier, setSponsorTier] = useState('Platinum Title Sponsor');
  const [message, setMessage] = useState('');
  const [hpField, setHpField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const getTitle = () => {
    switch (mode) {
      case 'exhibitor':
        return `Exhibitor Booth Booking — ${event.title}`;
      case 'sponsor':
        return `Sponsorship Enquiry — ${event.title}`;
      case 'event':
      default:
        return `Enquiry for ${event.title}`;
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'exhibitor':
        return 'Submit your company details to receive floor plans and stall confirmation.';
      case 'sponsor':
        return 'Request custom sponsorship deliverables and delegate passes.';
      case 'event':
      default:
        return 'Have questions about delegate badges, venue, or speaking slots? Reach out to our organizing team.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const subject =
      mode === 'exhibitor'
        ? `Exhibitor Booking: ${stallType} — ${event.title}`
        : mode === 'sponsor'
        ? `Sponsorship Deck: ${sponsorTier} — ${event.title}`
        : `Event Enquiry — ${event.title}`;

    const metadata: Record<string, any> = {
      eventSlug: event.slug,
      eventName: event.title,
    };
    if (mode === 'exhibitor') {
      metadata.industry = industry;
      metadata.stallPreference = stallType;
    }
    if (mode === 'sponsor') {
      metadata.tierPreference = sponsorTier;
    }

    try {
      const res = await submitEnquiry({
        type: mode,
        fullName,
        email,
        phone,
        companyName: companyName || undefined,
        designation: designation || undefined,
        subject,
        message,
        eventId: event.id,
        eventName: event.title,
        metadata,
        hp_field: hpField,
      });

      setLoading(false);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to transmit enquiry. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('An unexpected error occurred while sending your request.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setDesignation('');
    setMessage('');
    setHpField('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitted ? handleReset : onClose}
      title={submitted ? 'Enquiry Transmitted!' : getTitle()}
      description={
        submitted
          ? 'Our organizing team will get in touch with you shortly.'
          : getDescription()
      }
      size="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/30 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#2C241C]">Thank You, {fullName}!</h3>
            <p className="text-sm text-[#6E6258]">
              Your {mode === 'exhibitor' ? 'exhibitor booking' : mode === 'sponsor' ? 'sponsorship request' : 'event enquiry'} for <span className="text-[#2C241C] font-semibold">{event.title}</span> has been logged.
            </p>
          </div>

          <p className="text-xs text-[#7A6D62]">
            A confirmation reference has been recorded for <span className="text-[#2C241C] font-mono">{email}</span>.
          </p>

          <button
            type="button"
            className="w-full gold-gradient-btn rounded-full py-3.5 text-xs font-bold uppercase tracking-wider mt-4"
            onClick={handleReset}
          >
            Back to Event Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Honeypot Spam Protection (hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="hp_field"
              tabIndex={-1}
              value={hpField}
              onChange={(e) => setHpField(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name *"
              placeholder="e.g. Anand Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Official Email *"
              type="email"
              placeholder="anand@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number *"
              type="tel"
              placeholder="7010377731"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Company / Brand Name"
              placeholder="e.g. Apex Enterprises"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required={mode === 'exhibitor' || mode === 'sponsor'}
            />
          </div>

          {mode === 'exhibitor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Stall Space Scheme"
                value={stallType}
                onChange={(e) => setStallType(e.target.value)}
                options={[
                  { value: 'Modular Shell Scheme (9 Sq.m)', label: 'Modular Shell Scheme (9 Sq.m)' },
                  { value: 'Prime Corner Booth (18 Sq.m)', label: 'Prime Corner Booth (18 Sq.m)' },
                  { value: 'Island Custom Pavilion (36 Sq.m)', label: 'Island Custom Pavilion (36 Sq.m)' },
                  { value: 'Bare Space Fabrication Ready', label: 'Bare Space (Custom Build)' },
                ]}
              />
              <Select
                label="Industry Sector"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={[
                  { value: 'Retail & Franchising', label: 'Retail & Franchising' },
                  { value: 'Food & Beverage (QSR)', label: 'Food & Beverage (QSR)' },
                  { value: 'Healthcare & Wellness', label: 'Healthcare & Wellness' },
                  { value: 'Education & EdTech', label: 'Education & EdTech' },
                  { value: 'Automotive & EV', label: 'Automotive & EV' },
                  { value: 'IT & Software SaaS', label: 'IT & Software SaaS' },
                ]}
              />
            </div>
          )}

          {mode === 'sponsor' && (
            <Select
              label="Preferred Sponsorship Category"
              value={sponsorTier}
              onChange={(e) => setSponsorTier(e.target.value)}
              options={[
                { value: 'Platinum Title Sponsor', label: 'Platinum Title Sponsor (Co-Branded)' },
                { value: 'Gold Associate Sponsor', label: 'Gold Associate Sponsor' },
                { value: 'Silver Sponsor', label: 'Silver Supporting Sponsor' },
                { value: 'Media & Official Partner', label: 'Media & Official Partner' },
              ]}
            />
          )}

          <Textarea
            label="Your Message / Query *"
            placeholder={
              mode === 'exhibitor'
                ? 'Specify any specific stall location preferences, power requirements, or product demo setups...'
                : mode === 'sponsor'
                ? 'Describe your branding objectives, target attendee demographic, or stage speaking requirements...'
                : 'How can our organizing team assist you regarding passes, schedule, or venue accessibility?'
            }
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-3 border-t border-[#F3ECE4]">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={loading}
              className="gold-gradient-btn rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              {loading ? <span>Sending...</span> : <span>{mode === 'exhibitor' ? 'Submit Stall Request' : mode === 'sponsor' ? 'Request Sponsor Kit' : 'Send Event Message'}</span>}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
