import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, placeholder, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-[#5A4E45]"
          >
            {label}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-[#E0D5C7] bg-white px-4 py-2 text-sm text-[#2D231E] transition-colors focus-visible:border-[#B8860B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8860B] shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-[#9C8F85]">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#2D231E]">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#7A6D62]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';
