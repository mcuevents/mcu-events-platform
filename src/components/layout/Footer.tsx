'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <footer className="border-t border-[#E8DED0] bg-[#FCFBF8] text-[#75695C]">
      <Container size="lg" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* 1. Brand & Narrative (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="inline-block group py-1"
              aria-label="MCU Creations Home"
            >
              <Image
                src="/logo.png"
                alt="MCU (Mentor Crew Units) Creations"
                width={160}
                height={106}
                className="h-12 sm:h-14 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
            </a>

            <p className="text-xs sm:text-sm text-[#75695C] leading-relaxed max-w-sm">
              <span className="font-semibold text-[#3A2A1E]">MCU (Mentor Crew Units) Creations</span> is an emerging Expo & Exhibition Management Company in Coimbatore, focused on creating professional, engaging, and business-driven exhibitions.
            </p>

            <div className="text-xs text-[#B88932] font-mono font-semibold tracking-wider pt-1">
              EXPECTATIONS CREATING · EXPERIENCE BEYOND EXPECTATIONS
            </div>
          </div>

          {/* 2. Navigation (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#3A2A1E]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleNavClick(e, '#home')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, '#about')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  About CODISSIA & MCU
                </a>
              </li>
              <li>
                <a
                  href="#what-we-do"
                  onClick={(e) => handleNavClick(e, '#what-we-do')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  What We Do
                </a>
              </li>
              <li>
                <a
                  href="#upcoming-event"
                  onClick={(e) => handleNavClick(e, '#upcoming-event')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  Upcoming Event · One Zone 2K26
                </a>
              </li>
              <li>
                <a
                  href="#who-can-participate"
                  onClick={(e) => handleNavClick(e, '#who-can-participate')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  Who Can Participate
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="text-[#75695C] hover:text-[#B88932] transition-colors"
                >
                  Contact & Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Official Contact & Address (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#3A2A1E]">
              Coimbatore Office
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                <div className="text-[#4A3E34] leading-[1.7] text-xs">
                  <p>3rd Floor,</p>
                  <p>Masakalipalayam,</p>
                  <p>Ram Lakshman Nagar, Uppilipalayam,</p>
                  <p>Coimbatore, Tamil Nadu – 641004</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Phone className="h-4 w-4 text-[#B88932] shrink-0" />
                <div className="flex flex-wrap items-center gap-x-3 text-[#75695C]">
                  <a
                    href="tel:7010377731"
                    className="hover:text-[#B88932] transition-colors font-mono font-bold text-xs sm:text-sm text-[#2B2118]"
                  >
                    7010377731
                  </a>
                  <span className="text-[#D4B06A]">·</span>
                  <a
                    href="tel:700667500"
                    className="hover:text-[#B88932] transition-colors font-mono font-bold text-xs sm:text-sm text-[#2B2118]"
                  >
                    700667500
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#B88932] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="hover:text-[#B88932] transition-colors text-[#75695C]"
                >
                  {siteConfig.contacts.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 pt-8 border-t border-[#E8DED0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#75695C] gap-4">
          <p>© 2026 MCU (Mentor Crew Units) Creations. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-[#75695C]">
            <span>Expo & Exhibition Management</span>
            <span>•</span>
            <span>Coimbatore, Tamil Nadu</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
