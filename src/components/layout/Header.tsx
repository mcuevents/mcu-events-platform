'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Menu, X, ArrowRight } from 'lucide-react';

const singlePageNav = [
  { title: 'HOME', href: '#home' },
  { title: 'ABOUT', href: '#about' },
  { title: 'WHAT WE DO', href: '#what-we-do' },
  { title: 'UPCOMING EVENT', href: '#upcoming-event' },
  { title: 'WHO CAN PARTICIPATE', href: '#who-can-participate' },
  { title: 'CONTACT', href: '#contact' },
];

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const item of singlePageNav) {
        const id = item.href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setDrawerOpen(false);
    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E8DED0] bg-[#FCFBF8]/95 backdrop-blur-md transition-all">
        <Container size="lg">
          <div className="flex h-20 items-center justify-between">
            {/* Official Brand Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3 shrink-0 group py-1"
              aria-label="MCU Creations Home"
            >
              <div className="relative flex items-center">
                <Image
                  src="/logo.png"
                  alt="MCU Creations - Mentor Crew Units"
                  width={150}
                  height={100}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Main Navigation">
              {singlePageNav.map((item) => {
                const id = item.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`nav-luxury-link text-[11px] font-semibold tracking-[0.2em] py-1 transition-colors ${
                      isActive
                        ? 'text-[#B88932] active font-bold'
                        : 'text-[#3A2A1E] hover:text-[#B88932]'
                    }`}
                  >
                    <span>{item.title}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right Action: Get in touch button & Minimal Hamburger */}
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="hidden sm:inline-flex items-center gap-2 btn-luxury-primary rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all hover:shadow-md"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              {/* Minimal Luxury Hamburger Icon */}
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="p-2.5 rounded-full border border-[#E8DED0] bg-white text-[#3A2A1E] hover:text-[#B88932] hover:border-[#B88932] transition-colors shadow-sm"
                aria-label="Open Navigation Menu"
                aria-expanded={drawerOpen}
              >
                {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Luxury Full-Screen / Slide-in Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#FCFBF8]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 animate-fade-in-up">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E8DED0] pb-6">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="MCU Creations"
                width={140}
                height={90}
                className="h-10 w-auto object-contain"
              />
            </a>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-3 rounded-full border border-[#E8DED0] bg-white text-[#3A2A1E] hover:text-[#B88932] hover:border-[#B88932] transition-colors"
              aria-label="Close Navigation Menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="max-w-2xl mx-auto w-full py-8 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#B88932] font-mono block mb-2">
              MENU · NAVIGATION
            </span>
            <div className="space-y-2">
              {singlePageNav.map((item, idx) => {
                const id = item.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center justify-between py-3 border-b border-[#E8DED0]/60 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#B88932] font-semibold">
                        0{idx + 1}
                      </span>
                      <span
                        className={`font-serif text-2xl sm:text-3xl transition-colors ${
                          isActive
                            ? 'text-[#B88932] italic font-normal'
                            : 'text-[#3A2A1E] group-hover:text-[#B88932]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#B88932] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer Contact Bar */}
          <div className="border-t border-[#E8DED0] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#75695C] gap-4">
            <div>
              <span className="font-semibold text-[#3A2A1E]">Coimbatore, Tamil Nadu</span> · Masakalipalayam, Uppilipalayam
            </div>
            <div className="flex items-center gap-4 font-mono font-bold text-[#2B2118]">
              <a href="tel:7010377731" className="hover:text-[#B88932] transition-colors">
                7010377731
              </a>
              <span>/</span>
              <a href="tel:700667500" className="hover:text-[#B88932] transition-colors">
                700667500
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
