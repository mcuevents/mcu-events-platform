import { useState, type MouseEvent } from 'react'

/**
 * Layered photo collage with a real 3D tilt: mouse position drives rotateX/
 * rotateY on a `perspective`-transformed wrapper, and each photo sits at its
 * own translateZ depth so they separate visually as the whole group tilts.
 * Pure CSS transforms — no WebGL, so it's safe under SSR/prerender.
 */
export function HeroVisual() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -14, y: px * 16 })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      className="relative mx-auto h-[340px] w-full max-w-3xl [perspective:1400px] sm:h-[420px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative size-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div
          className="absolute inset-x-[6%] top-[6%] h-[75%] overflow-hidden rounded-2xl border border-border bg-cover bg-center shadow-lg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80')", transform: 'translateZ(20px)' }}
        />
        <div
          className="absolute bottom-[4%] left-0 h-[46%] w-[42%] overflow-hidden rounded-2xl border-4 border-background bg-cover bg-center shadow-xl"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80')", transform: 'translateZ(70px) rotate(-3deg)' }}
        />
        <div
          className="absolute right-[2%] top-0 h-[40%] w-[38%] overflow-hidden rounded-2xl border-4 border-background bg-cover bg-center shadow-xl"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80')", transform: 'translateZ(90px) rotate(4deg)' }}
        />
        <div
          className="absolute bottom-[10%] right-[4%] rounded-xl bg-primary px-5 py-4 text-primary-foreground shadow-xl"
          style={{ transform: 'translateZ(120px)' }}
        >
          <p className="font-serif text-3xl font-bold leading-none">15+</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/70">years bringing<br />businesses together</p>
        </div>
      </div>
    </div>
  )
}
