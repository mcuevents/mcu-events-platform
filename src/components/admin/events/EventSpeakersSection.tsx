'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { AdminEventFormData, EventSpeaker } from '@/types/events';
import { uploadEventImage } from '@/services/adminEvents.service';
import { Users, Plus, Trash2, UploadCloud, Linkedin, User } from 'lucide-react';

interface EventSpeakersSectionProps {
  formData: AdminEventFormData;
  onChange: (updates: Partial<AdminEventFormData>) => void;
}

export function EventSpeakersSection({
  formData,
  onChange,
}: EventSpeakersSectionProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddSpeaker = () => {
    const newSpeaker: EventSpeaker = {
      id: `spk-${Date.now()}`,
      name: '',
      role: 'Keynote Speaker',
      company: '',
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      linkedinUrl: '',
    };
    const current = formData.speakers || [];
    onChange({ speakers: [...current, newSpeaker] });
  };

  const handleUpdateSpeaker = (index: number, updates: Partial<EventSpeaker>) => {
    const current = [...(formData.speakers || [])];
    current[index] = { ...current[index], ...updates };
    onChange({ speakers: current });
  };

  const handleRemoveSpeaker = (index: number) => {
    const current = [...(formData.speakers || [])];
    current.splice(index, 1);
    onChange({ speakers: current });
  };

  const handleSpeakerAvatarUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    const res = await uploadEventImage(file, 'speakers');
    setUploadingIndex(null);

    if (res.success && res.url) {
      handleUpdateSpeaker(index, { avatarUrl: res.url });
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-dark-800 bg-dark-900/60 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Distinguished Keynote Speakers</h2>
            <p className="text-[11px] text-dark-400">Industry leaders, founders, and masterclass panelists</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddSpeaker}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          Add Speaker
        </Button>
      </div>

      <div className="space-y-4">
        {(formData.speakers || []).map((spk, idx) => (
          <div
            key={spk.id || idx}
            className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Speaker Avatar */}
              <div className="flex flex-col items-center space-y-2 shrink-0">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-dark-900 border border-dark-800">
                  {spk.avatarUrl ? (
                    <Image
                      src={spk.avatarUrl}
                      alt={spk.name || 'Speaker'}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-dark-500">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer text-[10px] text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  <UploadCloud className="h-3 w-3" />
                  <span>{uploadingIndex === idx ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleSpeakerAvatarUpload(idx, e)}
                    className="hidden"
                    disabled={uploadingIndex === idx}
                  />
                </label>
              </div>

              {/* Speaker Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <Input
                  label="Speaker Full Name *"
                  placeholder="e.g. Dr. Rajesh Sundaram"
                  value={spk.name}
                  onChange={(e) => handleUpdateSpeaker(idx, { name: e.target.value })}
                  required
                />

                <Input
                  label="Designation / Role *"
                  placeholder="e.g. Founder & Managing Director"
                  value={spk.role}
                  onChange={(e) => handleUpdateSpeaker(idx, { role: e.target.value })}
                  required
                />

                <Input
                  label="Organization / Brand *"
                  placeholder="e.g. Apex Franchise Retail Networks"
                  value={spk.company}
                  onChange={(e) => handleUpdateSpeaker(idx, { company: e.target.value })}
                  required
                />

                <Input
                  label="LinkedIn Profile URL"
                  placeholder="https://linkedin.com/in/..."
                  value={spk.linkedinUrl || ''}
                  onChange={(e) => handleUpdateSpeaker(idx, { linkedinUrl: e.target.value })}
                />
              </div>

              {/* Remove Button */}
              <div className="shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => handleRemoveSpeaker(idx)}
                  title="Remove Speaker"
                  className="p-2 rounded-lg bg-dark-900 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Textarea
              label="Speaker Biography / Session Topic"
              placeholder="Brief synopsis of industry accolades and keynote session theme..."
              rows={2}
              value={spk.bio || ''}
              onChange={(e) => handleUpdateSpeaker(idx, { bio: e.target.value })}
            />
          </div>
        ))}

        {(!formData.speakers || formData.speakers.length === 0) && (
          <div className="p-4 text-center rounded-xl bg-dark-950/40 border border-dark-800 text-xs text-dark-400">
            No speakers assigned yet. Click &quot;Add Speaker&quot; to publish keynote bios on the event page.
          </div>
        )}
      </div>
    </Card>
  );
}
