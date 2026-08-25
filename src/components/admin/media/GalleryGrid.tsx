'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types/media';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Image as ImageIcon,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

interface GalleryGridProps {
  items: GalleryItem[];
  onAddNew: () => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string, isPublished: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function GalleryGrid({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  isActionLoading = false,
}: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'events', label: 'Expos & Events' },
    { id: 'exhibitions', label: 'Stalls & Booths' },
    { id: 'corporate', label: 'Conclaves' },
    { id: 'entertainment', label: 'Concerts' },
    { id: 'behind_the_scenes', label: 'Behind The Scenes' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.eventTitle && item.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-dark-900/60 border border-dark-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-dark-950 shadow-sm'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 shrink-0">
          <Input
            placeholder="Search photo title or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 border-dark-800 bg-dark-900/40 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400 mx-auto">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No gallery photos found</h3>
          <p className="text-xs text-dark-400 max-w-sm mx-auto">
            No photos found for the selected category or search filter. Upload your first showcase photo to get started.
          </p>
          <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
            Upload Photo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-dark-800 bg-dark-900/70 hover:border-brand-500/40 transition-all duration-300 p-0 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full bg-dark-950 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-dark-950/80 backdrop-blur-sm text-[10px] font-mono text-dark-300 border border-dark-800">
                    #{item.displayOrder}
                  </span>
                  {item.isPublished ? (
                    <Badge variant="green" size="sm">Live</Badge>
                  ) : (
                    <Badge variant="gray" size="sm">Hidden</Badge>
                  )}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-dark-900/90 text-white hover:text-brand-400"
                    onClick={() => onEdit(item)}
                    title="Edit Photo"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 bg-dark-900/90 ${item.isPublished ? 'text-amber-400' : 'text-emerald-400'}`}
                    onClick={() => onTogglePublish(item.id, !item.isPublished)}
                    title={item.isPublished ? 'Hide from public' : 'Publish to public'}
                    disabled={isActionLoading}
                  >
                    {item.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-dark-900/90 text-red-400 hover:text-red-300"
                    onClick={() => onDelete(item.id)}
                    title="Delete Photo"
                    disabled={isActionLoading}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Photo Information Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-dark-400 line-clamp-2 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-dark-400 pt-2 border-t border-dark-800/60">
                  <span className="capitalize">{(item.category || 'events').replace('_', ' ')}</span>
                  {item.eventTitle && <span className="truncate max-w-[120px]">{item.eventTitle}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
