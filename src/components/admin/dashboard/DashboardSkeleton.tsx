import React from 'react';
import { Card } from '@/components/ui/Card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-3xl bg-dark-900 border border-dark-800 p-6 sm:p-8 h-40 flex flex-col justify-center space-y-3">
        <div className="h-5 w-40 bg-dark-800 rounded-full" />
        <div className="h-8 w-72 bg-dark-800 rounded-lg" />
        <div className="h-4 w-96 bg-dark-800/60 rounded-md" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="flex gap-3 overflow-hidden pb-1">
        <div className="h-8 w-24 bg-dark-900 rounded-xl" />
        <div className="h-8 w-36 bg-dark-900 rounded-xl" />
        <div className="h-8 w-36 bg-dark-900 rounded-xl" />
        <div className="h-8 w-36 bg-dark-900 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <Card key={idx} className="p-5 border-dark-800 bg-dark-900/60 h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-8 w-8 bg-dark-800 rounded-xl" />
              <div className="h-4 w-12 bg-dark-800 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-dark-800 rounded" />
              <div className="h-6 w-14 bg-dark-800 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-dark-800 bg-dark-900/60 h-80 space-y-4">
          <div className="h-6 w-48 bg-dark-800 rounded" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-dark-950 rounded-2xl" />
            ))}
          </div>
        </Card>

        <Card className="p-6 border-dark-800 bg-dark-900/60 h-80 space-y-4">
          <div className="h-6 w-48 bg-dark-800 rounded" />
          <div className="h-52 bg-dark-950 rounded-2xl" />
        </Card>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-dark-800 bg-dark-900/60 h-72 space-y-4">
          <div className="h-6 w-48 bg-dark-800 rounded" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-dark-950 rounded-xl" />
            ))}
          </div>
        </Card>

        <Card className="p-6 border-dark-800 bg-dark-900/60 h-72 space-y-4">
          <div className="h-6 w-48 bg-dark-800 rounded" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-dark-950 rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
