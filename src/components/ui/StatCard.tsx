import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card hoverEffect className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-dark-400">
          {title}
        </CardTitle>
        {icon && <div className="text-brand-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trend.isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            )}
            <span className={trend.isPositive ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
              {trend.value}
            </span>
            <span className="text-dark-400">vs last month</span>
          </div>
        )}
        {description && !trend && (
          <p className="mt-1 text-xs text-dark-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
