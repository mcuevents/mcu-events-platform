'use client';

import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceItemFormData, ServiceCategory } from '@/types/cms';
import { Modal } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Briefcase,
  Calendar,
  Megaphone,
  Share2,
  Palette,
  Shield,
  Award,
  Users,
  TrendingUp,
  Sparkles,
  Building,
  Video,
  Mic,
  BarChart,
  Rocket,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  initialData?: ServiceItem | null;
  onSave: (data: ServiceItemFormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'Calendar', label: 'Calendar', icon: Calendar },
  { name: 'Megaphone', label: 'Marketing', icon: Megaphone },
  { name: 'Share2', label: 'Social Media', icon: Share2 },
  { name: 'Palette', label: 'Branding', icon: Palette },
  { name: 'Briefcase', label: 'Corporate', icon: Briefcase },
  { name: 'Award', label: 'Awards', icon: Award },
  { name: 'Users', label: 'Delegates', icon: Users },
  { name: 'TrendingUp', label: 'Growth', icon: TrendingUp },
  { name: 'Sparkles', label: 'VIP Production', icon: Sparkles },
  { name: 'Building', label: 'Venue Stalls', icon: Building },
  { name: 'Video', label: 'Videography', icon: Video },
  { name: 'Mic', label: 'Keynotes', icon: Mic },
  { name: 'BarChart', label: 'Analytics', icon: BarChart },
  { name: 'Rocket', label: 'Launch', icon: Rocket },
  { name: 'Shield', label: 'Security', icon: Shield },
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('event_management');
  const [iconName, setIconName] = useState('Calendar');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSlug(initialData.slug);
      setCategory(initialData.category);
      setIconName(initialData.iconName || 'Briefcase');
      setShortDescription(initialData.shortDescription);
      setFullDescription(initialData.fullDescription);
      setFeatures(initialData.features || []);
      setDisplayOrder(initialData.displayOrder || 1);
      setIsActive(initialData.isActive);
    } else {
      setTitle('');
      setSlug('');
      setCategory('event_management');
      setIconName('Calendar');
      setShortDescription('');
      setFullDescription('');
      setFeatures([
        'Full 3D floor plan and stall layout architecture',
        'Visitor RFID/QR gate registration command',
        'Sound, LED screen & stage truss engineering',
      ]);
      setDisplayOrder(1);
      setIsActive(true);
    }
    setFeatureInput('');
    setErrors({});
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

  const handleAddFeature = () => {
    const val = featureInput.trim();
    if (val && !features.includes(val)) {
      setFeatures([...features, val]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Service package title is required.';
    if (!slug.trim()) newErrors.slug = 'URL slug is required.';
    if (!shortDescription.trim()) newErrors.shortDescription = 'Short description is required.';
    if (!fullDescription.trim()) newErrors.fullDescription = 'Full detailed description is required.';
    if (features.length === 0) newErrors.features = 'Please add at least 1 feature / deliverable.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: ServiceItemFormData = {
      title,
      slug,
      category,
      iconName,
      shortDescription,
      fullDescription,
      features,
      displayOrder: Number(displayOrder) || 0,
      isActive,
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Service Package' : 'Create Service Package'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
            <Briefcase className="h-4 w-4" />
            1. Package Name & Classification
          </div>

          <Input
            label="Service Title *"
            placeholder="e.g., Turnkey Event Management & Logistics"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            error={errors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">URL Anchor / Slug *</label>
              <div className="flex items-center">
                <span className="bg-dark-900 border border-r-0 border-dark-700 rounded-l-xl px-2.5 py-2 text-xs text-dark-400 select-none">
                  #
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
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Service Vertical *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="event_management">Event Management & Logistics</option>
                <option value="digital_marketing">Digital Marketing & Leads</option>
                <option value="social_media">Social Media & Reels</option>
                <option value="branding">Branding & Sponsorships</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Icon Selection */}
        <div className="space-y-3 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
          <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider">
            2. Service Category Icon
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {AVAILABLE_ICONS.map(({ name, label, icon: IconItem }) => (
              <button
                key={name}
                type="button"
                onClick={() => setIconName(name)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  iconName === name
                    ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                    : 'bg-dark-900/60 border-dark-800 text-dark-400 hover:text-white hover:border-dark-700'
                }`}
                title={label}
              >
                <IconItem className="h-4 w-4" />
                <span className="text-[9px] truncate w-full text-center">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Descriptions */}
        <div className="space-y-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
            3. Detailed Value Proposition
          </div>

          <Textarea
            label="Short Summary (Displayed on main cards) *"
            rows={2}
            placeholder="High-level 1-2 sentence overview of the vertical..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            error={errors.shortDescription}
          />

          <Textarea
            label="Full In-Depth Description *"
            rows={4}
            placeholder="Elaborate on methodology, equipment, team expertise, and deliverables..."
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            error={errors.fullDescription}
          />
        </div>

        {/* Section 4: Feature Bullets List Builder */}
        <div className="space-y-3 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              4. Included Features & Deliverables ({features.length})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="e.g., German Hangar Air-Conditioned Tents"
              className="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-400 focus:outline-none focus:border-brand-500"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add
            </Button>
          </div>
          {errors.features && <p className="text-[11px] text-red-400">{errors.features}</p>}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-dark-900 border border-dark-800 text-xs text-dark-200"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-dark-400 hover:text-red-400 p-1 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Order & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-950/40 p-4 rounded-2xl border border-dark-800/80">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Display Order Number</label>
            <input
              type="number"
              min={1}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded bg-dark-950 border-dark-700 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-white">Active & Publicly Visible</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {initialData ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
