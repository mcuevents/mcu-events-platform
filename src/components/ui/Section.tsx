import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  spacing = 'md',
  ...props
}) => {
  const spacings = {
    none: 'py-0',
    sm: 'py-6 md:py-10',
    md: 'py-12 md:py-20',
    lg: 'py-16 md:py-28',
  };

  return (
    <section className={cn(spacings[spacing], className)} {...props}>
      {children}
    </section>
  );
};
