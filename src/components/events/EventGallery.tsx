'use client';

import React, { useState } from 'react';
import { Sparkles, Maximize2 } from 'lucide-react';
import { ImageLightboxModal, LightboxImage } from '@/components/shared/ImageLightboxModal';

interface EventGalleryProps {
  images?: string[];
  eventTitle: string;
}

export function EventGallery({ images, eventTitle }: EventGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const lightboxImages: LightboxImage[] = images.map((img, idx) => ({
    url: img,
    title: `${eventTitle} — Photo #${idx + 1}`,
    caption: 'Official Event Moments & Venue Highlights',
  }));

  const handleOpenLightbox = (index: number) => {
    setSelectedIdx(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C241C]">Event Moments</h3>
              <p className="text-xs text-[#6E6258]">Atmosphere, stage sessions, and expo hall floor</p>
            </div>
          </div>

          <span className="text-xs font-mono text-[#7A6D62]">
            {images.length} Photos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative h-48 rounded-2xl overflow-hidden border border-[#EAE0D5] bg-[#FAF8F5] cursor-pointer hover:border-[#B8862B]/50 transition-all shadow-sm"
            >
              <img
                src={img}
                alt={`${eventTitle} gallery photo ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs font-bold text-white">View Fullscreen</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B8862B] text-white">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={selectedIdx}
        onNavigate={(idx) => setSelectedIdx(idx)}
      />
    </>
  );
}
