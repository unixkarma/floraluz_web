'use client'

import { useState } from 'react'
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

export default function EPK() {
  const [lang, setLang] = useState<'ES' | 'EN'>('ES')

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
            className="font-black tracking-tight uppercase leading-none select-none"
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: 'clamp(3rem, 12vw, 8rem)',
            }}
          >
            EPK
          </h1>
          <div className="text-xs tracking-widest uppercase text-black/60">
            Floraluz · noches en vela, Vol. II · EP
          </div>
        </header>

        {/* Cover */}
        <section>
          <Image
            src="/floraluz-cover.jpg"
            alt="floraluz cover"
            width={1200}
            height={1200}
            className="w-full h-auto"
            priority
          />
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
              Casi un año después del Vol. I, el 27 de febrero de 2026 se lanza <em>noches en vela, Vol. II</em>, el último EP de floraluz. De forma similar al Vol. I, expresa lo que se sienten días que son largos pero parecen cortos, y noches cortas que se sienten largas por el tiempo que se dedica a expresar emociones a través de sonidos, ritmos, melodías y armonías.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-justify">
              <strong>floraluz</strong> is a musical project from Quito, Ecuador, by someone fascinated by computers, programming, and electronic devices. The project emerges from a life where being in front of a screen must be balanced with the creative need to express music.
              <br /><br />
              Almost a year after Vol. I, on February 27, 2026, <em>noches en vela, Vol. II</em> is released — floraluz&apos;s latest EP. Similarly to Vol. I, it captures what it feels like to live days that are long but seem short, and short nights that feel long because of the time spent channeling emotions through sounds, rhythms, melodies, and harmonies.
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
        <footer className="space-y-2 pt-12">
          <div className="text-xs tracking-widest uppercase text-black/60">
            Contacto / Contact
          </div>
          <div className="text-sm">floraluz333@gmail.com</div>
        </footer>
      </div>
    </main>
  )
}
