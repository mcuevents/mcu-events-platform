'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { AdminEventFormData } from '@/types/events';
import { EntityPartner } from '@/types/partners';
import { Store, Award, Handshake, Plus, Trash2 } from 'lucide-react';

interface EventAlliancesSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
}

export function EventAlliancesSection({
  formData,
  onChange,
}: EventAlliancesSectionProps) {
  const [allianceTab, setAllianceTab] = useState<'sponsors' | 'exhibitors' | 'partners'>('sponsors');

  // Sponsors
  const handleAddSponsor = () => {
    const newSponsor: EntityPartner = {
      id: `sp-${Date.now()}`,
      category: 'sponsor',
      name: '',
      logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://example.com',
      tier: 'gold',
      displayOrder: (formData.sponsors?.length || 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = formData.sponsors || [];
    onChange({ sponsors: [...current, newSponsor] });
  };

  const handleUpdateSponsor = (index: number, updates: Partial<EntityPartner>) => {
    const current = [...(formData.sponsors || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ sponsors: current });
  };

  const handleRemoveSponsor = (index: number) => {
    const current = [...(formData.sponsors || [])];
    current.splice(index, 1);
    onChange({ sponsors: current });
  };

  // Exhibitors
  const handleAddExhibitor = () => {
    const newExhibitor: EntityPartner = {
      id: `exh-${Date.now()}`,
      category: 'exhibitor',
      name: '',
      logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://example.com',
      tier: 'gold',
      description: 'Booth: Stall A-12',
      displayOrder: (formData.exhibitors?.length || 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = formData.exhibitors || [];
    onChange({ exhibitors: [...current, newExhibitor] });
  };

  const handleUpdateExhibitor = (index: number, updates: Partial<EntityPartner>) => {
    const current = [...(formData.exhibitors || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ exhibitors: current });
  };

  const handleRemoveExhibitor = (index: number) => {
    const current = [...(formData.exhibitors || [])];
    current.splice(index, 1);
    onChange({ exhibitors: current });
  };

  // Partners
  const handleAddPartner = () => {
    const newPartner: EntityPartner = {
      id: `pt-${Date.now()}`,
      category: 'partner',
      name: '',
      logoUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://example.com',
      tier: 'gold',
      description: 'Institutional Association Partner',
      displayOrder: (formData.partners?.length || 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = formData.partners || [];
    onChange({ partners: [...current, newPartner] });
  };

  const handleUpdatePartner = (index: number, updates: Partial<EntityPartner>) => {
    const current = [...(formData.partners || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ partners: current });
  };

  const handleRemovePartner = (index: number) => {
    const current = [...(formData.partners || [])];
    current.splice(index, 1);
    onChange({ partners: current });
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Sponsors, Exhibitors & Alliances</h2>
            <p className="text-[11px] text-dark-400">Co-branding logos and confirmed exhibition booths</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl bg-dark-950 p-1 border border-dark-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAllianceTab('sponsors')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              allianceTab === 'sponsors'
                ? 'bg-brand-500 text-dark-950 font-bold'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Sponsors ({formData.sponsors?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setAllianceTab('exhibitors')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              allianceTab === 'exhibitors'
                ? 'bg-brand-500 text-dark-950 font-bold'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Exhibitors ({formData.exhibitors?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setAllianceTab('partners')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              allianceTab === 'partners'
                ? 'bg-brand-500 text-dark-950 font-bold'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Handshake className="h-3.5 w-3.5" />
            <span>Partners ({formData.partners?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Sponsors */}
      {allianceTab === 'sponsors' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-dark-300">Corporate Sponsors by Tier</span>
            <Button variant="outline" size="sm" onClick={handleAddSponsor} leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add Sponsor
            </Button>
          </div>

          <div className="space-y-3">
            {(formData.sponsors || []).map((sp, idx) => (
              <div key={sp.id || idx} className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800 flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <Input
                      label="Company / Sponsor Name *"
                      placeholder="e.g. Apex Global Financial"
                      value={sp.name}
                      onChange={(e) => handleUpdateSponsor(idx, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Select
                      label="Sponsorship Tier *"
                      value={sp.tier || 'gold'}
                      onChange={(e) => handleUpdateSponsor(idx, { tier: e.target.value as any })}
                      options={[
                        { label: 'Platinum Title Sponsor', value: 'platinum' },
                        { label: 'Gold Associate Sponsor', value: 'gold' },
                        { label: 'Silver Supporting Sponsor', value: 'silver' },
                        { label: 'Official Media Partner', value: 'media' },
                      ]}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <Input
                      label="Logo URL *"
                      placeholder="https://images.unsplash.com/..."
                      value={sp.logoUrl}
                      onChange={(e) => handleUpdateSponsor(idx, { logoUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveSponsor(idx)}
                    title="Remove"
                    className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Exhibitors */}
      {allianceTab === 'exhibitors' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-dark-300">Confirmed Exhibitor Brands & Stalls</span>
            <Button variant="outline" size="sm" onClick={handleAddExhibitor} leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add Exhibitor
            </Button>
          </div>

          <div className="space-y-3">
            {(formData.exhibitors || []).map((exh, idx) => (
              <div key={exh.id || idx} className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800 flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <Input
                      label="Brand / Exhibitor Name *"
                      placeholder="e.g. Madras Bakery Chains"
                      value={exh.name}
                      onChange={(e) => handleUpdateExhibitor(idx, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      label="Stall / Booth Details"
                      placeholder="e.g. Stall A-14 (Octanorm Booth)"
                      value={exh.description || ''}
                      onChange={(e) => handleUpdateExhibitor(idx, { description: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      label="Logo URL *"
                      placeholder="https://images.unsplash.com/..."
                      value={exh.logoUrl}
                      onChange={(e) => handleUpdateExhibitor(idx, { logoUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveExhibitor(idx)}
                    title="Remove"
                    className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Partners */}
      {allianceTab === 'partners' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-dark-300">Institutional & Trade Chamber Alliances</span>
            <Button variant="outline" size="sm" onClick={handleAddPartner} leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add Partner
            </Button>
          </div>

          <div className="space-y-3">
            {(formData.partners || []).map((pt, idx) => (
              <div key={pt.id || idx} className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800 flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <Input
                      label="Partner / Association Name *"
                      placeholder="e.g. CODISSIA Trade Association"
                      value={pt.name}
                      onChange={(e) => handleUpdatePartner(idx, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      label="Alliance Type / Role"
                      placeholder="e.g. Official Trade Chamber Partner"
                      value={pt.description || ''}
                      onChange={(e) => handleUpdatePartner(idx, { description: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      label="Logo URL *"
                      placeholder="https://images.unsplash.com/..."
                      value={pt.logoUrl}
                      onChange={(e) => handleUpdatePartner(idx, { logoUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(idx)}
                    title="Remove"
                    className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
