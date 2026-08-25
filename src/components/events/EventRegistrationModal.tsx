'use client';

import React, { useState } from 'react';
import { Event, TicketType, RegistrationType } from '@/types/events';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { submitEventRegistration } from '@/services/enquiries.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle2, Ticket, Users, AlertCircle, Sparkles, Calendar, MapPin, Building, ShieldCheck } from 'lucide-react';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  initialTicket?: TicketType;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  initialTicket,
}: EventRegistrationModalProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketType>(
    initialTicket ||
      event.ticketTypes?.[0] || {
        id: 'default',
        name: 'Standard Pass',
        price: 0,
        currency: 'INR',
        available: 100,
      }
  );
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('visitor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [notes, setNotes] = useState('');
  const [hpField, setHpField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const totalPrice = (selectedTicket?.price || 0) * attendeesCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsDuplicate(false);

    try {
      const res = await submitEventRegistration({
        eventId: event.id,
        ticketTypeId: selectedTicket.id,
        registrationType,
        fullName,
        email,
        phone,
        companyName,
        designation,
        attendeesCount,
        notes,
        hp_field: hpField,
      });

      setLoading(false);

      if (res.success) {
        setConfirmationCode(res.referenceCode || `MCU-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        if (res.isDuplicate) {
          setIsDuplicate(true);
        }
        setError(res.error || 'Registration failed. Please check your information and try again.');
      }
    } catch {
      setLoading(false);
      setError('An unexpected network error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setConfirmationCode(null);
    setIsDuplicate(false);
    setAttendeesCount(1);
    setRegistrationType('visitor');
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setDesignation('');
    setNotes('');
    setHpField('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={confirmationCode ? handleReset : onClose}
      title={confirmationCode ? 'Registration Confirmed!' : `Register for ${event.title}`}
      description={
        confirmationCode
          ? 'Your delegate registration has been recorded.'
          : 'Select your pass tier and complete delegate credentials below.'
      }
      size="lg"
    >
      {confirmationCode ? (
        <div className="space-y-6 text-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/30 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#2C241C]">Thank You, {fullName}!</h3>
            <p className="text-sm text-[#6E6258]">
              Your delegate registration for <span className="text-[#2C241C] font-semibold">{event.title}</span> has been confirmed.
            </p>
          </div>

          {/* Reference Pass Box */}
          <div className="rounded-2xl bg-[#FAF8F5] border border-[#EAE0D5] p-6 text-left space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-[#EAE0D5]">
              <span className="text-[#6E6258] font-medium">Pass Reference ID</span>
              <span className="font-mono font-bold text-[#B8862B] bg-white px-3 py-1 rounded-md border border-[#EAE0D5] tracking-wider">
                {confirmationCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#7A6D62] block">Ticket Tier</span>
                <span className="font-semibold text-[#2C241C]">{selectedTicket.name}</span>
              </div>
              <div>
                <span className="text-[#7A6D62] block">Total Delegates</span>
                <span className="font-semibold text-[#2C241C]">{attendeesCount} Person(s)</span>
              </div>
              <div>
                <span className="text-[#7A6D62] block">Registration Profile</span>
                <span className="font-semibold text-[#2C241C] capitalize">{registrationType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[#7A6D62] block">Total Amount</span>
                <span className="font-bold text-[#B8862B] font-mono">
                  {totalPrice === 0 ? 'FREE REGISTRATION' : formatCurrency(totalPrice, selectedTicket.currency)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE0D5] text-xs text-[#6E6258] flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#B8862B] shrink-0" />
              <span>{event.locationName}, {event.city}</span>
            </div>
          </div>

          <p className="text-xs text-[#7A6D62] leading-relaxed">
            Please keep your reference ID handy at the venue registration counter.
          </p>

          <button
            type="button"
            className="w-full gold-gradient-btn rounded-full py-3.5 text-xs font-bold uppercase tracking-wider"
            onClick={handleReset}
          >
            Done / Back to Event
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs ${
                isDuplicate
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
                {isDuplicate && (
                  <p className="text-[11px] text-amber-700">
                    If you require changes or pass reassignment, please reach out directly at {event.organizerEmail || 'info@mcucreations.com'}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Honeypot Spam Field (hidden) */}
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

          {/* 1. Ticket Selection Grid */}
          {event.ticketTypes && event.ticketTypes.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C241C] font-mono">
                1. Select Pass Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.ticketTypes.map((ticket) => {
                  const isSelected = selectedTicket.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? 'border-[#B8862B] bg-[#B8862B]/5 shadow-sm ring-1 ring-[#B8862B]'
                          : 'border-[#EAE0D5] bg-white hover:border-[#B8862B]/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-serif text-sm font-bold text-[#2C241C]">{ticket.name}</span>
                        <span className="text-xs font-bold text-[#B8862B] font-mono">
                          {ticket.price === 0 ? 'FREE' : formatCurrency(ticket.price, ticket.currency)}
                        </span>
                      </div>
                      {ticket.description && (
                        <p className="text-xs text-[#6E6258] mt-1 line-clamp-2 leading-relaxed">
                          {ticket.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Number of Passes & Registration Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-[#EAE0D5] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#2C241C] block">Delegates Count</span>
                <span className="text-[11px] text-[#7A6D62]">Total badges requested</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttendeesCount(Math.max(1, attendeesCount - 1))}
                  className="h-8 w-8 rounded-lg bg-[#FAF8F5] border border-[#EAE0D5] text-[#2C241C] hover:bg-[#F3ECE4] flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono font-bold text-[#2C241C] text-sm">
                  {attendeesCount}
                </span>
                <button
                  type="button"
                  onClick={() => setAttendeesCount(Math.min(10, attendeesCount + 1))}
                  className="h-8 w-8 rounded-lg bg-[#FAF8F5] border border-[#EAE0D5] text-[#2C241C] hover:bg-[#F3ECE4] flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>

            <Select
              label="Registration Profile"
              value={registrationType}
              onChange={(e) => setRegistrationType(e.target.value as RegistrationType)}
              options={[
                { value: 'visitor', label: 'Trade Visitor / Delegate' },
                { value: 'exhibitor', label: 'Prospective Exhibitor' },
                { value: 'sponsor', label: 'Prospective Sponsor' },
                { value: 'business_enquiry', label: 'Investor / B2B Matchmaking' },
                { value: 'other', label: 'Media / Other Guest' },
              ]}
            />
          </div>

          {/* 3. Delegate Contact Credentials */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2C241C] font-mono">
              2. Delegate Credentials
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Anand Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="anand@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone / WhatsApp Number *"
                type="tel"
                placeholder="7010377731"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Company / Enterprise"
                placeholder="e.g. Apex Enterprises"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <Input
              label="Designation / Role"
              placeholder="e.g. Managing Director / Marketing Head"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <Textarea
              label="Special Notes / Requirements"
              placeholder="Any specific venue assistance or B2B meeting requests..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* 4. Total Summary & Confirm Button */}
          <div className="pt-4 border-t border-[#F3ECE4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#7A6D62] block">Total Summary ({attendeesCount} Pass)</span>
              <span className="font-serif text-lg font-bold text-[#2C241C]">
                {totalPrice === 0 ? 'FREE ENTRY' : formatCurrency(totalPrice, selectedTicket.currency)}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={loading}
                className="gold-gradient-btn rounded-full px-8 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 flex-1 sm:flex-initial justify-center"
              >
                {loading ? <span>Processing...</span> : <span>Confirm Registration</span>}
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
