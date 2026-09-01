import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  number?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mb-12', alignments[align], className)}>
      {(badge || number) && (
        <div className="inline-flex items-center gap-3 mb-3">
          {number && (
            <span className="font-mono text-xs font-semibold text-[#B88932] tracking-wider">
              {number}
            </span>
          )}
          {number && badge && (
            <span className="text-[#D4B06A]/60 text-xs">/</span>
          )}
          {badge && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88932]">
              {badge}
            </span>
          )}
          <div className="h-px w-8 bg-[#D4B06A]/60" />
        </div>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#3A2A1E] tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#75695C] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
