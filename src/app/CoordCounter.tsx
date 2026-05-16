'use client'

import { useState, useEffect } from 'react'

export default function CoordCounter() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return (
    <div className="fixed bottom-8 right-8 text-gray-700 text-xs tracking-widest pointer-events-none z-50 select-none">
      {String(coords.x).padStart(4, '0')}&nbsp;·&nbsp;{String(coords.y).padStart(4, '0')}
    </div>
  )
}
