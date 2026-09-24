/**
 * ONEZONE 2K26 Event & Countdown Configuration
 * Central place to configure the target launch time, venue details, and copy.
 */

export interface CountdownConfig {
  eventName: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  supportingText: string;
  /** ISO string with timezone offset (IST is UTC+05:30) */
  targetDateIso: string;
  eventDates: string;
  venueName: string;
  venueCity: string;
  tagline: string;
  ctaText: string;
  ctaHref: string;
  liveHeading: string;
  liveSubtitle: string;
  liveCtaText: string;
}

export const onezoneCountdownConfig: CountdownConfig = {
  eventName: 'ONEZONE 2K26 Expo',
  eyebrow: 'THE COUNTDOWN BEGINS',
  heading: 'ONEZONE 2K26',
  subtitle: 'A new world of opportunities awaits.',
  supportingText: 'The doors open in',
  // Target: October 30, 2026, at 12:00 AM IST (UTC+05:30)
  targetDateIso: '2026-10-30T00:00:00+05:30',
  eventDates: '30 OCT – 01 NOV 2026',
  venueName: 'CODISSIA, HALL B',
  venueCity: 'COIMBATORE',
  tagline: 'ONE VENUE. THOUSANDS OF POSSIBILITIES.',
  ctaText: 'EXPLORE THE EXPO →',
  ctaHref: '/events',
  liveHeading: 'ONEZONE 2K26 IS NOW LIVE',
  liveSubtitle: 'The grand expo has begun. Join thousands of innovators and exhibitors at CODISSIA.',
  liveCtaText: 'EXPLORE THE EXPO →',
};
