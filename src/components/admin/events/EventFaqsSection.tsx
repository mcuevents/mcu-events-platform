'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminEventFormData, EventFaq } from '@/types/events';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';

interface EventFaqsSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
}

export function EventFaqsSection({
  formData,
  onChange,
}: EventFaqsSectionProps) {
  const handleAddFaq = () => {
    const newFaq: EventFaq = {
      question: 'What are the expo timings and is parking available?',
      answer: 'The exhibition runs from 9:30 AM to 6:30 PM daily. Free parking is available inside the venue for all registered delegates.',
    };
    const current = formData.faqs || [];
    onChange({ faqs: [...current, newFaq] });
  };

  const handleUpdateFaq = (index: number, updates: Partial<EventFaq>) => {
    const current = [...(formData.faqs || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ faqs: current });
  };

  const handleRemoveFaq = (index: number) => {
    const current = [...(formData.faqs || [])];
    current.splice(index, 1);
    onChange({ faqs: current });
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Frequently Asked Questions (FAQs)</h2>
            <p className="text-[11px] text-dark-400">Common visitor questions rendered in the public accordion</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddFaq}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          Add FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {(formData.faqs || []).map((faq, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Input
                  label="Question *"
                  placeholder="e.g. Can I purchase delegate passes at the venue entrance?"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(idx, { question: e.target.value })}
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  title="Remove FAQ"
                  className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Textarea
              label="Answer *"
              placeholder="Clear, authoritative answer for attendees and exhibitors..."
              rows={2}
              value={faq.answer}
              onChange={(e) => handleUpdateFaq(idx, { answer: e.target.value })}
              required
            />
          </div>
        ))}

        {(!formData.faqs || formData.faqs.length === 0) && (
          <div className="p-4 text-center rounded-xl bg-dark-950/40 border border-dark-800 text-xs text-dark-400">
            No FAQs added yet. Click &quot;Add FAQ&quot; to provide delegate instructions.
          </div>
        )}
      </div>
    </Card>
  );
}
