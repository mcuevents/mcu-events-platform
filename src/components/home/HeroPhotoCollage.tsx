'use client';

import { useState, type MouseEvent } from 'react';

export function HeroPhotoCollage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: y * -8, y: x * 10 });
  }

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md [perspective:1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="relative size-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div
          className="absolute inset-x-5 top-0 h-[78%] overflow-hidden rounded-[2rem] border-8 border-white bg-cover bg-center shadow-[0_24px_50px_rgba(43,33,24,0.18)] sm:inset-x-8"
          style={{ backgroundImage: "url('/images/hero-stage.jpg')", transform: 'translateZ(20px)' }}
        />
        <div
          className="absolute bottom-0 left-0 h-[42%] w-[52%] overflow-hidden rounded-[1.5rem] border-8 border-[#FCFBF8] bg-cover bg-[center_bottom] shadow-[0_18px_36px_rgba(43,33,24,0.18)]"
          style={{ backgroundImage: "url('/images/hero-stage.jpg')", transform: 'translateZ(60px) rotate(-4deg)' }}
        />
        <div
          className="absolute bottom-8 right-0 rounded-2xl bg-[#2B2118] px-5 py-4 text-[#FCFBF8] shadow-xl"
          style={{ transform: 'translateZ(90px)' }}
        >
          <p className="font-serif text-3xl leading-none text-[#D4B06A]">MCU</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">Events with purpose</p>
        </div>
      </div>
    </div>
  );
}