'use client';

import React from 'react';
import Image from 'next/image';
import { EntityPartner } from '@/types/partners';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Handshake,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface PartnersTableProps {
  items: EntityPartner[];
  onAddNew: () => void;
  onEdit: (item: EntityPartner) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function PartnersTable({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}: PartnersTableProps) {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Badge variant="gold" size="sm">Platinum</Badge>;
      case 'gold':
        return <Badge variant="amber" size="sm">Gold</Badge>;
      case 'silver':
        return <Badge variant="gray" size="sm">Silver</Badge>;
      case 'media':
        return <Badge variant="blue" size="sm">Media</Badge>;
      default:
        return <Badge variant="gray" size="sm">General</Badge>;
    }
  };

  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-12 font-mono">Order</th>
              <th className="py-3.5 px-3 font-semibold">Partner Organization & Logo</th>
              <th className="py-3.5 px-3 font-semibold">Alliance Tier</th>
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
                      <Handshake className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No partners configured</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Add institutional chambers, trade bodies, and strategic partners.
                    </p>
                    <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Strategic Partner
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((pt) => (
                <tr key={pt.id} className="hover:bg-dark-950/40 transition-colors group">
                  <td className="py-3.5 pl-4 pr-2 font-mono text-dark-400 font-bold">
                    #{pt.displayOrder}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-dark-950 border border-dark-800 shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                        {pt.logoUrl ? (
                          <Image
                            src={pt.logoUrl}
                            alt={pt.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <Handshake className="h-5 w-5 text-dark-500" />
                        )}
                      </div>

                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate">
                          {pt.name}
                        </span>
                        {pt.websiteUrl && (
                          <a
                            href={pt.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-dark-400 hover:text-brand-400 flex items-center gap-1 truncate"
                          >
                            <span>{pt.websiteUrl.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getTierBadge(pt.tier)}
                  </td>

                  <td className="py-3.5 px-3 hidden md:table-cell">
                    {pt.eventTitle ? (
                      <span className="text-dark-200 font-medium truncate block max-w-[180px]">
                        {pt.eventTitle}
                      </span>
                    ) : (
                      <span className="text-dark-500 text-[11px]">Statewide Chamber</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {pt.isActive ? (
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
                        className={`h-7 w-7 p-0 ${pt.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
                        onClick={() => onToggleActive(pt.id, !pt.isActive)}
                        title={pt.isActive ? 'Deactivate partner' : 'Activate partner'}
                        disabled={isActionLoading}
                      >
                        {pt.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-dark-300 hover:text-white"
                        onClick={() => onEdit(pt)}
                        title="Edit Partner"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={() => onDelete(pt.id)}
                        title="Delete Partner"
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
