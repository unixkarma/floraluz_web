'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BIO_SHORT =
  'floraluz es un proyecto de música electrónica de Quito, Ecuador. DJ sets y música en vivo: electrónica, ambient, downtempo.';

const BIO_MEDIUM =
  'floraluz es el proyecto musical de Quito, Ecuador, de una persona encantada por las computadoras y los dispositivos electrónicos. DJ sets y música en vivo donde la electrónica, el ambient y el downtempo se entrelazan con la necesidad de decir algo sin palabras. Último lanzamiento: noches en vela, Vol. II (febrero 2026).';

const BIO_LONG =
  'floraluz es el proyecto musical de Quito, Ecuador, de una persona encantada por las computadoras, la programación y los dispositivos electrónicos. El proyecto nace dentro de una vida donde se debe balancear el estar detrás de un ordenador con la necesidad creativa de expresar música.\n\nCasi un año después del Vol. I, el 27 de febrero de 2026 se lanza noches en vela, Vol. II, el último EP de floraluz: un recopilatorio de seis piezas construidas durante meses de trabajo silencioso.\n\nDJ sets de electrónica, ambient, downtempo y experimentación. Disponible para shows en Quito y alrededores. Contacto: floraluz333@gmail.com';

const PHOTOS = [
  { src: '/epk/IMG_2517.jpg', alt: 'floraluz — color', filename: 'floraluz-photo-1.jpg', w: 1350, h: 1800 },
  { src: '/epk/IMG_2635.jpg', alt: 'floraluz — b&w', filename: 'floraluz-photo-2.jpg', w: 1350, h: 1800 },
  { src: '/epk/DSC00359.jpg', alt: 'floraluz — live', filename: 'floraluz-photo-3.jpg', w: 1350, h: 900 },
];

export default function Press() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      {/* Back link */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-xs tracking-widest text-black/50 hover:text-black transition-colors"
      >
        ← floraluz
      </Link>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-32 space-y-28">

        {/* Header */}
        <header className="space-y-3">
          <h1
            className="font-black tracking-tight lowercase leading-none select-none"
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: 'clamp(3rem, 12vw, 8rem)',
            }}
          >
            floraluz
          </h1>
          <div className="text-[10px] tracking-widest uppercase text-black/40">
            PRESS KIT · EPK
          </div>
        </header>

        {/* ── Bio ── */}
        <section className="space-y-8">
          <SectionLabel>BIO</SectionLabel>

          <BioBlock
            label="CORTA"
            bioKey="short"
            text={BIO_SHORT}
            copied={copied}
            onCopy={copy}
          />
          <BioBlock
            label="MEDIA"
            bioKey="medium"
            text={BIO_MEDIUM}
            copied={copied}
            onCopy={copy}
          />
          <BioBlock
            label="LARGA"
            bioKey="long"
            text={BIO_LONG}
            copied={copied}
            onCopy={copy}
          />
        </section>

        {/* ── Photos ── */}
        <section className="space-y-8">
          <SectionLabel>FOTOS / PHOTOS</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHOTOS.map((photo) => (
              <div key={photo.src} className="space-y-2">
                <div className="aspect-[3/4] overflow-hidden bg-black/5">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.w}
                    height={photo.h}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <a
                  href={photo.src}
                  download={photo.filename}
                  className="block text-center text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/10 hover:border-black/30 py-2"
                >
                  ↓ DESCARGAR
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Logos ── */}
        <section className="space-y-8">
          <SectionLabel>LOGOS</SectionLabel>

          <div className="flex flex-wrap gap-6 items-end">
            <div className="space-y-2">
              <div className="w-24 h-24 bg-black/5 flex items-center justify-center border border-black/10">
                <Image
                  src="/favicon.png"
                  alt="floraluz logo"
                  width={80}
                  height={80}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <a
                href="/favicon.png"
                download="floraluz-logo.png"
                className="block text-center text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/10 hover:border-black/30 py-2"
              >
                ↓ PNG
              </a>
            </div>

            <div className="space-y-2">
              <div className="w-24 h-24 bg-black flex items-center justify-center border border-black/10">
                <Image
                  src="/favicon.png"
                  alt="floraluz logo dark"
                  width={80}
                  height={80}
                  className="invert"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <a
                href="/floraluz-cover.jpg"
                download="floraluz-cover.jpg"
                className="block text-center text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/10 hover:border-black/30 py-2"
              >
                ↓ COVER
              </a>
            </div>
          </div>
        </section>

        {/* ── Tech Rider ── */}
        <section className="space-y-8">
          <SectionLabel>RIDER TÉCNICO / TECHNICAL RIDER</SectionLabel>

          <div className="space-y-10 text-sm">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-4">
                [ ARTISTA PROVEE · ARTIST PROVIDES ]
              </div>
              <ul className="space-y-2 text-black/70">
                {[
                  'Laptop',
                  'Novation Launchpad',
                  'Novation Launch Control',
                  'Interfaz de audio (Focusrite Scarlett o similar)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-black/25 mt-0.5 select-none">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-4">
                [ VENUE PROVEE · VENUE PROVIDES ]
              </div>
              <ul className="space-y-2 text-black/70">
                {[
                  'Sistema de sonido PA con subwoofer',
                  'Mixer con al menos 1 canal estéreo libre',
                  'Monitor de escenario',
                  'Mesa estable para equipo',
                  'Toma de corriente cercana (110V)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-black/25 mt-0.5 select-none">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-4">
                [ CONEXIÓN · CONNECTION ]
              </div>
              <p className="text-black/70 leading-relaxed">
                Salida estéreo (2× 1/4&quot; TRS o 2× XLR) desde interfaz de audio directo al
                mixer del venue.
              </p>
            </div>

            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-4">
                [ FORMATO · SET FORMAT ]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-black/10 p-4 text-center space-y-1">
                  <div className="font-bold tracking-wider text-xs uppercase">DJ SET</div>
                  <div className="text-black/40 text-xs">30 min — 2 hrs</div>
                  <div className="text-black/50 text-xs leading-relaxed">
                    Electrónica, ambient, downtempo, experimental
                  </div>
                </div>
                <div className="border border-black/10 p-4 text-center space-y-1">
                  <div className="font-bold tracking-wider text-xs uppercase">OPENING SET</div>
                  <div className="text-black/40 text-xs">30 min — 1 hr</div>
                  <div className="text-black/50 text-xs leading-relaxed">
                    Sets de apertura adaptados al headliner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Press mentions ── */}
        <section className="space-y-8">
          <SectionLabel>PRENSA / PRESS MENTIONS</SectionLabel>

          <div className="text-sm text-black/25 tracking-wider">
            [ SIN MENCIONES AÚN — PRÓXIMAMENTE ]
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="space-y-8">
          <SectionLabel>CONTACTO BOOKING</SectionLabel>

          <div className="space-y-4 text-sm">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-1">EMAIL</div>
              <a
                href="mailto:floraluz333@gmail.com"
                className="text-black hover:opacity-50 transition-opacity"
              >
                floraluz333@gmail.com
              </a>
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-1">
                UBICACIÓN
              </div>
              <span className="text-black/70">Quito, Ecuador</span>
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 mb-1">
                DISPONIBILIDAD
              </div>
              <span className="text-black/70">
                Disponible para shows en Quito y alrededores
              </span>
            </div>
          </div>

          <a
            href="mailto:floraluz333@gmail.com"
            className="inline-block text-xs tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/15 hover:border-black/40 px-8 py-4 mt-4"
          >
            → ENVIAR MENSAJE
          </a>
        </section>

      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="text-[10px] tracking-widest uppercase text-black/30">{children}</div>
      <div className="h-px bg-black/10" />
    </div>
  );
}

function BioBlock({
  label,
  bioKey,
  text,
  copied,
  onCopy,
}: {
  label: string;
  bioKey: string;
  text: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-widest uppercase text-black/30">[ {label} ]</div>
        <button
          type="button"
          onClick={() => onCopy(text, bioKey)}
          className="text-[10px] tracking-widest uppercase text-black/30 hover:text-black transition-colors border border-black/10 hover:border-black/30 px-3 py-1"
        >
          {copied === bioKey ? '✓ COPIADO' : 'COPIAR'}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-black/70 whitespace-pre-line">{text}</p>
    </div>
  );
}
