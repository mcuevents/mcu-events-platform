'use client';

import React, { useState } from 'react';
import { submitEnquiry } from '@/services/enquiries.service';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const HomeContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    type: 'event' as const,
    subject: 'One Zone 2K26 Enquiry / Stall Booking',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitEnquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry. Please call us directly at 7010377731.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[#D4B06A]/40 bg-white p-8 sm:p-10 text-center space-y-4 shadow-sm animate-fade-in-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B88932]/10 text-[#B88932]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#3A2A1E]">
          Enquiry Received
        </h3>
        <p className="text-sm text-[#75695C] max-w-md mx-auto leading-relaxed">
          Thank you for contacting MCU Creations. Our executive team will reach out to you shortly regarding your event and stall booking requirements.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: '',
              email: '',
              phone: '',
              type: 'event',
              subject: 'One Zone 2K26 Enquiry / Stall Booking',
              message: '',
            });
          }}
          className="btn-luxury-secondary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-10 shadow-[0_16px_40px_rgba(43,33,24,0.04)] space-y-5"
    >
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B88932] font-mono">
          DIRECT ENQUIRY & STALL BOOKINGS
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1E]">
          Send Us an Event Brief
        </h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#75695C] block">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Your name or company representative"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full rounded-xl border border-[#E8DED0] bg-[#FCFBF8] px-4 py-3 text-xs text-[#2B2118] placeholder-[#75695C]/60 focus:border-[#B88932] focus:outline-none focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#75695C] block">
            Contact Number *
          </label>
          <input
            type="tel"
            required
            placeholder="7010377731"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-xl border border-[#E8DED0] bg-[#FCFBF8] px-4 py-3 text-xs text-[#2B2118] placeholder-[#75695C]/60 focus:border-[#B88932] focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#75695C] block">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="yourname@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-[#E8DED0] bg-[#FCFBF8] px-4 py-3 text-xs text-[#2B2118] placeholder-[#75695C]/60 focus:border-[#B88932] focus:outline-none focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#75695C] block">
            Enquiry Purpose *
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-xl border border-[#E8DED0] bg-[#FCFBF8] px-4 py-3 text-xs text-[#2B2118] focus:border-[#B88932] focus:outline-none focus:bg-white transition-colors"
          >
            <option value="One Zone 2K26 Stall Booking">One Zone 2K26 · Stall Booking (Silver / Gold / Diamond / Premium)</option>
            <option value="One Zone 2K26 Title / Co-Sponsorship">One Zone 2K26 · Sponsorship Inquiries</option>
            <option value="End-to-End Event Management Consultation">Event Management & Planning Consultation</option>
            <option value="General Business Enquiry">General Business Enquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#75695C] block">
          Requirement & Stall Specification *
        </label>
        <textarea
          rows={3}
          required
          placeholder="Tell us about your brand/products, preferred stall size (3x3, 3x4, 6x3, 6x6) or event management scope..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xl border border-[#E8DED0] bg-[#FCFBF8] px-4 py-3 text-xs text-[#2B2118] placeholder-[#75695C]/60 focus:border-[#B88932] focus:outline-none focus:bg-white transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-luxury-primary rounded-full py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
      >
        {loading ? <span>Submitting...</span> : <span>Submit Event Enquiry</span>}
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
};
