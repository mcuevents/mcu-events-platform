'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { submitEnquiry } from '@/services/enquiries.service';
import { CheckCircle2, Send, Sparkles } from 'lucide-react';
import { ServiceItem } from '@/types/cms';

interface ServiceQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  defaultService?: string;
}

export function ServiceQuoteModal({
  isOpen,
  onClose,
  services,
  defaultService,
}: ServiceQuoteModalProps) {
  const [selectedService, setSelectedService] = useState(
    defaultService || (services.length > 0 ? services[0].title : 'Event Management')
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry({
        type: 'event',
        fullName,
        email,
        phone,
        companyName,
        subject: `Event Capability Quotation: ${selectedService}`,
        message: `${message}\nSelected Service Area: ${selectedService}`,
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
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitted ? handleReset : onClose}
      title={submitted ? 'Enquiry Logged!' : 'Request Event Quotation'}
      description={
        submitted
          ? 'Our team will analyze your requirements and respond promptly.'
          : 'Select your scope area and share your event parameters.'
      }
      size="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/25 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2C241C]">Quotation Request Logged</h3>
          <p className="text-xs text-[#6E6258] max-w-sm mx-auto">
            Thank you, <span className="text-[#2C241C] font-semibold">{fullName}</span> from{' '}
            <span className="text-[#2C241C] font-semibold">{companyName || 'your team'}</span>. We will prepare an event plan for <span className="text-[#B8862B] font-bold">{selectedService}</span> and send it to <span className="text-[#2C241C] font-mono">{email}</span>.
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
              placeholder="e.g. M. Rajesh"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Company / Organization"
              placeholder="e.g. Acme Enterprises"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              type="email"
              placeholder="rajesh@company.com"
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
            label="Service Area"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            options={
              services.length > 0
                ? services.map((s) => ({ value: s.title, label: s.title }))
                : [
                    { value: 'Event Management', label: 'Event Management (End-to-End)' },
                    { value: 'Event Planning & Logistics', label: 'Event Planning & Logistics' },
                    { value: 'Guest Experience & Hospitality', label: 'Guest Experience & Hospitality' },
                  ]
            }
          />

          <Textarea
            label="Event Parameters & Requirements"
            placeholder="Tell us about your event timeline, expected attendee count, venue preferences, or staging requirements..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
              {loading ? <span>Sending...</span> : <span>Send Request</span>}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
