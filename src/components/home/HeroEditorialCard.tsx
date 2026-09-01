'use client';

import React from 'react';
import { MapPin, ShieldCheck, Layers, Users, Compass } from 'lucide-react';

export const HeroEditorialCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Decorative Gold Glow & Border Accent */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#D4B06A]/20 via-[#B88932]/10 to-transparent blur-lg opacity-70 pointer-events-none" />

      {/* Main Luxury Architectural Card */}
      <div className="relative rounded-3xl border border-[#E8DED0] bg-white p-8 sm:p-10 shadow-[0_16px_40px_rgba(43,33,24,0.04)] space-y-8">
        {/* Top Bar: Brand Monogram & Verified Year */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DED0]">
          <div className="space-y-0.5">
            <span className="font-serif text-lg font-bold text-[#3A2A1E] tracking-tight block">
              MCU CREATIONS
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B88932] block">
              Mentor Crew Units
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[11px] font-semibold text-[#B88932] tracking-wider block">
              EST. 2026
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#75695C]">
              Coimbatore, TN
            </span>
          </div>
        </div>

        {/* Center Editorial Manifesto with Official Brand Tagline */}
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B88932] block">
            EXPERIENCE BEYOND EXPECTATIONS
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#3A2A1E] leading-snug">
            Thoughtful coordination from blueprint to live execution.
          </h3>
          <p className="text-xs text-[#75695C] leading-relaxed">
            Planning, stage alignment, vendor coordination, and seamless attendee experiences for gatherings across Tamil Nadu.
          </p>
        </div>

        {/* 4 Execution Pillars */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#B88932]">
              <Compass className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold">01</span>
            </div>
            <p className="font-serif text-xs font-bold text-[#3A2A1E]">Concept & Plan</p>
            <p className="text-[10px] text-[#75695C]">Theme & Timelines</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#B88932]">
              <Layers className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold">02</span>
            </div>
            <p className="font-serif text-xs font-bold text-[#3A2A1E]">Coordination</p>
            <p className="text-[10px] text-[#75695C]">Venues & Vendors</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#B88932]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold">03</span>
            </div>
            <p className="font-serif text-xs font-bold text-[#3A2A1E]">On-Ground</p>
            <p className="text-[10px] text-[#75695C]">Live Supervision</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8DED0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#B88932]">
              <Users className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold">04</span>
            </div>
            <p className="font-serif text-xs font-bold text-[#3A2A1E]">Guest Care</p>
            <p className="text-[10px] text-[#75695C]">Hospitality & Flow</p>
          </div>
        </div>

        {/* Footer Meta Row */}
        <div className="pt-4 border-t border-[#E8DED0] flex items-center justify-between text-[11px] text-[#75695C]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#B88932]" />
            <span>Coimbatore, Tamil Nadu</span>
          </div>
          <span className="font-mono font-bold text-[#2B2118]">7010377731</span>
        </div>
      </div>
    </div>
  );
};
