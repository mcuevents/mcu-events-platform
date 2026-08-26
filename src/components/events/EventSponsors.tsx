import React from 'react';
import { EntityPartner } from '@/types/partners';
import { Award, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventSponsorsProps {
  sponsors?: EntityPartner[];
}

export function EventSponsors({ sponsors }: EventSponsorsProps) {
  if (!sponsors || sponsors.length === 0) return null;

  // Group sponsors by tier
  const platinum = sponsors.filter((s) => s.tier === 'platinum');
  const gold = sponsors.filter((s) => s.tier === 'gold');
  const silver = sponsors.filter((s) => s.tier === 'silver');
  const other = sponsors.filter((s) => !['platinum', 'gold', 'silver'].includes(s.tier));

  const tierGroups = [
    { label: 'Platinum Title Sponsors', items: platinum, badge: 'gold' as const },
    { label: 'Gold Associate Sponsors', items: gold, badge: 'gold' as const },
    { label: 'Silver & Supporting Sponsors', items: silver, badge: 'green' as const },
    { label: 'Official Media & Channel Partners', items: other, badge: 'gray' as const },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/20">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2C241C]">Event Sponsors & Corporate Alliances</h3>
            <p className="text-xs text-[#6E6258]">Leading enterprises and institutions powering this gathering</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tierGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8862B] font-mono bg-[#B8862B]/10 px-2.5 py-0.5 rounded-full border border-[#B8862B]/20">
                {group.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {group.items.map((sp) => (
                <div
                  key={sp.id}
                  className="rounded-2xl border border-[#EAE0D5] bg-white p-4 flex flex-col items-center justify-center text-center hover:border-[#B8862B]/50 transition-colors shadow-sm group"
                >
                  <div className="h-14 w-full flex items-center justify-center p-2">
                    <img
                      src={sp.logoUrl}
                      alt={sp.name}
                      className="max-h-10 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <span className="font-serif text-xs font-bold text-[#2C241C] mt-2 group-hover:text-[#B8862B] transition-colors line-clamp-1">
                    {sp.name}
                  </span>
                  {sp.description && (
                    <p className="text-[10px] text-[#7A6D62] mt-1 line-clamp-2 leading-tight">
                      {sp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
