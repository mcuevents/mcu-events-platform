'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Sparkles, Radio } from 'lucide-react';
import { Container } from '@/components/ui';
import { onezoneCountdownConfig, CountdownConfig } from '@/config/countdown';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

interface OnezoneCountdownProps {
  config?: CountdownConfig;
}

function calculateTimeRemaining(targetIso: string): TimeLeft {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const difference = targetTime - now;

  if (difference <= 0 || isNaN(targetTime)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isLive: false,
  };
}

function padZero(num: number, minLength = 2): string {
  return String(num).padStart(minLength, '0');
}

export function OnezoneCountdown({ config = onezoneCountdownConfig }: OnezoneCountdownProps) {
  // Initialize state; using mounted state to guarantee zero SSR hydration discrepancies
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeRemaining(config.targetDateIso));

  useEffect(() => {
    setMounted(true);
    // Recalculate immediately upon client mounting
    setTimeLeft(calculateTimeRemaining(config.targetDateIso));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(config.targetDateIso));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.targetDateIso]);

  // Zero-padded values
  const formattedDays = useMemo(() => {
    const d = timeLeft.days;
    return d >= 100 ? String(d) : padZero(d, 2);
  }, [timeLeft.days]);

  const formattedHours = useMemo(() => padZero(timeLeft.hours, 2), [timeLeft.hours]);
  const formattedMinutes = useMemo(() => padZero(timeLeft.minutes, 2), [timeLeft.minutes]);
  const formattedSeconds = useMemo(() => padZero(timeLeft.seconds, 2), [timeLeft.seconds]);

  return (
    <section
      id="countdown"
      aria-label="ONEZONE 2K26 Countdown"
      className="relative overflow-hidden bg-[#FCFBF8] border-b border-[#E8DED0] py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle Luxury Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Gold Ambience */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial from-[#D4B06A]/10 via-[#B88932]/05 to-transparent blur-3xl" />
        
        {/* Delicate Concentric Luxury Arches */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-[#D4B06A]/15 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-[#D4B06A]/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#E8DED0]/50 pointer-events-none" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 sm:space-y-12">
          
          {/* Section Header & Editorial Titles */}
          <div className="space-y-4 sm:space-y-5">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center justify-center gap-2">
              <span className="text-[#B88932] text-xs">◆</span>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B88932]">
                {config.eyebrow}
              </span>
              <span className="text-[#B88932] text-xs">◆</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-[1.15] tracking-tight">
              {config.heading}
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#75695C] font-normal leading-relaxed max-w-xl mx-auto">
              {config.subtitle}
            </p>

            {/* Supporting Text with Subtle Decorative Lines */}
            {!timeLeft.isLive && (
              <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
                <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4B06A]/60" />
                <span>{config.supportingText}</span>
                <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4B06A]/60" />
              </div>
            )}
          </div>

          {/* COUNTDOWN UNITS or LIVE STATE */}
          {timeLeft.isLive ? (
            /* EVENT LIVE STATE */
            <div className="rounded-3xl border border-[#B88932]/40 bg-gradient-to-b from-white to-[#FCFBF8] p-8 sm:p-12 shadow-[0_16px_40px_rgba(184,137,50,0.08)] space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>EVENT IN PROGRESS</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#3A2A1E] font-normal">
                  {config.liveHeading}
                </h3>
                <p className="text-sm sm:text-base text-[#75695C] max-w-lg mx-auto">
                  {config.liveSubtitle}
                </p>
              </div>

              <div className="pt-2">
                <Link href={config.ctaHref}>
                  <button
                    type="button"
                    className="btn-luxury-primary rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2"
                  >
                    <span>{config.liveCtaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* FOUR LIVE COUNTDOWN UNITS */
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 max-w-3xl mx-auto">
                {/* DAYS */}
                <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#E8DED0] p-5 sm:p-7 shadow-[0_10px_28px_rgba(43,33,24,0.03)] hover:border-[#B88932]/50 hover:shadow-[0_14px_36px_rgba(184,137,50,0.08)] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center">
                  {/* Subtle top warm gold hairline accent */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4B06A]/40 to-transparent group-hover:via-[#B88932] transition-colors duration-300" />
                  
                  <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2B2118] tabular-nums tracking-tight leading-none">
                    {mounted ? formattedDays : '00'}
                  </div>
                  <span className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#75695C] group-hover:text-[#B88932] transition-colors">
                    DAYS
                  </span>
                </div>

                {/* HOURS */}
                <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#E8DED0] p-5 sm:p-7 shadow-[0_10px_28px_rgba(43,33,24,0.03)] hover:border-[#B88932]/50 hover:shadow-[0_14px_36px_rgba(184,137,50,0.08)] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4B06A]/40 to-transparent group-hover:via-[#B88932] transition-colors duration-300" />
                  
                  <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2B2118] tabular-nums tracking-tight leading-none">
                    {mounted ? formattedHours : '00'}
                  </div>
                  <span className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#75695C] group-hover:text-[#B88932] transition-colors">
                    HOURS
                  </span>
                </div>

                {/* MINUTES */}
                <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#E8DED0] p-5 sm:p-7 shadow-[0_10px_28px_rgba(43,33,24,0.03)] hover:border-[#B88932]/50 hover:shadow-[0_14px_36px_rgba(184,137,50,0.08)] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4B06A]/40 to-transparent group-hover:via-[#B88932] transition-colors duration-300" />
                  
                  <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2B2118] tabular-nums tracking-tight leading-none">
                    {mounted ? formattedMinutes : '00'}
                  </div>
                  <span className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#75695C] group-hover:text-[#B88932] transition-colors">
                    MINUTES
                  </span>
                </div>

                {/* SECONDS */}
                <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#E8DED0] p-5 sm:p-7 shadow-[0_10px_28px_rgba(43,33,24,0.03)] hover:border-[#B88932]/50 hover:shadow-[0_14px_36px_rgba(184,137,50,0.08)] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4B06A]/40 to-transparent group-hover:via-[#B88932] transition-colors duration-300" />
                  
                  <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#B88932] tabular-nums tracking-tight leading-none transition-transform duration-200">
                    {mounted ? formattedSeconds : '00'}
                  </div>
                  <span className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#75695C] group-hover:text-[#B88932] transition-colors">
                    SECONDS
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BELOW THE TIMER: TAGLINE, DATES, VENUE & CTA */}
          <div className="pt-2 sm:pt-4 space-y-6 sm:space-y-7 border-t border-[#E8DED0]/70">
            {/* Tagline */}
            <p className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#3A2A1E]">
              {config.tagline}
            </p>

            {/* Date & Venue Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#75695C]">
              {/* Event Date */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8DED0] shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-[#B88932]" />
                <span className="font-medium tracking-wide uppercase text-[#3A2A1E] text-[11px] sm:text-xs">
                  {config.eventDates}
                </span>
              </div>

              {/* Venue */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8DED0] shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-[#B88932]" />
                <span className="font-medium tracking-wide uppercase text-[#3A2A1E] text-[11px] sm:text-xs">
                  {config.venueName} · {config.venueCity}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex justify-center">
              <Link href={config.ctaHref} id="onezone-countdown-cta">
                <button
                  type="button"
                  className="btn-luxury-primary rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2.5 shadow-[0_6px_20px_rgba(43,33,24,0.1)] hover:shadow-[0_10px_25px_rgba(184,137,50,0.2)] transition-all duration-300"
                >
                  <span>{config.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
export default OnezoneCountdown;
