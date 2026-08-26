import React from 'react';
import { EventSpeaker } from '@/types/events';
import { Card } from '@/components/ui/card';
import { Mic, Linkedin } from 'lucide-react';

interface EventSpeakersProps {
  speakers?: EventSpeaker[];
}

export function EventSpeakers({ speakers }: EventSpeakersProps) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/20">
          <Mic className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C241C]">Distinguished Speakers & Guests</h3>
          <p className="text-xs text-[#6E6258]">Industry leaders, institutional specialists, and keynote panelists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakers.map((spk) => (
          <Card key={spk.id} className="p-5 flex flex-col justify-between hover:border-[#B8862B]/50 transition-colors group bg-white border-[#EAE0D5] shadow-sm">
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5">
                <img
                  src={spk.avatarUrl}
                  alt={spk.name}
                  className="h-14 w-14 rounded-xl object-cover border border-[#EAE0D5] shrink-0 group-hover:border-[#B8862B]/50 transition-colors"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif text-sm font-bold text-[#2C241C] group-hover:text-[#B8862B] transition-colors truncate">
                    {spk.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#B8862B] truncate mt-0.5">{spk.role}</p>
                  <p className="text-[11px] text-[#7A6D62] truncate">{spk.company}</p>
                </div>
              </div>

              {spk.bio && (
                <p className="text-xs text-[#6E6258] line-clamp-3 leading-relaxed border-t border-[#F3ECE4] pt-3">
                  {spk.bio}
                </p>
              )}
            </div>

            {spk.linkedinUrl && (
              <div className="pt-3 mt-3 border-t border-[#F3ECE4] flex justify-end">
                <a
                  href={spk.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#7A6D62] hover:text-[#B8862B] transition-colors"
                >
                  <Linkedin className="h-3 w-3" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
