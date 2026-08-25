'use client';

import React from 'react';
import Image from 'next/image';
import { EntityPartner } from '@/types/partners';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Award,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface SponsorsTableProps {
  items: EntityPartner[];
  onAddNew: () => void;
  onEdit: (item: EntityPartner) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function SponsorsTable({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}: SponsorsTableProps) {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Badge variant="gold" size="sm">Platinum</Badge>;
      case 'gold':
        return <Badge variant="amber" size="sm">Gold</Badge>;
      case 'silver':
        return <Badge variant="gray" size="sm">Silver</Badge>;
      case 'bronze':
        return <Badge variant="amber" size="sm">Bronze</Badge>;
      case 'media':
        return <Badge variant="blue" size="sm">Media</Badge>;
      default:
        return <Badge variant="gray" size="sm">{tier}</Badge>;
    }
  };

  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-12 font-mono">Order</th>
              <th className="py-3.5 px-3 font-semibold">Sponsor Brand & Logo</th>
              <th className="py-3.5 px-3 font-semibold">Sponsorship Tier</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Associated Event</th>
              <th className="py-3.5 px-3 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
                      <Award className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No sponsors configured</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Add corporate sponsors to feature their branding across event banners and summit halls.
                    </p>
                    <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Corporate Sponsor
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((sp) => (
                <tr key={sp.id} className="hover:bg-dark-950/40 transition-colors group">
                  <td className="py-3.5 pl-4 pr-2 font-mono text-dark-400 font-bold">
                    #{sp.displayOrder}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-dark-950 border border-dark-800 shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                        {sp.logoUrl ? (
                          <Image
                            src={sp.logoUrl}
                            alt={sp.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <Award className="h-5 w-5 text-dark-500" />
                        )}
                      </div>

                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate">
                          {sp.name}
                        </span>
                        {sp.description && (
                          <p className="text-[11px] text-dark-400 truncate max-w-xs">
                            {sp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getTierBadge(sp.tier)}
                  </td>

                  <td className="py-3.5 px-3 hidden md:table-cell">
                    {sp.eventTitle ? (
                      <span className="text-dark-200 font-medium truncate block max-w-[180px]">
                        {sp.eventTitle}
                      </span>
                    ) : (
                      <span className="text-dark-500 text-[11px]">Brand-Wide Sponsor</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {sp.isActive ? (
                      <Badge variant="green" size="sm">Active</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">Inactive</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 ${sp.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
                        onClick={() => onToggleActive(sp.id, !sp.isActive)}
                        title={sp.isActive ? 'Deactivate sponsor' : 'Activate sponsor'}
                        disabled={isActionLoading}
                      >
                        {sp.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-dark-300 hover:text-white"
                        onClick={() => onEdit(sp)}
                        title="Edit Sponsor"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={() => onDelete(sp.id)}
                        title="Delete Sponsor"
                        disabled={isActionLoading}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
