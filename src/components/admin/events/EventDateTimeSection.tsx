'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { AdminEventFormData } from '@/types/events';
import { Calendar, Clock, Info } from 'lucide-react';

interface EventDateTimeSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
  errors?: Record<string, string>;
}

export function EventDateTimeSection({
  formData,
  onChange,
  errors = {},
}: EventDateTimeSectionProps) {
  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white">Event Dates & Timings</h2>
          <p className="text-[11px] text-dark-400">Schedule duration and daily visitor timings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date *"
          type="date"
          value={formData.startDate ? formData.startDate.split('T')[0] : ''}
          onChange={(e) => onChange({ startDate: e.target.value })}
          error={errors.startDate}
          required
        />

        <Input
          label="End Date *"
          type="date"
          value={formData.endDate ? formData.endDate.split('T')[0] : ''}
          onChange={(e) => onChange({ endDate: e.target.value })}
          error={errors.endDate}
          required
        />

        <Input
          label="Daily Start Time (Optional)"
          type="time"
          value={formData.startTime || '09:30'}
          onChange={(e) => onChange({ startTime: e.target.value })}
        />

        <Input
          label="Daily End Time (Optional)"
          type="time"
          value={formData.endTime || '18:30'}
          onChange={(e) => onChange({ endTime: e.target.value })}
        />
      </div>

      <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 flex items-start gap-2.5 text-xs text-dark-400">
        <Info className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
        <span>
          Dates are stored and displayed in Indian Standard Time (IST, UTC+5:30). If this is a single-day event, set Start Date and End Date to the same day.
        </span>
      </div>
    </Card>
  );
}
