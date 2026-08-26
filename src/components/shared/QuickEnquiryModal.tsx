'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { submitEnquiry } from '@/services/enquiries.service';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'general' | 'event' | 'exhibitor' | 'sponsor' | 'partnership';
}

export function QuickEnquiryModal({
  isOpen,
  onClose,
  defaultType = 'general',
}: QuickEnquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [type, setType] = useState<any>(defaultType);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [hpField, setHpField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await submitEnquiry({
        type,
        fullName,
        email,
        phone,
        companyName,
        subject: subject || `Quick Enquiry (${type})`,
        message,
        hp_field: hpField,
      });

      setLoading(false);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('An error occurred while sending your request.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setSubject('');
    setMessage('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitted ? handleReset : onClose}
      title={submitted ? 'Enquiry Received!' : 'Quick Event Enquiry'}
      description={
        submitted
          ? 'Our team at MCU Creations will respond promptly.'
          : 'Send us a brief message and our team will get in touch.'
      }
      size="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/25 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2C241C]">Thank You, {fullName}!</h3>
          <p className="text-xs text-[#6E6258] max-w-sm mx-auto">
            Your enquiry has been received. Our team in Coimbatore will review your requirements and connect with you at <span className="text-[#2C241C] font-mono">{email}</span>.
          </p>
          <button type="button" className="w-full gold-gradient-btn rounded-full py-3 text-xs font-bold uppercase tracking-wider" onClick={handleReset}>
            Done / Close Window
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
              value={hpField}
              onChange={(e) => setHpField(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name *"
              placeholder="e.g. Senthil Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Company / Organization"
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              type="email"
              placeholder="senthil@company.in"
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
            label="Enquiry Category *"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            options={[
              { value: 'event', label: 'Event Management (End-to-End)' },
              { value: 'exhibitor', label: 'Exhibitor Stall Booking' },
              { value: 'sponsor', label: 'Sponsorship Opportunities' },
              { value: 'general', label: 'General Event Inquiry' },
            ]}
          />

          <Textarea
            label="Brief Requirements *"
            placeholder="Tell us about your event dates, booth requirements, or event objectives..."
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
              {loading ? <span>Sending...</span> : <span>Submit Enquiry</span>}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
