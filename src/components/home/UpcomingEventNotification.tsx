'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, X, Clock } from 'lucide-react';

export const UpcomingEventNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if visitor already closed popup in this browser session
    try {
      const previouslyDismissed = sessionStorage.getItem('mcu_one_zone_popup_dismissed');
      if (previouslyDismissed === 'true') {
        return;
      }
    } catch {
      // Graceful fallback
    }

    // 2. Wait exactly 5 seconds (5000ms) before displaying
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('mcu_one_zone_popup_dismissed', 'true');
    } catch {
      // Ignored
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
    const el = document.getElementById('event-details');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Upcoming Event Announcement"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 animate-fade-in-up"
    >
      <div className="relative rounded-3xl border border-[#E8DED0] bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(43,33,24,0.16)] space-y-4">
        {/* Subtle Gold Accent Bar */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#B88932]/50 to-transparent" />

        {/* Top Row: Eyebrow & Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E8DED0]/60">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B88932] font-mono">
            <Clock className="h-3 w-3" />
            <span>UPCOMING EVENT</span>
          </span>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close notification"
            className="p-1 -mr-1 rounded-full text-[#75695C] hover:text-[#2B2118] hover:bg-[#FCFBF8] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Event Title & Details */}
        <div className="space-y-2">
          <h4 className="font-serif text-xl font-bold text-[#3A2A1E] leading-snug">
            ONE ZONE 2K26
          </h4>

          <div className="space-y-1.5 text-xs text-[#75695C] pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#B88932] shrink-0" />
              <span className="font-semibold tracking-wide uppercase text-[11px] text-[#3A2A1E]">
                30 & 31 OCTOBER · 1 NOVEMBER 2026
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#B88932] shrink-0" />
              <span className="uppercase text-[11px]">
                CODISSIA HALL B · COIMBATORE, TN
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: VIEW EVENT DETAILS */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full btn-luxury-primary rounded-full py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all hover:shadow-md"
          >
            <span>View Event Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
