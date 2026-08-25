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
    <div>
      {/* 1. Hero */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Visual Archives
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Event Gallery & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Live Moments</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              Explore high-resolution photography from our flagship business expos, stage productions, awards ceremonies, and VIP delegate lounges.
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Gallery Grid */}
      <Section spacing="md">
        <Container space-y-8>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as string)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                      : 'bg-dark-900 text-dark-300 hover:text-white border border-dark-800 hover:border-dark-700'
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
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-dark-800 bg-dark-950 aspect-[4/3]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-dark-950/80 px-2 py-0.5 rounded border border-brand-500/30">
                      {photo.category}
                    </span>
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-dark-300 mt-1 line-clamp-2">{photo.caption}</p>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-dark-950 border border-dark-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-dark-900/80 text-white hover:bg-dark-800 border border-dark-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-dark-950 border-t border-dark-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-brand-400">
                  {activePhoto.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
              {activePhoto.caption && (
                <p className="text-xs text-dark-300">{activePhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
