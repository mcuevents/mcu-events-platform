'use client';

import React, { useState } from 'react';
import { Container, Section, Input, Textarea, Select } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { siteConfig } from '@/config/site';
import { submitEnquiry } from '@/services/enquiries.service';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { MagneticButton } from '@/components/shared/MagneticButton';

export function ContactClientWrapper() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    type: 'event' as const,
    subject: '',
    message: '',
    companyName: '',
    hp_field: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await submitEnquiry(formData);
      setLoading(false);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('An error occurred while sending your request.');
    }
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
                GET IN TOUCH
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Start Planning <br />
              <span className="italic font-normal text-[#B88932]">Your Next Gathering.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              Connect with MCU (Mentor Crew Units) Creations in Coimbatore to discuss your event parameters, schedule, venue logistics, and coordination requirements.
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Contact Details & Enquiry Form */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Contact Information Column (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Company Card */}
              <div className="luxury-card p-7 space-y-3 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DED0]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                    OFFICIAL ENTITY
                  </span>
                  <span className="font-mono text-xs text-[#75695C]">EST. 2026</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">MCU (Mentor Crew Units) Creations</h3>
                <p className="text-xs text-[#75695C] leading-relaxed">
                  Emerging event-management startup focused on planning, coordinating, and delivering memorable gatherings in Coimbatore and across Tamil Nadu.
                </p>
              </div>

              {/* Direct Lines Card */}
              <div className="luxury-card p-7 space-y-3 bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Office Direct Lines</h3>
                <div className="space-y-1 text-sm text-[#75695C]">
                  <a href="tel:7010377731" className="block hover:text-[#B88932] transition-colors font-mono font-bold text-[#2B2118]">
                    7010377731
                  </a>
                  <a href="tel:700667500" className="block hover:text-[#B88932] transition-colors font-mono font-bold text-[#2B2118]">
                    700667500
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="luxury-card p-7 space-y-3 bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Email Address</h3>
                <a href={`mailto:${siteConfig.contacts.email}`} className="text-sm text-[#75695C] font-medium hover:text-[#B88932] transition-colors block">
                  {siteConfig.contacts.email}
                </a>
              </div>

              {/* Office Address Card */}
              <div className="luxury-card p-7 space-y-3 bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2A1E]">Coimbatore Office</h3>
                <p className="text-xs text-[#75695C] leading-relaxed">
                  3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam, Coimbatore, Tamil Nadu 641004, India
                </p>
              </div>
            </div>

            {/* Contact Form Column (lg:col-span-7) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-10 lg:p-12 shadow-[0_12px_32px_rgba(43,33,24,0.03)] space-y-6">
                <div className="space-y-1 pb-4 border-b border-[#E8DED0]">
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1E]">Send an Event Enquiry</h3>
                  <p className="text-xs sm:text-sm text-[#75695C]">
                    Share your event parameters below. Our Coimbatore team will review your requirements and respond promptly.
                  </p>
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FCFBF8] rounded-2xl border border-[#E8DED0] space-y-4">
                    <div className="h-14 w-14 rounded-full bg-[#B88932]/10 text-[#B88932] flex items-center justify-center border border-[#B88932]/25">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#3A2A1E]">Enquiry Received</h4>
                    <p className="text-xs sm:text-sm text-[#75695C] max-w-md">
                      Thank you for reaching out to MCU Creations. Our team will review your specifications and get in touch with you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-luxury-primary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider mt-2"
                    >
                      Send Another Message
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

                    {/* Honeypot Spam Protection */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hp_field"
                        tabIndex={-1}
                        value={formData.hp_field}
                        onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="e.g. Senthil Kumar"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="senthil@company.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number *"
                        type="tel"
                        placeholder="7010377731"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                      <Select
                        label="Enquiry Category"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        options={[
                          { value: 'event', label: 'Event Management (End-to-End)' },
                          { value: 'exhibitor', label: 'Exhibitor / Stall Booking' },
                          { value: 'sponsor', label: 'Sponsorship Inquiries' },
                          { value: 'general', label: 'General Information' },
                        ]}
                      />
                    </div>

                    <Input
                      label="Subject *"
                      placeholder="Brief overview of your event requirement"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                    <Textarea
                      label="Event Details & Scope *"
                      placeholder="Tell us about the event dates, estimated attendee count, venue, and required coordination services..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />

                    <div className="pt-2">
                      <MagneticButton
                        as="button"
                        type="submit"
                        disabled={loading}
                        className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em]"
                      >
                        {loading ? <span>Sending Enquiry...</span> : <span>Send Enquiry</span>}
                        <Send className="h-3.5 w-3.5" />
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
