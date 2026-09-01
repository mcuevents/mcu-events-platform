import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ArrowLeft, Sparkles, Shield, Clock } from 'lucide-react';

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  moduleKey: string;
  features?: string[];
  icon?: React.ReactNode;
}

export function AdminPlaceholderPage({
  title,
  description,
  moduleKey,
  features,
  icon,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">{title}</h1>
            <Badge variant="gold">Phase 6+ Architecture Ready</Badge>
          </div>
          <p className="text-xs sm:text-sm text-dark-300">{description}</p>
        </div>

        <Link href="/admin">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Module Overview Card */}
      <Card className="p-6 sm:p-8 border-dark-800 bg-dark-900/60 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            {icon || <Clock className="h-7 w-7" />}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Protected Admin Module: {title}</h3>
            <p className="text-xs sm:text-sm text-dark-300 leading-relaxed max-w-3xl">
              This module route is authenticated and authorized under the MCU Creations Phase 6.1 security foundation. Full CRUD management operations, inline data tables, and batch actions will be implemented in subsequent phases.
            </p>
          </div>
        </div>

        {features && features.length > 0 && (
          <div className="pt-4 border-t border-dark-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-400 block">
              Planned Capabilities for this Module:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-dark-950/70 border border-dark-800 text-xs text-dark-200"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
