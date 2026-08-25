'use client';

import React, { useState } from 'react';
import { GlobalSEOSettings, PageSEORule } from '@/types/globalSettings';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CMSImageUploader } from '@/components/admin/shared/CMSImageUploader';
import { Modal } from '@/components/ui/Modal';
import { Search, Globe, Tag, Save, CheckCircle2, AlertCircle, Plus, Trash2, Edit2 } from 'lucide-react';

interface SEOSettingsTabProps {
  initialData: GlobalSEOSettings;
  onSave: (data: GlobalSEOSettings) => Promise<{ success: boolean; error?: string }>;
}

export const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<GlobalSEOSettings>(initialData);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Page rule modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PageSEORule | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [modalPath, setModalPath] = useState('');
  const [modalPageName, setModalPageName] = useState('');
  const [modalMetaTitle, setModalMetaTitle] = useState('');
  const [modalMetaDescription, setModalMetaDescription] = useState('');
  const [modalNoIndex, setModalNoIndex] = useState(false);

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !data.defaultKeywords.includes(val)) {
        setData((prev) => ({
          ...prev,
          defaultKeywords: [...prev.defaultKeywords, val],
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setData((prev) => ({
      ...prev,
      defaultKeywords: prev.defaultKeywords.filter((k) => k !== keyword),
    }));
  };

  const handleOpenEditModal = (rule: PageSEORule) => {
    setIsAddingNew(false);
    setEditingRule(rule);
    setModalPath(rule.path);
    setModalPageName(rule.pageName);
    setModalMetaTitle(rule.metaTitle);
    setModalMetaDescription(rule.metaDescription);
    setModalNoIndex(rule.noIndex || false);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setIsAddingNew(true);
    setEditingRule(null);
    setModalPath('/exhibitors');
    setModalPageName('Exhibitors Directory');
    setModalMetaTitle('Exhibitors & Stalls Showcase | MCU Creations');
    setModalMetaDescription('Connect with verified franchise brands and exhibitor stalls across our business expos.');
    setModalNoIndex(false);
    setIsModalOpen(true);
  };

  const handleSaveModalRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: PageSEORule = {
      path: modalPath,
      pageName: modalPageName,
      metaTitle: modalMetaTitle,
      metaDescription: modalMetaDescription,
      noIndex: modalNoIndex,
    };

    if (isAddingNew) {
      setData((prev) => ({ ...prev, pageRules: [...prev.pageRules, newRule] }));
    } else if (editingRule) {
      setData((prev) => ({
        ...prev,
        pageRules: prev.pageRules.map((r) => (r.path === editingRule.path ? newRule : r)),
      }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteRule = (pathToDelete: string) => {
    setData((prev) => ({
      ...prev,
      pageRules: prev.pageRules.filter((r) => r.path !== pathToDelete),
    }));
  };

  const handleReset = () => {
    setData(initialData);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    const res = await onSave(data);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Global SEO, Open Graph social share card, and page rules saved.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save SEO settings.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-dark-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* 1. Live Google Search Result Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <Search className="h-4 w-4" /> Live Google Search Result Preview
          </span>
        </div>

        <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-1.5 max-w-2xl font-sans">
          <div className="flex items-center gap-2 text-[11px] text-dark-400">
            <Globe className="h-3 w-3 text-emerald-400" />
            <span className="text-dark-300">{data.canonicalBaseUrl || 'https://mcucreations.com'}</span>
          </div>
          <h4 className="text-base text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1">
            {data.defaultTitle || 'MCU Creations | Premier Event Management'}
          </h4>
          <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">
            {data.defaultMetaDescription ||
              'MCU Creations delivers premier B2B trade expos, franchise summits, and digital marketing solutions.'}
          </p>
        </div>
      </div>

      {/* 2. Global SEO Defaults */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-brand-400" />
          Global SEO Directives & Open Graph
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Default SEO Title Tag *"
            placeholder="MCU Creations | Premier Event Management, B2B Expos & Marketing"
            value={data.defaultTitle}
            onChange={(e) => setData({ ...data, defaultTitle: e.target.value })}
          />

          <Input
            label="Title Template (%s dynamically replaced with page title) *"
            placeholder="%s | MCU Creations"
            value={data.titleTemplate}
            onChange={(e) => setData({ ...data, titleTemplate: e.target.value })}
          />
        </div>

        <Textarea
          label="Default Meta Description (Fallback for pages without dedicated overrides) *"
          rows={3}
          value={data.defaultMetaDescription}
          onChange={(e) => setData({ ...data, defaultMetaDescription: e.target.value })}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium text-dark-300">
            Global Search Keywords (Type and press Enter)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-dark-950 border border-dark-700 rounded-xl min-h-[42px]">
            {data.defaultKeywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 text-xs bg-dark-800 text-white px-2.5 py-1 rounded-lg border border-dark-700"
              >
                <Tag className="h-2.5 w-2.5 text-brand-400" />
                {k}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(k)}
                  className="text-dark-400 hover:text-red-400 ml-1 font-bold text-xs"
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
              placeholder={data.defaultKeywords.length === 0 ? 'Type keyword and press Enter...' : 'Add more...'}
              className="bg-transparent text-xs text-white focus:outline-none flex-1 min-w-[140px]"
            />
          </div>
        </div>

        <CMSImageUploader
          label="Default OpenGraph / Social Share Card Image (1200x630px, 1.91:1 ratio)"
          value={data.defaultOgImage}
          onChange={(val) => setData({ ...data, defaultOgImage: val })}
        />
      </div>

      {/* 3. Page-Level Custom SEO Rules Table */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Page-Specific SEO Overrides ({data.pageRules.length})</h3>
            <p className="text-xs text-dark-400">Custom meta titles and descriptions for key public routes.</p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={handleOpenAddModal} leftIcon={<Plus className="h-4 w-4" />}>
            Add Page Rule
          </Button>
        </div>

        <div className="bg-dark-950/60 rounded-xl border border-dark-800 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-900/80 text-dark-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Route Path</th>
                <th className="py-3 px-4">Meta Title</th>
                <th className="py-3 px-4">Indexing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60 text-dark-200">
              {data.pageRules.map((rule) => (
                <tr key={rule.path} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{rule.path}</td>
                  <td className="py-3 px-4 text-dark-300 max-w-xs truncate">{rule.metaTitle}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        rule.noIndex ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {rule.noIndex ? 'noindex' : 'index, follow'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(rule)}
                        className="p-1.5 text-dark-400 hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(rule.path)}
                        className="p-1.5 text-dark-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-800">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
          Reset to Saved
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
          Save SEO Settings
        </Button>
      </div>

      {/* Page Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAddingNew ? 'Add Custom Page SEO' : `Edit SEO for ${modalPath}`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Route Path (e.g. /events) *"
            value={modalPath}
            onChange={(e) => setModalPath(e.target.value)}
          />

          <Input
            label="Page Identifier Name"
            value={modalPageName}
            onChange={(e) => setModalPageName(e.target.value)}
          />

          <Input
            label="Meta Title Tag *"
            value={modalMetaTitle}
            onChange={(e) => setModalMetaTitle(e.target.value)}
          />

          <Textarea
            label="Meta Description *"
            rows={3}
            value={modalMetaDescription}
            onChange={(e) => setModalMetaDescription(e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={modalNoIndex}
              onChange={(e) => setModalNoIndex(e.target.checked)}
              className="h-4 w-4 rounded bg-dark-900 border-dark-700 text-brand-500"
            />
            <span className="text-dark-300">Prevent search engines from indexing (noindex)</span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-dark-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveModalRule}>
              Save Rule
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
};
