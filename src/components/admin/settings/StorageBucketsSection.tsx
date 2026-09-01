'use client';

import React, { useEffect, useState } from 'react';
import { getStorageBucketsStatus } from '@/services/adminSettings.service';
import { Database, HardDrive, CheckCircle2, Lock, Unlock, RefreshCw } from 'lucide-react';

interface BucketInfo {
  name: string;
  isPublic: boolean;
  fileCount: number;
  sizeFormatted: string;
  status: 'healthy' | 'warning';
}

export const StorageBucketsSection: React.FC = () => {
  const [buckets, setBuckets] = useState<BucketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBuckets = async () => {
    setIsLoading(true);
    const data = await getStorageBucketsStatus();
    setBuckets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBuckets();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-brand-400" />
            Supabase Storage Buckets & Media Asset Health
          </h3>
          <p className="text-xs text-dark-400">
            Monitor real-time object storage buckets for photos, banners, logos, and invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBuckets}
          className="flex items-center gap-1.5 text-xs text-dark-300 hover:text-white px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-800"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buckets.map((b) => (
          <div
            key={b.name}
            className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 space-y-3 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-brand-400" />
                <span className="font-mono text-xs font-bold text-white">{b.name}</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3 w-3" /> Healthy
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-800/60 text-xs">
              <div>
                <span className="text-[10px] text-dark-400 block">Objects Count</span>
                <span className="font-bold text-white">{b.fileCount} files</span>
              </div>
              <div>
                <span className="text-[10px] text-dark-400 block">Storage Used</span>
                <span className="font-bold text-white">{b.sizeFormatted}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-dark-400">
              <span className="flex items-center gap-1">
                {b.isPublic ? <Unlock className="h-3 w-3 text-brand-400" /> : <Lock className="h-3 w-3 text-amber-400" />}
                {b.isPublic ? 'Public Read' : 'Authenticated Only'}
              </span>
              <span className="text-[10px] text-dark-500">CDN Enabled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
