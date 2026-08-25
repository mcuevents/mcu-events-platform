'use client';

import React, { useState } from 'react';
import { ContactSettings, DayBusinessHours } from '@/types/globalSettings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MessageCircle, MapPin, Clock, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactSettingsTabProps {
  initialData: ContactSettings;
  onSave: (data: ContactSettings) => Promise<{ success: boolean; error?: string }>;
}

export const ContactSettingsTab: React.FC<ContactSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<ContactSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof ContactSettings>(field: K, value: ContactSettings[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleHourChange = (dayIndex: number, field: keyof DayBusinessHours, value: any) => {
    const updated = [...data.businessHours];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setData((prev) => ({ ...prev, businessHours: updated }));
  };

  const handleReset = () => {
    setData(initialData);
    setFeedback(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!data.primaryPhone.trim()) newErrors.primaryPhone = 'Primary phone is required.';
    if (!data.primaryEmail.trim() || !data.primaryEmail.includes('@')) {
      newErrors.primaryEmail = 'Valid primary email is required.';
    }
    if (!data.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required.';
    if (!data.businessAddress.trim()) newErrors.businessAddress = 'Business address is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(data);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Contact details, WhatsApp hotline, and business hours updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save contact settings.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-dark-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 1. Phone & Email Dispatch */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Phone className="h-4 w-4 text-brand-400" />
          Primary Communications & Hotlines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Phone Number *"
            placeholder="+91 98421 88900"
            value={data.primaryPhone}
            onChange={(e) => handleChange('primaryPhone', e.target.value)}
            error={errors.primaryPhone}
          />

          <Input
            label="Secondary Phone Number (Optional)"
            placeholder="+91 98421 88901"
            value={data.secondaryPhone || ''}
            onChange={(e) => handleChange('secondaryPhone', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Email Address *"
            type="email"
            placeholder="info@mcucreations.com"
            value={data.primaryEmail}
            onChange={(e) => handleChange('primaryEmail', e.target.value)}
            error={errors.primaryEmail}
          />

          <Input
            label="Secondary / Event Desk Email (Optional)"
            type="email"
            placeholder="events@mcucreations.com"
            value={data.secondaryEmail || ''}
            onChange={(e) => handleChange('secondaryEmail', e.target.value)}
          />
        </div>
      </div>

      {/* 2. WhatsApp Instant Enquiry Integration */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-emerald-400" />
          Official WhatsApp Helpdesk
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp Number (with Country Code) *"
            placeholder="+919842188900"
            value={data.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
            error={errors.whatsappNumber}
          />

          <div className="flex items-center pt-5 text-xs text-dark-400">
            Used for WhatsApp chat triggers and floating buttons on the public website.
          </div>
        </div>

        <Textarea
          label="Default Prefilled Message Template"
          rows={2}
          placeholder="Hello MCU Creations, I would like to enquire about..."
          value={data.whatsappDefaultMessage || ''}
          onChange={(e) => handleChange('whatsappDefaultMessage', e.target.value)}
        />
      </div>

      {/* 3. Physical Office Address */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-400" />
          Registered Corporate Address
        </h3>

        <Textarea
          label="Street Address / Office Building *"
          rows={2}
          placeholder="MCU Tower, Avinashi Road, Near CODISSIA Complex"
          value={data.businessAddress}
          onChange={(e) => handleChange('businessAddress', e.target.value)}
          error={errors.businessAddress}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            label="City *"
            placeholder="Coimbatore"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          <Input
            label="State *"
            placeholder="Tamil Nadu"
            value={data.state}
            onChange={(e) => handleChange('state', e.target.value)}
          />
          <Input
            label="Country *"
            placeholder="India"
            value={data.country}
            onChange={(e) => handleChange('country', e.target.value)}
          />
          <Input
            label="Pincode *"
            placeholder="641014"
            value={data.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
          />
        </div>
      </div>

      {/* 4. Business Hours Schedule */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-400" />
          Weekly Operating Hours
        </h3>

        <div className="divide-y divide-dark-800/60 rounded-xl bg-dark-950/60 border border-dark-800 overflow-hidden">
          {data.businessHours.map((bh, idx) => (
            <div key={bh.day} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 w-32">
                <span className="font-bold text-white capitalize">{bh.label}</span>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bh.isOpen}
                    onChange={(e) => handleHourChange(idx, 'isOpen', e.target.checked)}
                    className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500 focus:ring-brand-500"
                  />
                  <span className={bh.isOpen ? 'text-emerald-400 font-semibold' : 'text-dark-500'}>
                    {bh.isOpen ? 'Open' : 'Closed'}
                  </span>
                </label>

                {bh.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={bh.openTime}
                      onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                      className="bg-dark-900 border border-dark-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    />
                    <span className="text-dark-500">to</span>
                    <input
                      type="time"
                      value={bh.closeTime}
                      onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                      className="bg-dark-900 border border-dark-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-dark-500 italic">Office Closed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save Contact Settings
        </Button>
      </div>
    </form>
  );
};
