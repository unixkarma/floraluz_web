'use client'

import { useState, useEffect } from 'react'

export default function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed bottom-4 right-4 z-50 text-[10px] text-gray-600 tracking-widest pointer-events-none select-none"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      <span className="relative">
        X:{String(pos.x).padStart(4, '0')} Y:{String(pos.y).padStart(4, '0')}
        <span
          className="absolute inset-0 text-red-900/20 translate-x-px"
          style={{ animation: 'glitch1 3s infinite' }}
        >
          X:{String(pos.x).padStart(4, '0')} Y:{String(pos.y).padStart(4, '0')}
        </span>
      </span>
    </div>
  )
}
