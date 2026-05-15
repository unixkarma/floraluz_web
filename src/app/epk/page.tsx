'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const TRACKS = [
  { title: '1. hasta mañana, te amo', file: '1.- hasta mañana, te amo.wav' },
  { title: '2. Bucles Abiertos', file: '2.- Bucles Abiertos.wav' },
  { title: '3. Untitled 7 (floraluz Remix)', file: '3.- Untitled 7 (floraluz Remix).wav' },
  { title: '4. Cerezo', file: '4.- Cerezo.wav' },
  { title: '5. MBP2012', file: '5.- macbookpro2012.wav' },
  { title: '6. si la noche tuviese más horas', file: '6.- si la noche tuviese más horas.wav' },
]

type PhotoMeta = { src: string; w: number; h: number; zoom: number }

export default function EPK() {
  const [lang, setLang] = useState<'ES' | 'EN'>('ES')
  const [lightbox, setLightbox] = useState<PhotoMeta | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightbox])

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-xs tracking-widest text-black/60 hover:text-black transition-colors"
      >
        ← floraluz
      </Link>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24 space-y-24">
        {/* Header */}
        <header className="space-y-4">
          <h1
            className="font-black tracking-tight lowercase leading-none select-none"
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: 'clamp(3rem, 12vw, 8rem)',
            }}
          >
            floraluz
          </h1>
          <div className="text-xs tracking-widest uppercase text-black/60">
            Último Lanzamiento: noches en vela, Vol. II · EP
          </div>
        </header>

        {/* Artist photos — editorial collage, click to open full size */}
        <section>
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            {/* B&W street — dominant, left */}
            <button
              type="button"
              onClick={() => setLightbox({ src: '/epk/DSC00359.jpg', w: 1340, h: 1786, zoom: 1 })}
              className="col-span-2 row-span-2 overflow-hidden cursor-zoom-in group"
              aria-label="ver foto en tamaño completo"
            >
              <Image
                src="/epk/DSC00359.jpg"
                alt="floraluz"
                width={1340}
                height={1786}
                className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
                priority
                draggable={false}
              />
            </button>

            {/* Color graffiti, top-right */}
            <button
              type="button"
              onClick={() => setLightbox({ src: '/epk/IMG_2517.jpg', w: 1350, h: 1800, zoom: 1.4 })}
              className="aspect-[3/4] overflow-hidden cursor-zoom-in group"
              aria-label="ver foto en tamaño completo"
            >
              <Image
                src="/epk/IMG_2517.jpg"
                alt="floraluz"
                width={1350}
                height={1800}
                className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'scale(1.4)', transformOrigin: 'center bottom' }}
                draggable={false}
              />
            </button>

            {/* B&W smoking, bottom-right */}
            <button
              type="button"
              onClick={() => setLightbox({ src: '/epk/IMG_2635.jpg', w: 1350, h: 1800, zoom: 1 })}
              className="aspect-[3/4] overflow-hidden cursor-zoom-in group"
              aria-label="ver foto en tamaño completo"
            >
              <Image
                src="/epk/IMG_2635.jpg"
                alt="floraluz"
                width={1350}
                height={1800}
                className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'scale(1.4)', transformOrigin: 'center bottom' }}
                draggable={false}
              />
            </button>
          </div>
        </section>

        {/* Project description */}
        <section className="space-y-6">
          <div className="flex items-center gap-6 text-xs tracking-widest uppercase">
            <span className="text-black/60">Proyecto / Project</span>
            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => setLang('ES')}
                className={`transition-colors ${lang === 'ES' ? 'text-black' : 'text-black/30 hover:text-black/60'}`}
              >
                ES
              </button>
              <span className="text-black/20">·</span>
              <button
                onClick={() => setLang('EN')}
                className={`transition-colors ${lang === 'EN' ? 'text-black' : 'text-black/30 hover:text-black/60'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="h-px bg-black/20" />

          {lang === 'ES' ? (
            <p className="text-sm leading-relaxed text-justify">
              <strong>floraluz</strong> es el proyecto musical de Quito, Ecuador, de una persona encantada por las computadoras, la programación y los dispositivos electrónicos. El proyecto nace dentro de una vida donde se debe balancear el estar detrás de un ordenador con la necesidad creativa de expresar música.
              <br /><br />
              Casi un año después del Vol. I, el 27 de febrero de 2026 se lanza <em>noches en vela, Vol. II</em>, el último EP de floraluz: un recopilatorio creado durante un par de meses.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-justify">
              <strong>floraluz</strong> is a musical project from Quito, Ecuador, by someone fascinated by computers, programming, and electronic devices. The project emerges from a life where being in front of a screen must be balanced with the creative need to express music.
              <br /><br />
              Almost a year after Vol. I, on February 27, 2026, <em>noches en vela, Vol. II</em> is released — floraluz&apos;s latest EP: a compilation put together over a couple of months.
            </p>
          )}
        </section>

        {/* Tracks */}
        <section className="space-y-6">
          <div className="flex items-center gap-6 text-xs tracking-widest uppercase">
            <span className="text-black/60">Escuchar / Listen</span>
          </div>

          <div className="h-px bg-black/20" />

          <div className="flex justify-center">
            <Image
              src="/floranevIIdef.png"
              alt="noches en vela, Vol. II"
              width={600}
              height={600}
              className="w-2/3 h-auto"
            />
          </div>

          <ul className="space-y-4">
            {TRACKS.map((t) => (
              <li key={t.file} className="space-y-1">
                <div className="text-sm">{t.title}</div>
                <audio
                  controls
                  preload="none"
                  className="w-full h-8"
                >
                  <source src={`/${encodeURIComponent(t.file)}`} type="audio/wav" />
                </audio>
              </li>
            ))}
          </ul>
        </section>

        {/* Platforms */}
        <section className="space-y-6">
          <div className="text-xs tracking-widest uppercase text-black/60">
            Plataformas / Platforms
          </div>

          <div className="h-px bg-black/20" />

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-wider">
            <a
              href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black/60 transition-colors"
            >
              YOUTUBE MUSIC
            </a>
            <span className="text-black/20">·</span>
            <a
              href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black/60 transition-colors"
            >
              YOUTUBE
            </a>
            <span className="text-black/20">·</span>
            <a
              href="https://music.apple.com/us/artist/floraluz/1782261856"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black/60 transition-colors"
            >
              APPLE MUSIC
            </a>
            <span className="text-black/20">·</span>
            <Link href="/sets" className="hover:text-black/60 transition-colors">
              SETS
            </Link>
            <span className="text-black/20">·</span>
            <Link href="/booking" className="hover:text-black/60 transition-colors">
              BOOKING
            </Link>
          </div>
        </section>

        {/* Contact */}
        <footer className="space-y-2">
          <div className="text-xs tracking-widest uppercase text-black/60">
            Contacto / Contact
          </div>
          <div className="text-sm">floraluz333@gmail.com</div>
        </footer>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox(null)
            }}
            aria-label="cerrar"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[90vh] aspect-[3/4] overflow-hidden"
          >
            <Image
              src={lightbox.src}
              alt="floraluz"
              width={lightbox.w}
              height={lightbox.h}
              className="w-full h-full object-cover block"
              style={{
                transform: `scale(${lightbox.zoom})`,
                transformOrigin: 'center bottom',
              }}
              sizes="90vw"
              priority
              draggable={false}
            />
          </div>
        </div>
      )}
    </main>
  )
}
