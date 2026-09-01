'use client';

import React from 'react';
import { SocialChannelsConfig } from '@/types/settings';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { MessageCircle, Phone, Send, Check } from 'lucide-react';

interface WhatsAppHotlineFormProps {
  data: SocialChannelsConfig;
  onChange: (updated: SocialChannelsConfig) => void;
}

export const WhatsAppHotlineForm: React.FC<WhatsAppHotlineFormProps> = ({ data, onChange }) => {
  const updateField = <K extends keyof SocialChannelsConfig>(field: K, val: SocialChannelsConfig[K]) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Live WhatsApp Widget Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <MessageCircle className="h-4 w-4" /> Live WhatsApp Chat Experience Preview
          </span>
        </div>

        <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">MCU Event Helpdesk</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-dark-400">
                Connected Number: <span className="text-dark-200 font-mono">{data.whatsappNumber || '+91 98421 88900'}</span>
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto p-3 bg-dark-900 rounded-xl border border-dark-700/80 max-w-sm text-xs text-dark-200 space-y-1">
            <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">Default Greeting</span>
            <p className="italic text-emerald-300">
              &ldquo;{data.whatsappDefaultMessage || 'Hi MCU Creations, I would like to enquire...'}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 2. Configuration Form */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-400" />
            WhatsApp Hotline & Instant Enquiries
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.whatsappWidgetEnabled}
              onChange={(e) => updateField('whatsappWidgetEnabled', e.target.checked)}
              className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-white">Enable Floating WhatsApp Button</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-800">
          <Input
            label="WhatsApp Number (with Country Code) *"
            placeholder="+919842188900"
            value={data.whatsappNumber}
            onChange={(e) => updateField('whatsappNumber', e.target.value)}
          />

          <div className="flex items-center pt-5">
            <p className="text-xs text-dark-400">
              Visitors clicking the WhatsApp icon on the site will automatically open WhatsApp with your pre-filled inquiry.
            </p>
          </div>
        </div>

        <Textarea
          label="Pre-filled Message Template *"
          rows={3}
          placeholder="e.g. Hi MCU Creations, I want to book an exhibitor stall for the Tamil Nadu Franchise Expo."
          value={data.whatsappDefaultMessage}
          onChange={(e) => updateField('whatsappDefaultMessage', e.target.value)}
        />
      </div>
    </div>
  );
};
