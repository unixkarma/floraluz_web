'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BIO_LONG =
  'floraluz es el proyecto de música electrónica de Nicolás Bohórquez Escobar, de Quito, Ecuador, un programador. El proyecto nace de una fascinación por los computadores y aparatos electrónicos y su capacidad para sintetizar y modular sonidos.\n\nEl 22 de mayo de 2026 se lanza 320, el nuevo sencillo de floraluz.\n\nfloraluz realiza sus producciones con computadora y un sintetizador analógico.';

const PHOTOS = [
  { src: '/epk/IMG_2517_bw.jpg', alt: 'floraluz — cara cubierta', filename: 'floraluz-photo-1.jpg', w: 1350, h: 1800 },
  { src: '/epk/newshirt.jpg', alt: 'floraluz — newshirt', filename: 'floraluz-photo-2.jpg', w: 3024, h: 3024 },
  { src: '/epk/IMG_2635.jpg', alt: 'floraluz — b&w', filename: 'floraluz-photo-3.jpg', w: 1350, h: 1800 },
  { src: '/epk/newlaunchpad.jpg', alt: 'floraluz — launchpad', filename: 'floraluz-photo-4.jpg', w: 3024, h: 3024 },
];

// Enlaces del sencillo 320 por plataforma.
const LISTEN = [
  { label: 'Spotify', href: 'https://open.spotify.com/album/6CauWWvwKYbTYdvb1OfsQk' },
  { label: 'Apple Music', href: 'https://music.apple.com/us/album/320-single/6768660992' },
  { label: 'YouTube Music', href: 'https://music.youtube.com/playlist?list=OLAK5uy_nrqqxE8xAna40kthOqbtiXJNiqN9IZl1Y' },
  { label: 'YouTube', href: 'https://www.youtube.com/watch?v=RbABlYODGMk&list=OLAK5uy_kKBLdB1jBAIKLoZQ8ORHURTm_Cb4RFQf0' },
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
            bioKey="long"
            text={BIO_LONG}
            copied={copied}
            onCopy={copy}
          />
        </section>

        {/* ── Lanzamiento ── */}
        <section className="space-y-8">
          <SectionLabel>LANZAMIENTO / RELEASE</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <div className="aspect-square overflow-hidden bg-black/5">
                <Image
                  src="/epk/portada320.png"
                  alt="floraluz — 320 (portada)"
                  width={1299}
                  height={1299}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <a
                href="/epk/portada320.png"
                download="floraluz-320-portada.png"
                className="block text-center text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/10 hover:border-black/30 py-2"
              >
                ↓ DESCARGAR PORTADA
              </a>
            </div>

            <div className="space-y-3">
              <h2
                className="font-black tracking-tight lowercase leading-none select-none"
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                }}
              >
                320
              </h2>
              <div className="text-sm text-black/70">22 de mayo de 2026</div>
              <div className="text-[10px] tracking-widest uppercase text-black/30 pt-1">[ ESCUCHAR / LISTEN ]</div>
              <div className="flex flex-wrap gap-2">
                {LISTEN.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] tracking-widest uppercase text-black/40 hover:text-black transition-colors border border-black/15 hover:border-black/40 px-4 py-2"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
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
                    House, Disco, Nu Disco, Techno, Electro, Breakbeat
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
  label?: string;
  bioKey: string;
  text: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {label ? (
          <div className="text-[10px] tracking-widest uppercase text-black/30">[ {label} ]</div>
        ) : (
          <span />
        )}
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
