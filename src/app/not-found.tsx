import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Compass, Home, Calendar, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 bg-[#FCFBF8]">
      <Container size="sm" className="text-center">
        <div className="relative inline-flex mb-8">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white border border-[#E8DED0] text-[#B88932] shadow-[0_12px_32px_rgba(43,33,24,0.04)] mx-auto">
            <span className="font-serif text-3xl font-bold">404</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-[#B88932] text-xs">◆</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88932]">
            PAGE NOT FOUND
          </span>
          <span className="text-[#B88932] text-xs">◆</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#3A2A1E] tracking-tight mb-4">
          Experience Not Found
        </h1>
        <p className="text-[#75695C] text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The page or event experience you are seeking may have been moved, updated, or is no longer listed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button
              type="button"
              className="btn-luxury-primary rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </Link>
          <Link href="/events">
            <button
              type="button"
              className="btn-luxury-secondary rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Explore Events</span>
            </button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
