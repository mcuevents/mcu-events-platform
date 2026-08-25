'use client';

import React from 'react';
import Image from 'next/image';
import { TeamMember } from '@/types/cms';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Plus,
} from 'lucide-react';

interface TeamTableProps {
  items: TeamMember[];
  onAddNew: () => void;
  onEdit: (item: TeamMember) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function TeamTable({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}: TeamTableProps) {
  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-12 font-mono">Order</th>
              <th className="py-3.5 px-3 font-semibold">Executive & Photo</th>
              <th className="py-3.5 px-3 font-semibold">Role / Title</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Contact & Social</th>
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
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No team members configured</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Add leadership and organizing committee profiles to showcase on the public About page.
                    </p>
                    <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Team Member
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((tm) => (
                <tr key={tm.id} className="hover:bg-dark-950/40 transition-colors group">
                  <td className="py-3.5 pl-4 pr-2 font-mono text-dark-400 font-bold">
                    #{tm.displayOrder}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-xl bg-dark-950 border border-dark-800 shrink-0 overflow-hidden">
                        {tm.imageUrl ? (
                          <Image
                            src={tm.imageUrl}
                            alt={tm.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-dark-500 m-auto mt-3" />
                        )}
                      </div>

                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate">
                          {tm.name}
                        </span>
                        {tm.bio && (
                          <p className="text-[11px] text-dark-400 line-clamp-1 max-w-xs">
                            {tm.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-medium text-dark-200">
                    {tm.role}
                  </td>

                  <td className="py-3.5 px-3 hidden md:table-cell">
                    {tm.email ? (
                      <a
                        href={`mailto:${tm.email}`}
                        className="text-[11px] text-dark-400 hover:text-brand-400 flex items-center gap-1 truncate max-w-[170px]"
                      >
                        <Mail className="h-3 w-3" />
                        <span>{tm.email}</span>
                      </a>
                    ) : (
                      <span className="text-dark-500 text-[11px]">N/A</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {tm.isActive ? (
                      <Badge variant="green" size="sm">Active</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">Hidden</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 ${tm.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
                        onClick={() => onToggleActive(tm.id, !tm.isActive)}
                        title={tm.isActive ? 'Hide from public' : 'Publish to public'}
                        disabled={isActionLoading}
                      >
                        {tm.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-dark-300 hover:text-white"
                        onClick={() => onEdit(tm)}
                        title="Edit Profile"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={() => onDelete(tm.id)}
                        title="Delete Profile"
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
