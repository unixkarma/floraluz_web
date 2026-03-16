'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const sets = [
  {
    title: 'para el jueves I',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2278403192&color=%2304bcbc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    title: 'mix para el miércoles I',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2278399775&color=%23dfb8ac&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    title: 'para el sábado I',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2279361551&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
]

export default function Sets() {
  const glyphPool = '0123456789!@#$%&*[]{}|<>?/\\ΩΨΦΣΠΛΘΔαβγδ∞∑√∫≠←→↑↓◊∆∇◈∴'

  const scramble = (text: string) =>
    text.split('').map(char =>
      char === ' ' || char === ',' ? char :
      Math.random() < 0.04
        ? glyphPool[Math.floor(Math.random() * glyphPool.length)]
        : char
    ).join('')

  const [headerText, setHeaderText] = useState('SETS')

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderText(scramble('SETS'))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-black text-gray-300 font-mono overflow-x-hidden">
      {/* Header */}
      <div className="text-center py-16 px-5 border-b border-gray-800 bg-black relative">
        <Link
          href="/"
          className="text-xs text-gray-600 tracking-widest hover:text-gray-400 transition-colors absolute top-6 left-6"
        >
          ← floraluz
        </Link>

        <div
          className="text-3xl md:text-6xl text-white font-bold mb-4 tracking-widest inline-block"
          style={{
            fontFamily: 'Courier New, monospace',
            transform: 'scaleX(1.2)',
            transformOrigin: 'center',
            letterSpacing: '0.3em',
          }}
        >
          {headerText}
        </div>

        <div className="text-sm text-gray-400 font-mono tracking-wider mt-3 opacity-70">
          MIXES & DJ SETS
        </div>
      </div>

      {/* Sets List */}
      <div className="max-w-4xl mx-auto px-5 py-16 space-y-12">
        {sets.map((set, i) => (
          <div
            key={i}
            className="border border-gray-800 bg-gray-900/10 rounded overflow-hidden"
          >
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <div className="text-sm text-white tracking-wider font-bold">
                {set.title}
              </div>
              <div className="text-[10px] text-gray-600 tracking-widest">
                [ {String(i + 1).padStart(2, '0')} ]
              </div>
            </div>
            <div className="px-5 pb-5">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={set.embedUrl}
                className="rounded opacity-90 hover:opacity-100 transition-opacity"
                style={{
                  filter: 'saturate(0.7) contrast(1.1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-12">
        <div className="text-[9px] text-gray-600 tracking-wider opacity-40">
          [ floraluz :: sets ]
        </div>
      </div>
    </main>
  )
}
