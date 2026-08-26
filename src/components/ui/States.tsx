import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './button';

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading content...',
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
    <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    <p className="mt-3 text-sm font-medium text-dark-300">{label}</p>
  </div>
);

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  icon,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-800 bg-dark-900/40 p-8 text-center', className)}>
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-800 text-dark-400">
      {icon || <Inbox className="h-6 w-6 text-brand-400" />}
    </div>
    <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
    <p className="mt-1 text-sm text-dark-400 max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" size="sm" onClick={onAction} className="mt-5">
        {actionLabel}
      </Button>
    )}
  </div>
);

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this data. Please try again.',
  onRetry,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center rounded-xl border border-red-900/30 bg-red-950/10 p-8 text-center', className)}>
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 text-red-400">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
    <p className="mt-1 text-sm text-dark-400 max-w-sm">{description}</p>
    {onRetry && (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        className="mt-5 border-red-500/40 text-red-400 hover:bg-red-500/10"
      >
        Try Again
      </Button>
    )}
  </div>
);
