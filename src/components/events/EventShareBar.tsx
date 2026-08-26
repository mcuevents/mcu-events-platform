'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Facebook, Linkedin } from 'lucide-react';

interface EventShareBarProps {
  title: string;
  slug: string;
}

export function EventShareBar({ title, slug }: EventShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/events/${slug}`;
    }
    return `https://mcucreations.com/events/${slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getShareUrl();
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out ${title} on MCU Creations:\n${getShareUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="rounded-2xl border border-[#EAE0D5] bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6258]">
        <Share2 className="h-4 w-4 text-[#B8862B]" />
        <span>Share this event with your business network</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleLinkedIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 text-xs font-bold transition-colors"
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={handleFacebook}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition-colors"
        >
          <Facebook className="h-3.5 w-3.5" />
          <span>Facebook</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#2C241C] border border-[#EAE0D5] hover:border-[#B8862B] text-xs font-bold transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#B8862B]" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
