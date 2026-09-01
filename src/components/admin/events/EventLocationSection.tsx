'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { AdminEventFormData } from '@/types/events';
import { MapPin, Navigation } from 'lucide-react';

interface EventLocationSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
  errors?: Record<string, string>;
}

export function EventLocationSection({
  formData,
  onChange,
  errors = {},
}: EventLocationSectionProps) {
  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <MapPin className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white">Venue Location & Spatial Details</h2>
          <p className="text-[11px] text-dark-400">Physical address and Google Maps navigation link</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Venue / Hall Name *"
            placeholder="e.g. CODISSIA Trade Fair Complex, Hall E"
            value={formData.locationName}
            onChange={(e) => onChange({ locationName: e.target.value })}
            error={errors.locationName}
            required
          />

          <Input
            label="City *"
            placeholder="e.g. Coimbatore"
            value={formData.city}
            onChange={(e) => onChange({ city: e.target.value })}
            error={errors.city}
            required
          />
        </div>

        <Input
          label="Full Street Address *"
          placeholder="e.g. GV Fair Grounds, Avinashi Road, Civil Aerodrome Post"
          value={formData.address}
          onChange={(e) => onChange({ address: e.target.value })}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="State"
            placeholder="Tamil Nadu"
            value={formData.state || 'Tamil Nadu'}
            onChange={(e) => onChange({ state: e.target.value })}
          />

          <Input
            label="Country"
            placeholder="India"
            value={formData.country || 'India'}
            onChange={(e) => onChange({ country: e.target.value })}
          />

          <Input
            label="Pincode / Postal Code"
            placeholder="641014"
            value={formData.pincode || ''}
            onChange={(e) => onChange({ pincode: e.target.value })}
          />
        </div>

        <Input
          label="Google Maps Directions URL (Optional)"
          placeholder="https://maps.google.com/?q=CODISSIA+Trade+Fair+Complex"
          value={formData.googleMapsUrl || ''}
          onChange={(e) => onChange({ googleMapsUrl: e.target.value })}
          error={errors.googleMapsUrl}
        />
      </div>
    </Card>
  );
}
