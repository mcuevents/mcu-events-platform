import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'green' | 'gray' | 'red' | 'amber' | 'blue' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'gold',
  size = 'sm',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold tracking-wider uppercase rounded-full transition-colors font-mono';

  const variants = {
    gold: 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30 shadow-sm',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
    gray: 'bg-[#F5EFEB] text-[#7A6D62] border border-[#E0D4C5]',
    red: 'bg-red-50 text-red-600 border border-red-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    outline: 'border border-[#E0D5C7] text-[#665A52]',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
