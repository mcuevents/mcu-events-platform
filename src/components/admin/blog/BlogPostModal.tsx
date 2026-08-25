'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BlogPost, BlogPostFormData } from '@/types/cms';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import {
  FileText,
  Sparkles,
  Image as ImageIcon,
  Tag,
  User,
  Eye,
  Edit3,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface BlogPostModalProps {
  isOpen: boolean;
  initialData?: BlogPost | null;
  onSave: (data: BlogPostFormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Industry Insights',
  'Exhibitor Strategy',
  'Social Media',
  'Event Tech & Production',
  'Franchise & MSME',
  'Case Studies',
];

export const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [category, setCategory] = useState('Industry Insights');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSlug(initialData.slug);
      setExcerpt(initialData.excerpt);
      setContent(initialData.content);
      setCoverImage(initialData.coverImage);
      setAuthorName(initialData.authorName);
      setAuthorAvatar(initialData.authorAvatar || '');
      setCategory(initialData.category || 'Industry Insights');
      setTags(initialData.tags || []);
      setIsPublished(initialData.isPublished);
      setPublishedAt(initialData.publishedAt ? initialData.publishedAt.slice(0, 16) : '');
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent(
        `## Introduction\n\nWrite your thought-leadership insights here...\n\n### Key Takeaways:\n- Point 1\n- Point 2\n- Point 3`
      );
      setCoverImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
      setAuthorName('MCU Editorial Desk');
      setAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
      setCategory('Industry Insights');
      setTags(['Expos', 'Business Growth', 'Tamil Nadu']);
      setIsPublished(true);
      setPublishedAt(new Date().toISOString().slice(0, 16));
    }
    setErrors({});
    setActiveTab('edit');
  }, [initialData, isOpen]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Article title is required.';
    if (!slug.trim()) newErrors.slug = 'URL slug is required.';
    if (!excerpt.trim()) newErrors.excerpt = 'Short excerpt is required.';
    if (!content.trim()) newErrors.content = 'Article body content cannot be empty.';
    if (!coverImage.trim()) newErrors.coverImage = 'Cover image is required.';
    if (!authorName.trim()) newErrors.authorName = 'Author attribution is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: BlogPostFormData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorName,
      authorAvatar: authorAvatar.trim() || undefined,
      category,
      tags,
      isPublished,
      publishedAt: isPublished ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : undefined,
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Blog Article' : 'Compose New Blog Article'}
      size="xl"
    >
      {/* Mode Switch Tabs */}
      <div className="flex items-center justify-between border-b border-dark-800 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Article Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-dark-800 text-dark-400'
            }`}
          >
            {isPublished ? 'Status: Will Publish Publicly' : 'Status: Save as Draft'}
          </span>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Title & Slug */}
          <div className="space-y-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              1. Title & URL Slug
            </div>

            <div className="space-y-3">
              <Input
                label="Article Headline *"
                placeholder="e.g., How to Maximize Exhibitor ROI at Business & Franchise Expos"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                error={errors.title}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">URL Slug *</label>
                  <div className="flex items-center">
                    <span className="bg-dark-900 border border-r-0 border-dark-700 rounded-l-xl px-2.5 py-2 text-xs text-dark-400 select-none">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      className="w-full bg-dark-950 border border-dark-700 rounded-r-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  {errors.slug && <p className="text-[11px] text-red-400 mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Textarea
                label="Summary / Excerpt (Shows in cards & Google preview) *"
                rows={2}
                placeholder="Brief 1-2 sentence hook explaining what readers will learn..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                error={errors.excerpt}
              />
            </div>
          </div>

          {/* Section 2: Markdown Content Body */}
          <div className="space-y-3 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
                <Edit3 className="h-4 w-4" />
                2. Article Content (Markdown / HTML Supported)
              </div>
              <span className="text-[10px] text-dark-400">Supports ## H2, ### H3, - Lists, & Bold</span>
            </div>

            <Textarea
              rows={8}
              placeholder="Write full article body..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={errors.content}
            />
          </div>

          {/* Section 3: Cover Media & Author Attribution */}
          <div className="space-y-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              <ImageIcon className="h-4 w-4" />
              3. Visuals & Author Attribution
            </div>

            <CMSImageUploader
              label="Cover Hero Image URL *"
              value={coverImage}
              onChange={setCoverImage}
              helperText="Recommended size: 1200x630 (16:9 ratio for crisp social sharing)"
            />
            {errors.coverImage && <p className="text-[11px] text-red-400 mt-1">{errors.coverImage}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Author Name *"
                placeholder="e.g., M. Ragul or MCU Marketing Team"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                error={errors.authorName}
              />

              <Input
                label="Author Avatar Image URL (Optional)"
                placeholder="https://..."
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
              />
            </div>
          </div>

          {/* Section 4: Tags, Scheduling & Publishing */}
          <div className="space-y-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              4. Tags & Publication Controls
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">
                Topic Tags (Type tag and press Enter)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-dark-950 border border-dark-700 rounded-xl min-h-[42px]">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs bg-dark-800 text-white px-2.5 py-1 rounded-lg border border-dark-700"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-dark-400 hover:text-red-400 ml-1 text-xs font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add more...'}
                  className="bg-transparent text-xs text-white focus:outline-none flex-1 min-w-[120px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-800">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-900/60 rounded-xl border border-dark-700/60">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Publish Article Publicly</span>
                  <span className="text-[11px] text-dark-400 block">
                    When enabled, article is indexable and visible on /blog
                  </span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Publish Timestamp</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {initialData ? 'Save Changes' : 'Create Article'}
            </Button>
          </div>
        </form>
      ) : (
        /* Preview Tab */
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Article Header Preview */}
          <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-dark-800 border border-dark-700">
            {coverImage && (
              <Image src={coverImage} alt={title || 'Cover'} fill className="object-cover" unoptimized />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent flex flex-col justify-end p-6">
              <span className="inline-block bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full w-fit mb-2">
                {category}
              </span>
              <h1 className="text-2xl font-black text-white leading-tight mb-2">
                {title || 'Untitled Article Headline'}
              </h1>
              <div className="flex items-center gap-3 text-xs text-dark-300">
                <span>By {authorName || 'MCU Author'}</span>
                <span>•</span>
                <span>
                  {publishedAt ? new Date(publishedAt).toDateString() : new Date().toDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Excerpt Lead */}
          <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-800 italic text-dark-300 text-sm">
            &ldquo;{excerpt || 'Article summary excerpt will appear here.'}&rdquo;
          </div>

          {/* Content Body Rendering */}
          <div className="bg-dark-950/60 p-6 rounded-2xl border border-dark-800 text-dark-200 text-sm whitespace-pre-wrap leading-relaxed font-sans">
            {content || 'Article content body will be displayed here...'}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-dark-900 text-dark-300 px-3 py-1 rounded-full border border-dark-800"
              >
                #{t}
              </span>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-dark-800">
            <Button variant="primary" size="sm" onClick={() => setActiveTab('edit')}>
              Return to Edit
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
