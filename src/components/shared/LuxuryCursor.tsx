'use client';

import React, { useEffect, useRef } from 'react';

/**
 * LuxuryCursor
 * Sophisticated, restrained luxury pointer interaction system.
 * Normal browser cursor remains usable.
 * Creates a subtle secondary visual follower with smooth linear interpolation (lerp).
 * Zero React re-renders during mouse movement (direct DOM ref & RAF updates).
 * Completely disabled on touch/mobile devices and when prefers-reduced-motion is active.
 */
export const LuxuryCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Accessibility & Device Compatibility Checks
    const isTouchOrCoarse = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchOrCoarse || prefersReducedMotion) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // 2. Mutable coordinate states (no React state updates)
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;

    let isVisible = false;
    let isClicking = false;
    let cursorState: 'default' | 'button' | 'link' | 'card' = 'default';
    let animationFrameId: number;

    // Dimensions
    const SIZES = {
      default: 26,
      button: 44,
      link: 32,
      card: 38,
      clicking: 20,
    };

    let currentSize = SIZES.default;
    let targetSize = SIZES.default;

    // 3. Mouse Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ring.style.opacity = '1';
        dot.style.opacity = '0.75';
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
    };

    const handleMouseUp = () => {
      isClicking = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      ring.style.opacity = '1';
      dot.style.opacity = '0.75';
    };

    // 4. Hover State Event Delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [data-magnetic], [data-cursor], .luxury-card, input, textarea, select'
      ) as HTMLElement | null;

      if (!interactive) {
        cursorState = 'default';
        return;
      }

      if (
        interactive.tagName === 'BUTTON' ||
        interactive.classList.contains('btn-luxury-primary') ||
        interactive.classList.contains('btn-luxury-secondary') ||
        interactive.classList.contains('gold-gradient-btn') ||
        interactive.getAttribute('data-cursor') === 'button'
      ) {
        cursorState = 'button';
      } else if (interactive.classList.contains('luxury-card')) {
        cursorState = 'card';
      } else if (interactive.tagName === 'A' || interactive.getAttribute('data-cursor') === 'link') {
        cursorState = 'link';
      } else {
        cursorState = 'default';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const related = e.relatedTarget as HTMLElement | null;
      if (
        !related ||
        !related.closest('button, a, [data-magnetic], [data-cursor], .luxury-card, input, textarea, select')
      ) {
        cursorState = 'default';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // 5. High-Performance RAF Lerp Loop
    const renderLoop = () => {
      // Determine target ring size based on hover/click state
      if (isClicking) {
        targetSize = SIZES.clicking;
      } else if (cursorState === 'button') {
        targetSize = SIZES.button;
      } else if (cursorState === 'card') {
        targetSize = SIZES.card;
      } else if (cursorState === 'link') {
        targetSize = SIZES.link;
      } else {
        targetSize = SIZES.default;
      }

      // Smoothly interpolate size
      currentSize += (targetSize - currentSize) * 0.18;

      // Smoothly interpolate coordinates (Lerp)
      // Dot follows closely (responsive feel)
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      // Outer ring follows with fluid inertia (expensive luxury lag)
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      // Apply transforms
      dot.style.transform = `translate3d(${dotX - 2.5}px, ${dotY - 2.5}px, 0)`;
      ring.style.transform = `translate3d(${ringX - currentSize / 2}px, ${
        ringY - currentSize / 2
      }px, 0)`;
      ring.style.width = `${currentSize}px`;
      ring.style.height = `${currentSize}px`;

      // Update ring appearance based on state
      if (cursorState === 'button') {
        ring.style.borderColor = 'rgba(184, 137, 50, 0.7)';
        ring.style.backgroundColor = 'rgba(212, 176, 106, 0.08)';
      } else if (cursorState === 'link') {
        ring.style.borderColor = 'rgba(184, 137, 50, 0.55)';
        ring.style.backgroundColor = 'rgba(212, 176, 106, 0.04)';
      } else if (cursorState === 'card') {
        ring.style.borderColor = 'rgba(184, 137, 50, 0.4)';
        ring.style.backgroundColor = 'transparent';
      } else {
        ring.style.borderColor = 'rgba(184, 137, 50, 0.4)';
        ring.style.backgroundColor = 'transparent';
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Subtle Outer Follower Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-[#B88932]/40 opacity-0 transition-opacity duration-300 will-change-transform"
        style={{
          boxShadow: '0 0 10px rgba(184, 137, 50, 0.08)',
        }}
      />

      {/* Subtle Inner Micro-Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-[5px] w-[5px] rounded-full bg-[#B88932] opacity-0 transition-opacity duration-300 will-change-transform"
      />
    </>
  );
};
