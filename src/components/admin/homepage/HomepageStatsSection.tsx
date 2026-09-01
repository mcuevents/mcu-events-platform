'use client';

import React from 'react';
import { StatCounterItem } from '@/types/settings';
import { Input } from '@/components/ui';
import { TrendingUp, Users, Store, Award, Plus, Trash2 } from 'lucide-react';

interface HomepageStatsSectionProps {
  stats: StatCounterItem[];
  onChange: (updated: StatCounterItem[]) => void;
}

const STAT_ICONS: Record<string, React.ElementType> = {
  Users,
  TrendingUp,
  Store,
  Award,
};

export const HomepageStatsSection: React.FC<HomepageStatsSectionProps> = ({ stats, onChange }) => {
  const handleUpdateStat = (id: string, field: keyof StatCounterItem, value: any) => {
    const next = stats.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    onChange(next);
  };

  const handleAddStat = () => {
    const newStat: StatCounterItem = {
      id: `st-${Date.now()}`,
      label: 'New Statistic',
      value: '100+',
      suffix: 'Units',
      iconName: 'Award',
      displayOrder: stats.length + 1,
    };
    onChange([...stats, newStat]);
  };

  const handleRemoveStat = (id: string) => {
    onChange(stats.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Live Stats Preview Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-brand-400">
            <TrendingUp className="h-4 w-4" /> Live Key Metrics Bar Preview
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-dark-950/80 p-4 rounded-2xl border border-dark-800">
          {stats.map((item) => {
            const IconComp = STAT_ICONS[item.iconName || 'Award'] || Award;
            return (
              <div key={item.id} className="p-3 bg-dark-900/60 rounded-xl border border-dark-800/80 text-center space-y-1">
                <div className="inline-flex p-1.5 rounded-lg bg-brand-500/10 text-brand-400 mb-0.5">
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="text-lg font-black text-white">{item.value}</div>
                <div className="text-[11px] text-dark-300 font-medium">{item.label}</div>
                {item.suffix && <div className="text-[10px] text-dark-500">{item.suffix}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Edit Form Grid */}
      <div className="bg-dark-900/60 p-5 rounded-2xl border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-400" />
            Editable Numeric Highlights ({stats.length})
          </h3>
          <button
            type="button"
            onClick={handleAddStat}
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-bold"
          >
            <Plus className="h-3.5 w-3.5" /> Add Counter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="p-4 bg-dark-950/60 rounded-xl border border-dark-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-dark-400">Metric #{idx + 1}</span>
                {stats.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(stat.id)}
                    className="text-dark-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Display Value *"
                  placeholder="e.g. 50K+ or ₹120Cr+"
                  value={stat.value}
                  onChange={(e) => handleUpdateStat(stat.id, 'value', e.target.value)}
                />
                <Input
                  label="Label Title *"
                  placeholder="e.g. Verified Footfall"
                  value={stat.label}
                  onChange={(e) => handleUpdateStat(stat.id, 'label', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Suffix Unit"
                  placeholder="e.g. Delegates or Brands"
                  value={stat.suffix || ''}
                  onChange={(e) => handleUpdateStat(stat.id, 'suffix', e.target.value)}
                />
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Icon Style</label>
                  <select
                    value={stat.iconName || 'Award'}
                    onChange={(e) => handleUpdateStat(stat.id, 'iconName', e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Users">Users / Footfall</option>
                    <option value="TrendingUp">Trending / LOIs</option>
                    <option value="Store">Store / Exhibitors</option>
                    <option value="Award">Award / Summits</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
