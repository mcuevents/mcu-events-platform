'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id?: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const headingId = `accordion-heading-${idx}`;
        const contentId = `accordion-content-${idx}`;

        return (
          <div
            key={item.id || idx}
            className={`rounded-2xl border transition-colors ${
              isOpen
                ? 'border-brand-500/40 bg-dark-900/90 shadow-lg shadow-brand-500/5'
                : 'border-dark-800 bg-dark-950/60 hover:border-dark-700'
            }`}
          >
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleIndex(idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
              >
                <span>{item.title}</span>
                <span
                  className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dark-800 border border-dark-700 text-brand-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-brand-500/10 border-brand-500/30 text-brand-400' : ''
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={headingId}
                className="border-t border-dark-800/80 px-5 pb-5 pt-3 text-xs sm:text-sm text-dark-300 leading-relaxed"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
