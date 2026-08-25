'use client';

import React from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types/cms';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MessageSquareQuote,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Plus,
} from 'lucide-react';

interface TestimonialsTableProps {
  items: Testimonial[];
  onAddNew: () => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string, isPublished: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function TestimonialsTable({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  isActionLoading = false,
}: TestimonialsTableProps) {
  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-12 font-mono">Order</th>
              <th className="py-3.5 px-3 font-semibold">Client & Company</th>
              <th className="py-3.5 px-3 font-semibold">Rating</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Endorsement Quote</th>
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
                      <MessageSquareQuote className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No testimonials configured</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Add verified client reviews to showcase social proof across the website.
                    </p>
                    <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Testimonial
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((t) => (
                <tr key={t.id} className="hover:bg-dark-950/40 transition-colors group">
                  <td className="py-3.5 pl-4 pr-2 font-mono text-dark-400 font-bold">
                    #{t.displayOrder}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-xl bg-dark-950 border border-dark-800 shrink-0 overflow-hidden">
                        {t.avatarUrl ? (
                          <Image
                            src={t.avatarUrl}
                            alt={t.clientName}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <MessageSquareQuote className="h-5 w-5 text-dark-500 m-auto mt-3" />
                        )}
                      </div>

                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate">
                          {t.clientName}
                        </span>
                        <span className="text-[10px] text-dark-400 truncate block">
                          {t.companyName ? `${t.companyName} (${t.clientTitle || 'Client'})` : (t.clientTitle || 'Verified Client')}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 hidden md:table-cell">
                    <p className="text-dark-300 line-clamp-2 max-w-md italic text-[11px]">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {t.isPublished !== false ? (
                      <Badge variant="green" size="sm">Published</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">Hidden</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 ${t.isPublished !== false ? 'text-amber-400' : 'text-emerald-400'}`}
                        onClick={() => onTogglePublish(t.id, t.isPublished === false)}
                        title={t.isPublished !== false ? 'Hide from public' : 'Publish to public'}
                        disabled={isActionLoading}
                      >
                        {t.isPublished !== false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-dark-300 hover:text-white"
                        onClick={() => onEdit(t)}
                        title="Edit Testimonial"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={() => onDelete(t.id)}
                        title="Delete Testimonial"
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
