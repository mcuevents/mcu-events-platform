import React from 'react';
import { EntityPartner } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, ExternalLink } from 'lucide-react';

export interface PartnerCardProps {
  partner: EntityPartner;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  return (
    <div className="flex flex-col h-full text-center items-center p-6 rounded-2xl border border-[#EAE0D5] bg-white shadow-sm hover:border-[#B8862B]/50 transition-colors">
      <div className="flex h-20 w-full items-center justify-center rounded-xl bg-[#FAF8F5] p-4 border border-[#EAE0D5] mb-4">
        {partner.logoUrl ? (
          <img src={partner.logoUrl} alt={partner.name} className="max-h-12 max-w-full object-contain" />
        ) : (
          <Building className="h-8 w-8 text-[#B8862B]" />
        )}
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8862B] bg-[#B8862B]/10 px-2 py-0.5 rounded-full border border-[#B8862B]/20 mb-2 font-mono">
        {partner.tier} {partner.category}
      </span>

      <h4 className="font-serif text-base font-bold text-[#2C241C] mb-1">{partner.name}</h4>
      {partner.description && (
        <p className="text-xs text-[#6E6258] line-clamp-2 leading-relaxed">{partner.description}</p>
      )}

      {partner.websiteUrl && (
        <a
          href={partner.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#B8862B] hover:text-[#9E701C] underline"
        >
          <span>Visit Website</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};
