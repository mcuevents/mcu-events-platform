'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGlobalSettings } from '@/services/globalSettings.service';
import { AnnouncementSettings } from '@/types/globalSettings';
import { ArrowRight, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getGlobalSettings().then((settings) => {
      if (settings.announcement?.enabled && settings.announcement.text) {
        setAnnouncement(settings.announcement);
      }
    });
  }, []);

  if (!announcement || !announcement.enabled || dismissed) {
    return null;
  }

  return (
    <div className="bg-[#F8F4EC] border-b border-[#EAE0D5] text-[#3D3128] px-4 py-2 text-xs font-semibold transition-all relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center pr-6">
        {announcement.badgeText && (
          <span className="bg-[#B8860B] text-white text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold hidden sm:inline-block shadow-sm">
            {announcement.badgeText}
          </span>
        )}

        <span className="truncate max-w-xl text-[#3D3128]">{announcement.text}</span>

        {announcement.linkUrl && (
          <Link
            href={announcement.linkUrl}
            className="inline-flex items-center gap-1 text-[#B8860B] font-bold underline underline-offset-2 hover:text-[#8E671E] transition-colors shrink-0"
          >
            {announcement.linkText || 'Learn More'}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6D62] hover:text-[#2D231E] p-1"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
