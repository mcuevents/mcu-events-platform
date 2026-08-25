import React from 'react';
import { EntityPartner } from '@/types/partners';
import { Store } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface EventExhibitorsProps {
  exhibitors?: EntityPartner[];
  onOpenExhibitorModal?: () => void;
}

export function EventExhibitors({ exhibitors, onOpenExhibitorModal }: EventExhibitorsProps) {
  if (!exhibitors || exhibitors.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8862B]/10 text-[#B8862B] border border-[#B8862B]/20">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2C241C]">Confirmed Exhibitors & Stalls</h3>
            <p className="text-xs text-[#6E6258]">Explore showcase brands, enterprise setups, and live demos on the floor</p>
          </div>
        </div>

        {onOpenExhibitorModal && (
          <button
            type="button"
            onClick={onOpenExhibitorModal}
            className="text-xs font-bold text-[#B8862B] hover:text-[#9E701C] underline underline-offset-4"
          >
            + Book Your Stall Space
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {exhibitors.map((ex) => (
          <Card key={ex.id} className="p-4 hover:border-[#B8862B]/50 transition-colors flex flex-col justify-between group bg-white border-[#EAE0D5] shadow-sm">
            <div className="space-y-3">
              <div className="h-16 w-full flex items-center justify-center rounded-xl bg-[#FAF8F5] p-2 border border-[#EAE0D5]">
                <img
                  src={ex.logoUrl}
                  alt={ex.name}
                  className="max-h-12 max-w-full object-contain filter group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h4 className="font-serif text-xs font-bold text-[#2C241C] group-hover:text-[#B8862B] transition-colors line-clamp-1">
                  {ex.name}
                </h4>
                {ex.description && (
                  <p className="text-[11px] text-[#6E6258] mt-1 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
