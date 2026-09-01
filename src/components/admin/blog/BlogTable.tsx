'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, AdminBlogFilters } from '@/types/cms';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface BlogTableProps {
  items: BlogPost[];
  onAddNew: () => void;
  onEdit: (item: BlogPost) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
  isActionLoading?: boolean;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  isActionLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus === 'published' && !item.isPublished) return false;
      if (selectedStatus === 'draft' && item.isPublished) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchExcerpt = item.excerpt.toLowerCase().includes(q);
        const matchAuthor = item.authorName.toLowerCase().includes(q);
        const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchTag) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedStatus, searchTerm]);

  const publishedCount = items.filter((i) => i.isPublished).length;
  const draftCount = items.filter((i) => !i.isPublished).length;

  return (
    <div className="space-y-4">
      {/* 1. Filter Bar & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900/60 p-4 rounded-2xl border border-dark-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search by title, author, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-dark-950/80 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-dark-950/80 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-950/80 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Status ({items.length})</option>
            <option value="published">Published ({publishedCount})</option>
            <option value="draft">Drafts ({draftCount})</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
            New Article
          </Button>
        </div>
      </div>

      {/* 2. Blog Posts Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-dark-900/40 rounded-2xl border border-dark-800/80 p-12 text-center">
          <BookOpen className="h-12 w-12 text-dark-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No articles found</h3>
          <p className="text-xs text-dark-400 max-w-md mx-auto mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'No blog articles match your active filter criteria.'
              : 'Start sharing valuable event management and franchise insights by creating your first article.'}
          </p>
          <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
            Create First Article
          </Button>
        </div>
      ) : (
        <div className="bg-dark-900/60 rounded-2xl border border-dark-800 overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-950/60 text-dark-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60 text-dark-200">
                {filteredItems.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Article Thumbnail & Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3.5 max-w-md">
                        <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-dark-800 border border-dark-700/60 shrink-0">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-dark-500">
                              <BookOpen className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-white font-bold text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-dark-400 text-xs line-clamp-2">{post.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 text-[10px] bg-dark-800/80 text-dark-300 px-1.5 py-0.5 rounded border border-dark-700/40"
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                              </span>
                            ))}
                            {post.tags && post.tags.length > 3 && (
                              <span className="text-[10px] text-dark-400">+{post.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge variant="blue" size="sm">
                        {post.category}
                      </Badge>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {post.authorAvatar ? (
                          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-dark-700">
                            <Image src={post.authorAvatar} alt={post.authorName} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px]">
                            {post.authorName.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs text-white font-medium">{post.authorName}</span>
                      </div>
                    </td>

                    {/* Status & Quick Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onTogglePublish(post.id, !post.isPublished)}
                        disabled={isActionLoading}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          post.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {post.isPublished ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 text-amber-400" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-dark-300">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-dark-400" />
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : new Date(post.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-dark-400 hover:text-brand-400 hover:bg-dark-800 rounded-lg transition-colors"
                          title="Preview public page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onEdit(post)}
                          className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(post.id)}
                          className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
