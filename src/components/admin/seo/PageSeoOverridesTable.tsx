'use client';

import React, { useState } from 'react';
import { PageSEORule } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { Edit2, Globe, FileCode, Plus, Trash2, Tag, Search } from 'lucide-react';

interface PageSeoOverridesTableProps {
  pages: PageSEORule[];
  onChange: (updated: PageSEORule[]) => void;
}

export const PageSeoOverridesTable: React.FC<PageSeoOverridesTableProps> = ({ pages, onChange }) => {
  const [editingPage, setEditingPage] = useState<PageSEORule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [path, setPath] = useState('');
  const [pageName, setPageName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [ogImage, setOgImage] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  const handleOpenEdit = (page: PageSEORule) => {
    setIsAddingNew(false);
    setEditingPage(page);
    setPath(page.path);
    setPageName(page.pageName);
    setMetaTitle(page.metaTitle);
    setMetaDescription(page.metaDescription);
    setKeywords(page.keywords || []);
    setOgImage(page.ogImage || '');
    setNoIndex(page.noIndex || false);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setEditingPage(null);
    setPath('/about');
    setPageName('About Us');
    setMetaTitle('About MCU Creations | Premier Event Management Company');
    setMetaDescription('Learn about MCU Creations team, vision, and decade of experience in organizing B2B trade expos.');
    setKeywords(['About MCU', 'Event Management Team']);
    setOgImage('');
    setNoIndex(false);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRule: PageSEORule = {
      path,
      pageName,
      metaTitle,
      metaDescription,
      keywords,
      ogImage: ogImage.trim() || undefined,
      noIndex,
    };

    if (isAddingNew) {
      onChange([...pages, updatedRule]);
    } else if (editingPage) {
      onChange(pages.map((p) => (p.path === editingPage.path ? updatedRule : p)));
    }
    setIsModalOpen(false);
  };

  const handleDeleteRule = (pathToDelete: string) => {
    if (confirm(`Remove SEO rule for ${pathToDelete}?`)) {
      onChange(pages.filter((p) => p.path !== pathToDelete));
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setTagInput('');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCode className="h-4 w-4 text-brand-400" />
          Page-by-Page SEO Metadata Rules ({pages.length})
        </h3>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add Page SEO Rule
        </Button>
      </div>

      <div className="bg-dark-900/60 rounded-2xl border border-dark-800 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950/60 text-dark-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Route Path & Page</th>
                <th className="py-3.5 px-4">Meta Title</th>
                <th className="py-3.5 px-4">Meta Description</th>
                <th className="py-3.5 px-4">Indexing</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60 text-dark-200">
              {pages.map((page) => (
                <tr key={page.path} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{page.pageName}</span>
                      <span className="font-mono text-[11px] text-brand-400">{page.path}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-white font-medium line-clamp-1">{page.metaTitle}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="text-xs text-dark-300 line-clamp-2">{page.metaDescription}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        page.noIndex
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {page.noIndex ? 'noindex' : 'index, follow'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(page)}
                        leftIcon={<Edit2 className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(page.path)}
                        className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAddingNew ? 'Add Custom Page SEO Rule' : `Edit SEO for ${pageName}`}
        size="lg"
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Page Identifier Name *"
              placeholder="e.g. Events Directory"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              required
            />
            <Input
              label="Route Path (e.g. /events) *"
              placeholder="/events"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </div>

          <Input
            label="Meta Title Tag *"
            placeholder="Custom title shown on browser tab and search results"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
          />

          <Textarea
            label="Meta Description *"
            rows={3}
            placeholder="Concise 150-160 character description of this specific page..."
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
          />

          {/* Keywords */}
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">
              Page Keywords (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-dark-950 border border-dark-700 rounded-xl min-h-[40px]">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1 text-xs bg-dark-800 text-white px-2 py-0.5 rounded-md"
                >
                  #{k}
                  <button
                    type="button"
                    onClick={() => setKeywords(keywords.filter((item) => item !== k))}
                    className="text-dark-400 hover:text-red-400 ml-1 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Type keyword..."
                className="bg-transparent text-xs text-white focus:outline-none flex-1 min-w-[100px]"
              />
            </div>
          </div>

          <CMSImageUploader
            label="Custom OG Card Image (Optional override)"
            value={ogImage}
            onChange={setOgImage}
          />

          <div className="pt-2 border-t border-dark-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-brand-500 focus:ring-brand-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">Prevent Search Engines from Indexing (noindex)</span>
                <span className="text-[11px] text-dark-400 block">Use for private or staging pages</span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
