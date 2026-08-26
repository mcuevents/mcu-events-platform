import React from 'react';
import { EventFaq } from '@/types/events';
import { HelpCircle } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';

interface EventFaqsProps {
  faqs?: EventFaq[];
}

export function EventFaqs({ faqs }: EventFaqsProps) {
  if (!faqs || faqs.length === 0) return null;

  const accordionItems = faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: <p className="text-xs sm:text-sm text-[#6E6258] leading-relaxed">{faq.answer}</p>,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/20">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C241C]">Frequently Asked Questions</h3>
          <p className="text-xs text-[#6E6258]">Delegate guidelines, badge pick-up, stall allocations, and venue rules</p>
        </div>
      </div>

      <Accordion items={accordionItems} allowMultiple={false} />
    </div>
  );
}
