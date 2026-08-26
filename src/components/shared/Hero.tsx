import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button, ButtonProps } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface HeroAction {
  label: string;
  href: string;
  variant?: ButtonProps['variant'];
  icon?: React.ReactNode;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: HeroAction;
  secondaryCta?: HeroAction;
  bgImage?: string;
  stats?: HeroStat[];
  align?: 'left' | 'center';
  className?: string;
  foundedBadge?: string;
}

export const Hero: React.FC<HeroProps> = ({
  eyebrow = 'EVENTS / DIGITAL ENGAGEMENT / BRAND GROWTH',
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  bgImage,
  stats,
  align = 'center',
  className,
  foundedBadge,
}) => {
  return (
    <section className={cn('relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F0E7] to-[#FAF8F5] py-16 sm:py-24 border-b border-[#EAE0D5]', className)}>
      {/* Background Soft Glow Overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-multiply"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C59B3F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className={cn('flex flex-col max-w-4xl', align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start')}>
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] mb-5">
              <span>{eyebrow}</span>
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#2D231E] leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 text-base sm:text-lg text-[#665A52] font-normal leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className={cn('mt-8 flex flex-wrap gap-4 items-center', align === 'center' && 'justify-center')}>
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button
                    variant={primaryCta.variant || 'primary'}
                    size="lg"
                    rightIcon={primaryCta.icon}
                  >
                    {primaryCta.label}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button
                    variant={secondaryCta.variant || 'outline'}
                    size="lg"
                    rightIcon={secondaryCta.icon}
                  >
                    {secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {foundedBadge && (
            <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium text-[#7A6D62]">
              <span>{foundedBadge}</span>
            </div>
          )}

          {/* Key Metric Bar */}
          {stats && stats.length > 0 && (
            <div className="mt-12 w-full pt-8 border-t border-[#EAE0D5] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#B8860B] tracking-tight">{stat.value}</div>
                  <div className="text-xs text-[#7A6D62] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
