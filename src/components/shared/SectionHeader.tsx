import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
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
      {badge && (
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#D4AF37]/50" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8860B] font-mono">
            {badge}
          </span>
          <div className="h-px w-8 bg-[#D4AF37]/50" />
        </div>
      )}
      <h2 className="font-serif text-2xl sm:text-4xl font-normal sm:font-medium text-[#2D231E] tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#6E6258] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
