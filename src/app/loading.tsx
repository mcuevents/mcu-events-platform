import React from 'react';
import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <Container size="sm" className="flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-extrabold text-dark-950 text-xs">
            MCU
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-dark-400 animate-pulse">
          Loading MCU Creations...
        </p>
      </Container>
    </div>
  );
}
