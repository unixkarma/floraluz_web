'use client'

export default function AnalogOverlay() {
  return (
    <>
      {/* CRT vignette - darkened edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Warm color temperature overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[99] mix-blend-multiply"
        style={{
          background: 'linear-gradient(180deg, rgba(45, 35, 25, 0.15) 0%, rgba(30, 25, 20, 0.1) 100%)',
        }}
      />

      {/* CRT horizontal line that drifts down */}
      <div
        className="fixed left-0 right-0 h-px pointer-events-none z-[101] opacity-[0.07]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          animation: 'crtLine 8s linear infinite',
        }}
      />

      {/* VHS tracking noise - occasional horizontal glitch bars */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-[101]"
        style={{
          height: '3px',
          background: 'rgba(255,255,255,0.03)',
          animation: 'trackingNoise 12s infinite',
        }}
      />
    </>
  )
}
