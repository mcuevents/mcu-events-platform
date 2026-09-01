'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Download, Phone } from 'lucide-react';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="floorplan-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in-up"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl border border-[#E8DED0] shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DED0] bg-[#FCFBF8]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B88932] font-mono block">
              ONE ZONE 2K26 · VENUE LAYOUT
            </span>
            <h3 id="floorplan-title" className="font-serif text-lg sm:text-xl font-bold text-[#3A2A1E]">
              HALL - B (FLOOR PLAN) · CODISSIA
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/images/one-zone-floor-plan.jpg"
              download="OneZone-2K26-Hall-B-FloorPlan.jpg"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8DED0] text-xs font-semibold text-[#3A2A1E] hover:bg-[#FCFBF8] hover:border-[#B88932] transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-[#B88932]" />
              <span>Download Plan</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-[#E8DED0] text-[#3A2A1E] hover:text-[#B88932] hover:bg-[#FCFBF8] transition-colors"
              aria-label="Close floor plan modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Floor Plan Display */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F7F5F0] flex items-center justify-center">
          <div className="relative max-w-full rounded-2xl overflow-hidden shadow-sm border border-[#E8DED0] bg-white">
            <Image
              src="/images/one-zone-floor-plan.jpg"
              alt="One Zone 2K26 Hall-B Floor Plan - CODISSIA Coimbatore"
              width={1800}
              height={1600}
              priority
              className="w-full h-auto object-contain max-h-[65vh]"
            />
          </div>
        </div>

        {/* Footer Stall & Booking Info */}
        <div className="px-6 py-4 border-t border-[#E8DED0] bg-[#FCFBF8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#75695C]">
            <span className="font-semibold text-[#3A2A1E]">Stall Categories:</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /> Silver (3x3)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" /> Gold (3x4)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Diamond (6x3)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" /> Premium (6x6)</span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-[#2B2118]">
            <Phone className="h-3.5 w-3.5 text-[#B88932]" />
            <span>Book Stalls:</span>
            <a href="tel:7010377731" className="hover:text-[#B88932] transition-colors">7010377731</a>
            <span>/</span>
            <a href="tel:700667500" className="hover:text-[#B88932] transition-colors">700667500</a>
          </div>
        </div>
      </div>
    </div>
  );
};
