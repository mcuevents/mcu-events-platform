'use client';

import React, { useState } from 'react';
import { Event, TicketType } from '@/types/events';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';
import { Ticket, Sparkles, ShieldCheck, Mail, HelpCircle, Store, Award, AlertCircle, Phone, Lock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { EventEnquiryModal, EventEnquiryMode } from '@/components/events/EventEnquiryModal';

interface EventDetailClientProps {
  event: Event;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState<EventEnquiryMode>('event');
  const [selectedTicket, setSelectedTicket] = useState<TicketType | undefined>(undefined);

  // Check if registration is active
  const isRegistrationAvailable =
    event.registrationOpen !== false &&
    event.registrationEnabled !== false &&
    event.status === 'upcoming';

  const handleOpenRegistration = (ticket?: TicketType) => {
    setSelectedTicket(ticket);
    setIsRegModalOpen(true);
  };

  const handleOpenEnquiry = (mode: EventEnquiryMode = 'event') => {
    setEnquiryMode(mode);
    setIsEnquiryModalOpen(true);
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar Pass / Registration Card */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#EAE0D5] bg-white p-6 sm:p-8 space-y-6 shadow-[0_12px_32px_rgba(184,134,43,0.06)]">
          <div className="space-y-2 pb-4 border-b border-[#F3ECE4]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#2C241C] flex items-center gap-2">
                <Ticket className="h-5 w-5 text-[#B8862B]" />
                <span>Delegate Passes</span>
              </h3>
              {isRegistrationAvailable ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8862B] bg-[#B8862B]/10 px-2.5 py-0.5 rounded-full border border-[#B8862B]/20">
                  Open
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6D62] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#EAE0D5]">
                  Closed
                </span>
              )}
            </div>
            <p className="text-xs text-[#6E6258] leading-relaxed">
              {isRegistrationAvailable
                ? 'Select your pass tier for instant delegate confirmation.'
                : 'Pass bookings for this event edition are currently closed.'}
            </p>
          </div>

          <div className="space-y-4">
            {isRegistrationAvailable ? (
              <>
                <div className="space-y-3">
                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-[#EAE0D5] bg-[#FAF8F5] p-4 space-y-2 hover:border-[#B8862B]/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif text-sm font-bold text-[#2C241C]">{ticket.name}</h4>
                            {ticket.description && (
                              <p className="text-xs text-[#6E6258] mt-0.5">{ticket.description}</p>
                            )}
                          </div>
                          <span className="text-sm font-bold text-[#B8862B] font-mono shrink-0 ml-2">
                            {ticket.price === 0 ? 'FREE' : formatCurrency(ticket.price, ticket.currency)}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="w-full rounded-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#2C241C] bg-white border border-[#EAE0D5] hover:border-[#B8862B] transition-colors mt-2"
                          onClick={() => handleOpenRegistration(ticket)}
                        >
                          Book This Pass
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF8F5] p-5 text-center space-y-1">
                      <p className="text-xs text-[#6E6258]">General Delegate Admission Pass</p>
                      <span className="text-sm font-bold text-emerald-700 font-mono block">FREE ENTRY</span>
                      <button
                        type="button"
                        className="w-full rounded-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#2C241C] bg-white border border-[#EAE0D5] hover:border-[#B8862B] transition-colors mt-3"
                        onClick={() => handleOpenRegistration()}
                      >
                        Reserve Free Pass
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full gold-gradient-btn rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2"
                  onClick={() => handleOpenRegistration()}
                >
                  <span>Quick Delegate Register</span>
                  <Sparkles className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#7A6D62] pt-2 border-t border-[#F3ECE4]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#B8862B]" />
                  <span>Verified Pass Confirmation by MCU Creations</span>
                </div>
              </>
            ) : (
              /* Registration Closed State */
              <div className="rounded-2xl bg-[#FAF8F5] border border-[#EAE0D5] p-6 text-center space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#EAE0D5] text-[#7A6D62] mx-auto">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-[#2C241C]">Registration Closed</h4>
                  <p className="text-xs text-[#6E6258] leading-relaxed">
                    {event.status === 'completed'
                      ? 'This event has concluded. Stay tuned for upcoming editions.'
                      : 'Registration for this event is currently unavailable.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#2C241C] bg-white border border-[#EAE0D5] hover:border-[#B8862B] transition-colors mt-2"
                  onClick={() => handleOpenEnquiry('event')}
                >
                  Contact Event Desk
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Commercial Exhibitor Booking Box */}
        <div className="rounded-3xl border border-[#EAE0D5] bg-white p-6 space-y-3 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8862B] font-mono flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" />
            <span>Commercial Exhibition</span>
          </span>
          <h4 className="font-serif text-base font-bold text-[#2C241C]">Book a Stall or Pavilion</h4>
          <p className="text-xs text-[#6E6258] leading-relaxed">
            Position your franchise or retail brand in front of thousands of regional business delegates.
          </p>
          <button
            type="button"
            className="w-full rounded-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#2C241C] bg-[#FAF8F5] border border-[#EAE0D5] hover:border-[#B8862B] transition-colors mt-2"
            onClick={() => handleOpenEnquiry('exhibitor')}
          >
            Become an Exhibitor
          </button>
        </div>

        {/* Corporate Sponsorship Box */}
        <div className="rounded-3xl border border-[#EAE0D5] bg-white p-6 space-y-3 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8862B] font-mono flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            <span>Corporate Alliance</span>
          </span>
          <h4 className="font-serif text-base font-bold text-[#2C241C]">Partner as an Event Sponsor</h4>
          <p className="text-xs text-[#6E6258] leading-relaxed">
            Gain prominent stage branding, plenary keynote presence, and regional event recognition.
          </p>
          <button
            type="button"
            className="w-full rounded-full py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#2C241C] bg-[#FAF8F5] border border-[#EAE0D5] hover:border-[#B8862B] transition-colors mt-2"
            onClick={() => handleOpenEnquiry('sponsor')}
          >
            Become a Sponsor
          </button>
        </div>

        {/* General Event Enquiry Link */}
        <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF8F5] p-4 text-center space-y-2">
          <p className="text-xs text-[#6E6258]">Have specific questions about this event?</p>
          <button
            type="button"
            onClick={() => handleOpenEnquiry('event')}
            className="text-xs font-bold text-[#B8862B] hover:text-[#9E701C] underline underline-offset-4 inline-flex items-center gap-1"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Send Direct Event Enquiry</span>
          </button>
        </div>
      </div>

      {/* Sticky Mobile Registration & Enquiry Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-[#EAE0D5] backdrop-blur-lg p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] text-[#7A6D62] block truncate">{event.title}</span>
          <span className="text-xs font-extrabold text-[#2C241C] truncate block">
            {isRegistrationAvailable ? 'Online Booking Open' : 'Registration Closed'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-xs font-bold text-[#2C241C] bg-[#FAF8F5] border border-[#EAE0D5]"
            onClick={() => handleOpenEnquiry('event')}
          >
            Enquire
          </button>
          {isRegistrationAvailable && (
            <button
              type="button"
              className="gold-gradient-btn rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider"
              onClick={() => handleOpenRegistration()}
            >
              Register
            </button>
          )}
        </div>
      </div>

      {/* Delegate Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        event={event}
        initialTicket={selectedTicket}
      />

      {/* Contextual Event / Exhibitor / Sponsor Enquiry Modal */}
      <EventEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        event={event}
        mode={enquiryMode}
      />
    </>
  );
}
