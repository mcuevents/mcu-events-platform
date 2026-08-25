'use client';

import React from 'react';
import { PlatformSettings } from '@/types/settings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Building2, Mail, Phone, MapPin, Clock, ShieldAlert } from 'lucide-react';

interface BrandingContactsSectionProps {
  data: PlatformSettings;
  onChange: (updated: PlatformSettings) => void;
}

export const BrandingContactsSection: React.FC<BrandingContactsSectionProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof PlatformSettings>(field: K, val: PlatformSettings[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Legal Entity & Headquarters */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="h-4 w-4 text-brand-400" />
          Company Profile & Legal Registrations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Commercial Brand Name *"
            placeholder="MCU Creations Private Limited"
            value={data.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
          />

          <Input
            label="Registered Legal Entity Name *"
            placeholder="MCU Creations Event Management & Media LLP"
            value={data.legalName}
            onChange={(e) => updateField('legalName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GSTIN / Tax ID Number"
            placeholder="33AAACM0192Q1ZV"
            value={data.gstNumber || ''}
            onChange={(e) => updateField('gstNumber', e.target.value)}
          />

          <Input
            label="Business Operations Hours"
            placeholder="Monday – Saturday: 09:00 AM – 07:00 PM IST"
            value={data.businessHours}
            onChange={(e) => updateField('businessHours', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Official Communication Channels */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-400" />
          Official Contact & Support Dispatch
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Official Support & Enquiries Email *"
            placeholder="info@mcucreations.com"
            value={data.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
          />

          <Input
            label="Direct Operations Desk Phone *"
            placeholder="+91 98421 88900"
            value={data.supportPhone}
            onChange={(e) => updateField('supportPhone', e.target.value)}
          />
        </div>

        <Textarea
          label="Headquarters Postal Address (Printed on invoices and footer) *"
          rows={3}
          placeholder="MCU Tower, Avinashi Road, Near CODISSIA Complex, Coimbatore, Tamil Nadu 641014, India"
          value={data.headquartersAddress}
          onChange={(e) => updateField('headquartersAddress', e.target.value)}
        />
      </div>

      {/* 3. Maintenance Mode Control */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Platform Maintenance Mode</span>
              <span className="text-[11px] text-dark-400">
                When enabled, public visitors see a maintenance notice while admin users retain access.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.maintenanceMode}
              onChange={(e) => updateField('maintenanceMode', e.target.checked)}
              className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-xs font-bold text-amber-400">
              {data.maintenanceMode ? 'ENABLED' : 'DISABLED'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
