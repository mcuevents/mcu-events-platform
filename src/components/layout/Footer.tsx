import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E8DED0] bg-[#FCFBF8] text-[#75695C]">
      <Container size="lg" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
                MCU
              </span>
              <div className="flex flex-col border-l border-[#D4B06A]/40 pl-2.5">
                <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-bold text-[#2B2118]">
                  MENTOR CREW UNITS
                </span>
                <span className="text-[9px] font-serif uppercase tracking-[0.16em] text-[#75695C] font-medium">
                  (CREATION)
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#75695C] leading-relaxed">
              MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and creating meaningful experiences.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={siteConfig.contacts.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DED0] text-[#75695C] hover:bg-[#B88932] hover:text-white hover:border-[#B88932] transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contacts.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DED0] text-[#75695C] hover:bg-[#B88932] hover:text-white hover:border-[#B88932] transition-all shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contacts.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DED0] text-[#75695C] hover:bg-[#B88932] hover:text-white hover:border-[#B88932] transition-all shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contacts.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DED0] text-[#75695C] hover:bg-[#B88932] hover:text-white hover:border-[#B88932] transition-all shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 2. Navigation */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.18em] text-[#2B2118] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Event Management Capabilities */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.18em] text-[#2B2118] mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Concept & Planning
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Event Coordination
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Venue & Vendor Coordination
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  Event Branding & Setup
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#75695C] hover:text-[#B88932] transition-colors">
                  On-ground Management
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Official Contact & Address */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.18em] text-[#2B2118] mb-4">
              Coimbatore Office
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#B88932] shrink-0 mt-0.5" />
                <span className="text-[#75695C] leading-relaxed">
                  3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam, Coimbatore, Tamil Nadu - 641004, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#B88932] shrink-0" />
                <div className="flex flex-wrap gap-x-2 text-[#75695C]">
                  <a href="tel:7010377731" className="hover:text-[#B88932] transition-colors font-mono font-bold">
                    7010377731
                  </a>
                  <span>/</span>
                  <a href="tel:700667500" className="hover:text-[#B88932] transition-colors font-mono font-bold">
                    700667500
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#B88932] shrink-0" />
                <a href={`mailto:${siteConfig.contacts.email}`} className="hover:text-[#B88932] transition-colors text-[#75695C]">
                  {siteConfig.contacts.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8DED0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#75695C] gap-4">
          <p>© {new Date().getFullYear()} MCU (Mentor Crew Units) Creations. All rights reserved. Founded in 2026.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#75695C]">Event Management • Coimbatore, India</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
