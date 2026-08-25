import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

    const variants = {
      primary: 'bg-gradient-to-r from-[#B88728] via-[#C69A33] to-[#A2731C] text-white hover:from-[#C69A33] hover:to-[#B08022] font-semibold shadow-md shadow-[#B88728]/25 hover:shadow-lg hover:shadow-[#B88728]/40 border border-[#D4AF37]/30 hover:scale-[1.01]',
      secondary: 'bg-[#F5EFEB] text-[#3D3128] hover:bg-[#ECE2D8] border border-[#E0D4C5] font-medium shadow-sm',
      outline: 'border border-[#C59B27]/60 bg-white/80 text-[#3D3028] hover:bg-[#FAF6F0] hover:border-[#B8860B] font-medium shadow-sm hover:scale-[1.01]',
      ghost: 'text-[#5A4E45] hover:bg-[#F5EFEB] hover:text-[#2D231E]',
      danger: 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/20',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-7 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
