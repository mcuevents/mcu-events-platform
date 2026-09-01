'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/types/media';
import { Container, Section } from '@/components/ui';
import { ZoomIn, X } from 'lucide-react';

interface GalleryClientWrapperProps {
  items: GalleryItem[];
}

export function GalleryClientWrapper({ items }: GalleryClientWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = items.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="bg-[#FCFBF8]">
      {/* 1. Hero */}
      <div className="py-16 lg:py-24 luxury-hero-bg border-b border-[#E8DED0]">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[#B88932]">01</span>
              <span className="text-[#D4B06A]/60 text-xs">/</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88932]">
                VISUAL ARCHIVE
              </span>
              <div className="h-px w-8 bg-[#D4B06A]/60" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#3A2A1E] leading-tight">
              Event Gallery & <br />
              <span className="italic font-normal text-[#B88932]">Live Moments.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#75695C] leading-relaxed max-w-2xl">
              Moments from business conclaves, stage setups, and gathering spaces coordinated by MCU Creations in Coimbatore and across Tamil Nadu.
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Gallery Grid */}
      <Section spacing="lg" className="bg-[#FCFBF8]">
        <Container className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as string)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-all whitespace-nowrap ${
                    active
                      ? 'btn-luxury-primary'
                      : 'bg-white text-[#75695C] hover:text-[#2B2118] border border-[#E8DED0] hover:border-[#B88932]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Photo Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8DED0] bg-white aspect-[4/3] shadow-sm hover:border-[#B88932] transition-colors"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/90 via-[#2B2118]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4B06A] bg-[#2B2118]/90 px-2.5 py-0.5 rounded-full border border-[#D4B06A]/30">
                      {photo.category}
                    </span>
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-white mt-2 leading-snug">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-white/80 mt-1 line-clamp-2">{photo.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2118]/80 backdrop-blur-md p-4 animate-fade-in-up"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl border border-[#E8DED0] overflow-hidden p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B88932]">
                {activePhoto.category}
              </span>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="p-1.5 rounded-full bg-[#FCFBF8] border border-[#E8DED0] text-[#2B2118] hover:text-[#B88932]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#FCFBF8]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#3A2A1E]">
                {activePhoto.title}
              </h4>
              {activePhoto.caption && (
                <p className="text-xs text-[#75695C]">{activePhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
