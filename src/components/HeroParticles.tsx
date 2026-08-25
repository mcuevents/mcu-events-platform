/**
 * Faint drifting dot field for the dark hero backdrop. Positions/timings are
 * a fixed table (not Math.random()) so server and client render identical
 * markup — randomizing at render time would desync hydration.
 */
const PARTICLES = [
  { left: '6%', top: '18%', size: 3, opacity: 0.5, duration: 7 },
  { left: '14%', top: '62%', size: 2, opacity: 0.35, duration: 9 },
  { left: '22%', top: '32%', size: 2.5, opacity: 0.45, duration: 6.5 },
  { left: '30%', top: '78%', size: 2, opacity: 0.3, duration: 8 },
  { left: '38%', top: '12%', size: 3, opacity: 0.4, duration: 10 },
  { left: '46%', top: '52%', size: 2, opacity: 0.35, duration: 7.5 },
  { left: '54%', top: '24%', size: 2.5, opacity: 0.5, duration: 6 },
  { left: '62%', top: '70%', size: 2, opacity: 0.3, duration: 9.5 },
  { left: '70%', top: '38%', size: 3, opacity: 0.45, duration: 8.5 },
  { left: '78%', top: '16%', size: 2, opacity: 0.35, duration: 7 },
  { left: '86%', top: '58%', size: 2.5, opacity: 0.4, duration: 6.5 },
  { left: '92%', top: '30%', size: 2, opacity: 0.3, duration: 9 },
  { left: '10%', top: '86%', size: 2, opacity: 0.35, duration: 8 },
  { left: '50%', top: '90%', size: 2.5, opacity: 0.3, duration: 7.5 },
  { left: '66%', top: '8%', size: 2, opacity: 0.4, duration: 6 },
  { left: '82%', top: '82%', size: 2, opacity: 0.35, duration: 10 },
] as const

export function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${(i % 5) * 0.6}s`,
            '--particle-opacity': p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
