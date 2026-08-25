import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-xs text-dark-400', className)}>
      <Link href="/" className="flex items-center gap-1 hover:text-brand-400 transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 text-dark-600 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-white truncate max-w-[200px]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
