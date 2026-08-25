'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminEventFormData, EventHighlight } from '@/types/events';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

interface EventHighlightsSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
}

export function EventHighlightsSection({
  formData,
  onChange,
}: EventHighlightsSectionProps) {
  const handleAddHighlight = () => {
    const newHighlight: EventHighlight = {
      title: '150+ Franchise Brands',
      description: 'Meet decision makers across retail, F&B, healthcare, and EV sectors.',
    };
    const current = formData.highlights || [];
    onChange({ highlights: [...current, newHighlight] });
  };

  const handleUpdateHighlight = (index: number, updates: Partial<EventHighlight>) => {
    const current = [...(formData.highlights || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ highlights: current });
  };

  const handleRemoveHighlight = (index: number) => {
    const current = [...(formData.highlights || [])];
    current.splice(index, 1);
    onChange({ highlights: current });
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Event Highlights & Key Attractions</h2>
            <p className="text-[11px] text-dark-400">Feature points and stats displayed in the highlights section</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddHighlight}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          Add Highlight
        </Button>
      </div>

      <div className="space-y-3">
        {(formData.highlights || []).map((hl, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800 flex items-start gap-3"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Headline Title *"
                placeholder="e.g. 10,000+ Business Visitors"
                value={hl.title}
                onChange={(e) => handleUpdateHighlight(idx, { title: e.target.value })}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Description / Details *"
                  placeholder="e.g. Verified HNI investors and prospective franchise partners across South India."
                  value={hl.description}
                  onChange={(e) => handleUpdateHighlight(idx, { description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleRemoveHighlight(idx)}
                title="Remove Highlight"
                className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {(!formData.highlights || formData.highlights.length === 0) && (
          <div className="p-4 text-center rounded-xl bg-dark-950/40 border border-dark-800 text-xs text-dark-400">
            No highlights added. Click &quot;Add Highlight&quot; to highlight key attendee numbers and attractions.
          </div>
        )}
      </div>
    </Card>
  );
}
