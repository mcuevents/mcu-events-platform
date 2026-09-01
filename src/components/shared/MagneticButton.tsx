'use client';

import React, { useRef, useEffect } from 'react';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxDistance?: number;
  as?: 'button' | 'div' | 'span';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * MagneticButton
 * Subtle, restrained magnetic pull on hover (3–5px maximum displacement).
 * Moves button subtly toward pointer, with inner child parallax.
 * Returns smoothly on pointer leave with spring bezier curve.
 * Zero layout shifts, runs using direct DOM transforms.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.22,
  maxDistance = 5,
  as: Component = 'div',
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Check device capability and user motion preference
    const isTouchOrCoarse = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchOrCoarse || prefersReducedMotion) {
      return;
    }

    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (disabled) return;
      isHovered = true;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawDeltaX = (e.clientX - centerX) * strength;
      const rawDeltaY = (e.clientY - centerY) * strength;

      // Restrain movement to maxDistance (3–6px)
      const moveX = Math.max(-maxDistance, Math.min(maxDistance, rawDeltaX));
      const moveY = Math.max(-maxDistance, Math.min(maxDistance, rawDeltaY));

      container.style.transition = 'transform 0.08s ease-out';
      container.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;

      content.style.transition = 'transform 0.08s ease-out';
      content.style.transform = `translate3d(${moveX * 0.35}px, ${moveY * 0.35}px, 0)`;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      container.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      container.style.transform = 'translate3d(0, 0, 0)';

      content.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      content.style.transform = 'translate3d(0, 0, 0)';
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, maxDistance, disabled]);

  const props: Record<string, any> = {
    ref: containerRef,
    className: `inline-block ${className}`,
    'data-magnetic': 'true',
    'data-cursor': 'button',
    onClick,
    ...rest,
  };

  if (Component === 'button') {
    props.type = type;
    props.disabled = disabled;
  }

  return React.createElement(
    Component,
    props,
    <span
      ref={contentRef}
      className="inline-flex items-center justify-center gap-2 will-change-transform pointer-events-none"
    >
      {children}
    </span>
  );
};
