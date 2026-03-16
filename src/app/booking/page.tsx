'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Booking() {
  const glyphPool = '0123456789!@#$%&*[]{}|<>?/\\ΩΨΦΣΠΛΘΔαβγδ∞∑√∫≠←→↑↓◊∆∇◈∴'

  const scramble = (text: string) =>
    text.split('').map(char =>
      char === ' ' || char === ',' ? char :
      Math.random() < 0.04
        ? glyphPool[Math.floor(Math.random() * glyphPool.length)]
        : char
    ).join('')

  const [headerText, setHeaderText] = useState('BOOKING')

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderText(scramble('BOOKING'))
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
          className="text-2xl sm:text-3xl md:text-6xl text-white font-bold mb-4 tracking-widest inline-block"
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
          DJ SETS & LIVE ELECTRONICS
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16 space-y-16">

        {/* Contact */}
        <div className="border border-gray-800 p-5 md:p-10 rounded">
          <div className="text-lg text-gray-400 mb-8 tracking-widest font-bold text-center">
            CONTACTO • CONTACT
          </div>
          <div className="space-y-4 text-sm text-center">
            <div>
              <span className="text-gray-500 tracking-wider">EMAIL</span>
              <div className="text-white mt-1">floraluz333@gmail.com</div>
            </div>
            <div>
              <span className="text-gray-500 tracking-wider">UBICACIÓN • LOCATION</span>
              <div className="text-white mt-1">Quito, Ecuador</div>
            </div>
            <div>
              <span className="text-gray-500 tracking-wider">DISPONIBILIDAD • AVAILABILITY</span>
              <div className="text-white mt-1">Disponible para shows en Quito y alrededores</div>
              <div className="text-gray-500 text-xs mt-1">Available for shows in Quito and surrounding areas</div>
            </div>
          </div>
        </div>

        {/* Technical Rider */}
        <div className="border border-gray-800 p-5 md:p-10 rounded">
          <div className="text-lg text-gray-400 mb-8 tracking-widest font-bold text-center">
            RIDER TÉCNICO • TECHNICAL RIDER
          </div>

          <div className="space-y-8">
            {/* What floraluz provides */}
            <div>
              <div className="text-xs text-gray-500 tracking-widest mb-4">
                [ ARTISTA PROVEE • ARTIST PROVIDES ]
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Laptop</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Novation Launchpad</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Novation Launch Control</span>
                </li>
              </ul>
            </div>

            {/* What venue provides */}
            <div>
              <div className="text-xs text-gray-500 tracking-widest mb-4">
                [ VENUE PROVEE • VENUE PROVIDES ]
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Sistema de sonido PA con subwoofer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Mixer con al menos 1 canal estéreo libre</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Monitor de escenario</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Mesa estable para equipo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 mt-0.5">›</span>
                  <span>Toma de corriente cercana (110V)</span>
                </li>
              </ul>
            </div>

            {/* Connection */}
            <div>
              <div className="text-xs text-gray-500 tracking-widest mb-4">
                [ CONEXIÓN • CONNECTION ]
              </div>
              <div className="text-sm text-gray-300 leading-relaxed">
                Salida estéreo (2x 1/4&quot; TRS o 2x XLR) desde interfaz de audio directo al mixer del venue.
              </div>
            </div>
          </div>
        </div>

        {/* Set Info */}
        <div className="border border-gray-800 p-5 md:p-10 rounded">
          <div className="text-lg text-gray-400 mb-8 tracking-widest font-bold text-center">
            FORMATO • SET FORMAT
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="border border-gray-800/50 p-5 rounded text-center">
              <div className="text-white font-bold tracking-wider mb-2">DJ SET</div>
              <div className="text-gray-500 text-xs tracking-wider mb-3">30 min — 2 hrs</div>
              <div className="text-gray-400 text-xs leading-relaxed">
                Electrónica, ambient, downtempo, experimental
              </div>
            </div>
            <div className="border border-gray-800/50 p-5 rounded text-center">
              <div className="text-white font-bold tracking-wider mb-2">OPENING SET</div>
              <div className="text-gray-500 text-xs tracking-wider mb-3">30 min — 1 hr</div>
              <div className="text-gray-400 text-xs leading-relaxed">
                Sets de apertura adaptados al headliner
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="text-center space-x-4 text-xs">
          <Link href="/sets" className="text-gray-500 hover:text-gray-300 tracking-widest transition-colors">
            [ SETS ]
          </Link>
          <Link href="/epk" className="text-gray-500 hover:text-gray-300 tracking-widest transition-colors">
            [ EPK ]
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-12">
        <div className="text-[9px] text-gray-600 tracking-wider opacity-40">
          [ floraluz :: booking ]
        </div>
      </div>
    </main>
  )
}
