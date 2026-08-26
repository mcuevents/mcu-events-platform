'use client';

import React, { useState } from 'react';
import { VideoItem } from '@/types/media';
import { Container, Section, Card, Button } from '@/components/ui';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Play, X, Youtube, Instagram, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface MediaClientWrapperProps {
  videos: VideoItem[];
}

export function MediaClientWrapper({ videos }: MediaClientWrapperProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div>
      {/* 1. Hero */}
      <div className="py-12 lg:py-16 bg-dark-950 border-b border-dark-800">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Media Hub
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Media, Videos & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Event Highlights</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 leading-relaxed">
              Watch official aftermovies, exhibitor interviews, keynote recordings, and behind-the-scenes stage production reels.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/gallery">
                <Button variant="outline" size="md" leftIcon={<ImageIcon className="h-4 w-4" />}>
                  Explore Photo Gallery
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Video Grid */}
      <Section spacing="md">
        <Container space-y-12>
          <SectionHeader
            badge="Official Reels"
            title="Featured Event Sizzle Reels & Keynotes"
            subtitle="Captured in 4K by our media production crew across Tamil Nadu convention centers."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((vid) => (
              <Card
                key={vid.id}
                hoverEffect
                className="overflow-hidden cursor-pointer group border-dark-800"
                onClick={() => setActiveVideo(vid)}
              >
                <div className="relative aspect-video w-full bg-dark-950 overflow-hidden">
                  <img
                    src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={vid.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-colors flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-dark-950 shadow-xl shadow-brand-500/30 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                      4K Broadcast
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Social Channel Grid Callout */}
      <Section spacing="sm" className="bg-dark-950/70 border-t border-b border-dark-800">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-dark-900 via-dark-900 to-dark-950 border border-dark-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-bold text-white">Subscribe & Follow MCU Creations</h3>
              <p className="text-sm text-dark-300">
                Get notified on YouTube live streams, upcoming expo announcements, and viral creator reels.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-950/30 border border-pink-500/30 text-xs font-bold text-pink-300 hover:bg-pink-900/40 transition-colors"
              >
                <Instagram className="h-4 w-4 text-pink-400" />
                <span>Instagram @mcucreations</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/30 border border-red-500/30 text-xs font-bold text-red-300 hover:bg-red-900/40 transition-colors"
              >
                <Youtube className="h-4 w-4 text-red-400" />
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden bg-dark-950 border border-dark-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-dark-900 border-b border-dark-800">
              <h3 className="text-sm font-bold text-white truncate max-w-[80%]">{activeVideo.title}</h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-800 text-dark-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-dark-950 text-xs text-dark-300">
              {activeVideo.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
