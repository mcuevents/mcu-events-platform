'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { VideoItem } from '@/types/media';
import { getSafeEmbedUrl } from '@/services/adminMedia.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Video as VideoIcon,
  Play,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';

interface VideoTableProps {
  items: VideoItem[];
  onAddNew: () => void;
  onEdit: (item: VideoItem) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string, isPublished: boolean) => Promise<void>;
  isActionLoading?: boolean;
}

export function VideoTable({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  isActionLoading = false,
}: VideoTableProps) {
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Badge variant="red" size="sm">YouTube</Badge>;
      case 'vimeo':
        return <Badge variant="blue" size="sm">Vimeo</Badge>;
      default:
        return <Badge variant="gray" size="sm">HTTPS Video</Badge>;
    }
  };

  return (
    <Card className="border-dark-800 bg-dark-900/60 overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[10px] font-bold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 pl-4 pr-2 w-12 font-mono">Order</th>
              <th className="py-3.5 px-3 font-semibold">Video & Thumbnail</th>
              <th className="py-3.5 px-3 font-semibold">Platform & Channel</th>
              <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Associated Event</th>
              <th className="py-3.5 px-3 font-semibold">Visibility</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-950 border border-dark-800 text-dark-400">
                      <VideoIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No video features found</p>
                    <p className="text-xs text-dark-400 max-w-sm">
                      Add YouTube or Vimeo showreels to showcase aftermovies, ceremonies, and interviews.
                    </p>
                    <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Video Feature
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((v) => (
                <tr key={v.id} className="hover:bg-dark-950/40 transition-colors group">
                  {/* Order */}
                  <td className="py-3.5 pl-4 pr-2 font-mono text-dark-400 font-bold">
                    #{v.displayOrder}
                  </td>

                  {/* Video & Thumbnail */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative h-14 w-24 rounded-lg bg-dark-950 border border-dark-800 shrink-0 overflow-hidden cursor-pointer group/thumb"
                        onClick={() => setPreviewVideo(v)}
                        title="Click to preview video"
                      >
                        {v.thumbnailUrl ? (
                          <Image
                            src={v.thumbnailUrl}
                            alt={v.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-dark-500 bg-dark-950">
                            <VideoIcon className="h-5 w-5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>

                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-white group-hover:text-brand-400 transition-colors block truncate">
                          {v.title}
                        </span>
                        {v.description && (
                          <p className="text-[11px] text-dark-400 truncate max-w-xs">
                            {v.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Platform & Channel */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <div>{getPlatformBadge(v.platform)}</div>
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-dark-400 hover:text-brand-400 flex items-center gap-1 truncate max-w-[150px]"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </td>

                  {/* Associated Event */}
                  <td className="py-3.5 px-3 hidden md:table-cell">
                    <div className="min-w-0 max-w-[180px]">
                      {v.eventTitle ? (
                        <span className="text-dark-200 font-medium truncate block">
                          {v.eventTitle}
                        </span>
                      ) : (
                        <span className="text-dark-500 text-[11px]">General Brand Reel</span>
                      )}
                      <span className="text-[10px] text-dark-500 capitalize">
                        {v.category}
                      </span>
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {v.isPublished ? (
                      <Badge variant="green" size="sm">Published</Badge>
                    ) : (
                      <Badge variant="gray" size="sm">Hidden</Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-brand-400 hover:text-brand-300"
                        onClick={() => setPreviewVideo(v)}
                        title="Watch Preview"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 ${v.isPublished ? 'text-amber-400' : 'text-emerald-400'}`}
                        onClick={() => onTogglePublish(v.id, !v.isPublished)}
                        title={v.isPublished ? 'Hide from public' : 'Publish to public'}
                        disabled={isActionLoading}
                      >
                        {v.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-dark-300 hover:text-white"
                        onClick={() => onEdit(v)}
                        title="Edit Video"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={() => onDelete(v.id)}
                        title="Delete Video"
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

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <Card className="max-w-2xl w-full p-4 border-dark-800 bg-dark-950 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-dark-800">
              <h3 className="text-sm font-bold text-white truncate max-w-lg">
                {previewVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-1 text-dark-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-dark-800">
              <iframe
                src={getSafeEmbedUrl(previewVideo.videoUrl, previewVideo.platform)}
                title={previewVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
