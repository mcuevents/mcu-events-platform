'use client';

import React, { useRef, useEffect } from 'react';

interface HeroParallaxContainerProps {
  children: React.ReactNode;
}

/**
 * HeroParallaxContainer
 * Subtly tracks mouse coordinates across the Hero section.
 * Moves decorative abstract gold geometry, radial halos, and accent lines by 3–6px.
 * Keeps typography and heading content completely stable.
 * Uses requestAnimationFrame with smooth lerp easing for silky 60fps luxury depth.
 */
export const HeroParallaxContainer: React.FC<HeroParallaxContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const auraLayerRef = useRef<HTMLDivElement | null>(null);
  const geometryLayerRef = useRef<HTMLDivElement | null>(null);
  const ringLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isTouchOrCoarse = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchOrCoarse || prefersReducedMotion) {
      return;
    }

    const container = containerRef.current;
    const aura = auraLayerRef.current;
    const geometry = geometryLayerRef.current;
    const ring = ringLayerRef.current;

    if (!container) return;

    let targetX = 0;
    let targetY = 0;
    let currentAuraX = 0;
    let currentAuraY = 0;
    let currentGeomX = 0;
    let currentGeomY = 0;
    let currentRingX = 0;
    let currentRingY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = relativeX * 2; // -1 to 1
      targetY = relativeY * 2;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    const renderLoop = () => {
      // Layer 1: Aura (moves inverse -4px)
      const auraDestX = targetX * -5;
      const auraDestY = targetY * -5;
      currentAuraX += (auraDestX - currentAuraX) * 0.08;
      currentAuraY += (auraDestY - currentAuraY) * 0.08;
      if (aura) {
        aura.style.transform = `translate3d(${currentAuraX.toFixed(2)}px, ${currentAuraY.toFixed(
          2
        )}px, 0)`;
      }

      // Layer 2: Geometry (moves +6px)
      const geomDestX = targetX * 7;
      const geomDestY = targetY * 7;
      currentGeomX += (geomDestX - currentGeomX) * 0.08;
      currentGeomY += (geomDestY - currentGeomY) * 0.08;
      if (geometry) {
        geometry.style.transform = `translate3d(${currentGeomX.toFixed(2)}px, ${currentGeomY.toFixed(
          2
        )}px, 0)`;
      }

      // Layer 3: Ring (moves +3.5px)
      const ringDestX = targetX * 4;
      const ringDestY = targetY * 4;
      currentRingX += (ringDestX - currentRingX) * 0.08;
      currentRingY += (ringDestY - currentRingY) * 0.08;
      if (ring) {
        ring.style.transform = `translate3d(${currentRingX.toFixed(2)}px, ${currentRingY.toFixed(
          2
        )}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Decorative Parallax Background Layer 1: Soft Champagne Halo */}
      <div
        ref={auraLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#D4B06A]/10 to-transparent blur-3xl will-change-transform"
      />

      {/* Decorative Parallax Background Layer 2: Gold Geometric Accent Ring */}
      <div
        ref={geometryLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 right-12 h-80 w-80 rounded-full border border-[#D4B06A]/20 opacity-60 will-change-transform"
      />

      {/* Decorative Parallax Background Layer 3: Subtle Concentric Geometric Arc */}
      <div
        ref={ringLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-12 h-64 w-64 rounded-full border border-[#B88932]/15 opacity-40 will-change-transform"
      />

      {/* Main Foreground Content (Remains Stable) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
