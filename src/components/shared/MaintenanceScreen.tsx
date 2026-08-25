'use client';

import React from 'react';
import Link from 'next/link';
import { MaintenanceSettings } from '@/types/globalSettings';
import { ShieldAlert, Mail, Phone, Lock } from 'lucide-react';

interface MaintenanceScreenProps {
  settings: MaintenanceSettings;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-dark-900 border border-dark-800 shadow-2xl space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">{settings.title || 'Scheduled Maintenance'}</h1>
          <p className="text-xs text-dark-300 leading-relaxed">
            {settings.description ||
              'We are currently performing server optimizations and upgrades. We will be back online shortly.'}
          </p>
        </div>

        {(settings.contactEmail || settings.contactPhone) && (
          <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-2 text-xs text-left">
            <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
              Emergency Contact Desk:
            </span>
            {settings.contactEmail && (
              <div className="flex items-center gap-2 text-dark-300">
                <Mail className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white font-mono">
                  {settings.contactEmail}
                </a>
              </div>
            )}
            {settings.contactPhone && (
              <div className="flex items-center gap-2 text-dark-300">
                <Phone className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white font-mono">
                  {settings.contactPhone}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between text-[11px] text-dark-500">
          <span>MCU Creations Engine</span>
          <Link href="/admin/login" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
            <Lock className="h-3 w-3" /> Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
