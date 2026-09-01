'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { AdminEventFormData, TicketType } from '@/types/events';
import { Ticket, Plus, Trash2, Globe, CheckSquare, Square } from 'lucide-react';

interface EventPassesSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
  errors?: Record<string, string>;
}

export function EventPassesSection({
  formData,
  onChange,
  errors = {},
}: EventPassesSectionProps) {
  const isEnabled = formData.registrationEnabled !== false;

  const handleToggleRegistration = () => {
    onChange({
      registrationEnabled: !isEnabled,
      registrationOpen: !isEnabled,
    });
  };

  const handleAddTicketTier = () => {
    const newTier: TicketType = {
      id: `t-${Date.now()}`,
      name: 'General Visitor Pass',
      price: 0,
      currency: 'INR',
      available: 500,
      description: 'Full 3-day access to all exhibition pavilions.',
    };
    const current = formData.ticketTypes || [];
    onChange({ ticketTypes: [...current, newTier] });
  };

  const handleUpdateTicketTier = (index: number, updates: Partial<TicketType>) => {
    const current = [...(formData.ticketTypes || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ ticketTypes: current });
  };

  const handleRemoveTicketTier = (index: number) => {
    const current = [...(formData.ticketTypes || [])];
    current.splice(index, 1);
    onChange({ ticketTypes: current });
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-dark-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Delegate Passes & Registration Engine</h2>
            <p className="text-[11px] text-dark-400">Pass pricing, attendee limits, and external ticketing links</p>
          </div>
        </div>

        {/* Enabled Toggle Switch */}
        <button
          type="button"
          onClick={handleToggleRegistration}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            isEnabled
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-dark-950 text-dark-400 border border-dark-800'
          }`}
        >
          {isEnabled ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          <span>{isEnabled ? 'Registration Active' : 'Registration Disabled'}</span>
        </button>
      </div>

      {/* Registration Settings Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Registration Window Start"
          type="date"
          value={formData.registrationStartDate ? formData.registrationStartDate.split('T')[0] : ''}
          onChange={(e) => onChange({ registrationStartDate: e.target.value })}
        />

        <Input
          label="Registration Window End"
          type="date"
          value={formData.registrationEndDate ? formData.registrationEndDate.split('T')[0] : ''}
          onChange={(e) => onChange({ registrationEndDate: e.target.value })}
        />

        <Input
          label="External Registration URL (Optional)"
          placeholder="https://townscript.com/e/..."
          value={formData.externalRegistrationUrl || ''}
          onChange={(e) => onChange({ externalRegistrationUrl: e.target.value })}
          error={errors.externalRegistrationUrl}
        />
      </div>

      {/* Ticket / Pass Tiers Engine */}
      <div className="space-y-3 pt-3 border-t border-dark-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Configured Pass Tiers & Badges
            </h3>
            <span className="text-[10px] text-dark-400">
              Delegates select their ticket tier during registration checkout
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTicketTier}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Pass Tier
          </Button>
        </div>

        {/* Pass Tiers List */}
        <div className="space-y-3">
          {(formData.ticketTypes || []).map((tier, idx) => (
            <div
              key={tier.id || idx}
              className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <Input
                    label="Pass Name *"
                    placeholder="e.g. VIP Masterclass Delegate"
                    value={tier.name}
                    onChange={(e) => handleUpdateTicketTier(idx, { name: e.target.value })}
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Price (₹ INR) *"
                    type="number"
                    min="0"
                    placeholder="0 for Free Pass"
                    value={tier.price}
                    onChange={(e) => handleUpdateTicketTier(idx, { price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Capacity / Seats"
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={tier.available}
                    onChange={(e) => handleUpdateTicketTier(idx, { available: parseInt(e.target.value) || 100 })}
                  />
                </div>

                <div className="sm:col-span-1 flex items-end justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveTicketTier(idx)}
                    title="Remove Tier"
                    className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Input
                label="Pass Description & Inclusions"
                placeholder="e.g. Includes delegate kit, networking lunch, and access to all keynote halls."
                value={tier.description || ''}
                onChange={(e) => handleUpdateTicketTier(idx, { description: e.target.value })}
              />
            </div>
          ))}

          {(!formData.ticketTypes || formData.ticketTypes.length === 0) && (
            <div className="p-4 text-center rounded-xl bg-dark-950/40 border border-dark-800 text-xs text-dark-400">
              No custom ticket tiers added. A default &quot;General Visitor Pass (Free)&quot; will be offered automatically.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
