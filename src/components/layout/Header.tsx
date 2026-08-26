'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicNavRoutes } from '@/config/routes';
import { Container } from '@/components/ui/Container';
import { Menu, X, ArrowRight } from 'lucide-react';
import { QuickEnquiryModal } from '@/components/shared/QuickEnquiryModal';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DED0] bg-[#FCFBF8]/95 backdrop-blur-md transition-all">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#B88932] group-hover:text-[#D4B06A] transition-colors">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {publicNavRoutes.map((route) => {
              const isActive =
                pathname === route.href ||
                (route.href !== '/' && pathname.startsWith(route.href));
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-xs font-medium uppercase tracking-[0.16em] transition-all relative py-1.5 ${
                    isActive
                      ? 'text-[#B88932]'
                      : 'text-[#2B2118] hover:text-[#B88932]'
                  }`}
                >
                  <span>{route.title}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B88932] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <button
                type="button"
                className="btn-luxury-primary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl bg-white border border-[#E8DED0] text-[#2B2118] hover:text-[#B88932] shadow-sm transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DED0] py-4 space-y-1 bg-[#FCFBF8] px-2 shadow-lg rounded-b-2xl">
            {publicNavRoutes.map((route) => {
              const isActive =
                pathname === route.href ||
                (route.href !== '/' && pathname.startsWith(route.href));
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#B88932]/10 text-[#B88932] border border-[#B88932]/20'
                      : 'text-[#2B2118] hover:text-[#B88932] hover:bg-white'
                  }`}
                >
                  {route.title}
                </Link>
              );
            })}
            <div className="pt-3 px-2 flex flex-col gap-2">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full btn-luxury-primary rounded-full px-6 py-3 text-xs uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-2"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </Container>

      {/* Global Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
      />
    </header>
  );
};
