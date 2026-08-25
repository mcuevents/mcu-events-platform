'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ServiceItem, ServiceCategory, AdminServiceFilters } from '@/types/cms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
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
  Check,
} from 'lucide-react';

interface ServicesTableProps {
  items: ServiceItem[];
  onAddNew: () => void;
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isActionLoading?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
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
};

const CATEGORY_LABELS: Record<ServiceCategory, { label: string; color: 'blue' | 'gold' | 'green' | 'amber' }> = {
  event_management: { label: 'Event Execution', color: 'blue' },
  digital_marketing: { label: 'Digital Ads & Funnels', color: 'green' },
  social_media: { label: 'Social Media & Reels', color: 'amber' },
  branding: { label: 'Branding & Sponsorships', color: 'gold' },
};

export const ServicesTable: React.FC<ServicesTableProps> = ({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus === 'active' && !item.isActive) return false;
      if (selectedStatus === 'inactive' && item.isActive) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.shortDescription.toLowerCase().includes(q);
        const matchFeat = item.features?.some((f) => f.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchFeat) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedStatus, searchTerm]);

  return (
    <div className="space-y-4">
      {/* 1. Filters and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900/60 p-4 rounded-2xl border border-dark-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search service packages or features..."
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
            className="bg-dark-950/80 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Service Verticals</option>
            <option value="event_management">Event Execution & Stalls</option>
            <option value="digital_marketing">Digital Ads & Leads</option>
            <option value="social_media">Social Media & Reels</option>
            <option value="branding">Branding & Sponsorships</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-950/80 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Status ({items.length})</option>
            <option value="active">Active Only ({items.filter((i) => i.isActive).length})</option>
            <option value="inactive">Inactive ({items.filter((i) => !i.isActive).length})</option>
          </select>
        </div>

        <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
          Add Service Package
        </Button>
      </div>

      {/* 2. Services List / Cards & Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-dark-900/40 rounded-2xl border border-dark-800/80 p-12 text-center">
          <Briefcase className="h-12 w-12 text-dark-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No services found</h3>
          <p className="text-xs text-dark-400 max-w-md mx-auto mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'No service packages match your filter criteria.'
              : 'Add your primary business offerings, turnkey event services, and advertising packages.'}
          </p>
          <Button variant="primary" size="sm" onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
            Create Service Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Briefcase;
            const catInfo = CATEGORY_LABELS[service.category] || { label: service.category, color: 'blue' };

            return (
              <div
                key={service.id}
                className={`bg-dark-900/70 border rounded-2xl p-5 space-y-4 transition-all duration-200 hover:border-dark-700 backdrop-blur-md flex flex-col justify-between ${
                  service.isActive ? 'border-dark-800' : 'border-red-900/30 opacity-75'
                }`}
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-dark-400 bg-dark-950 px-2 py-0.5 rounded border border-dark-800">
                            #{service.displayOrder}
                          </span>
                          <Badge variant={catInfo.color} size="sm">
                            {catInfo.label}
                          </Badge>
                        </div>
                        <h3 className="text-white font-bold text-base mt-1 line-clamp-1">{service.title}</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleActive(service.id, !service.isActive)}
                      disabled={isActionLoading}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors shrink-0 ${
                        service.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-dark-300 text-xs line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Feature Bullets Preview */}
                  {service.features && service.features.length > 0 && (
                    <div className="bg-dark-950/60 p-3 rounded-xl border border-dark-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block">
                        Included Deliverables ({service.features.length})
                      </span>
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-dark-200">
                            <Check className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-[10px] text-dark-400 pl-5">
                            +{service.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-800 text-xs">
                  <span className="text-dark-400 font-mono text-[11px]">/services#{service.slug}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(service)}
                      leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => onDelete(service.id)}
                      className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete service package"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
