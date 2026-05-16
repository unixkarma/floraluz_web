'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BRAND = 'floraluz';

function makeBinaryBlock(rows = 8, bytesPerRow = 6): string {
  const passwordChars = '!@#$%^&*+=?';
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const bytes: string[] = [];
    for (let b = 0; b < bytesPerRow; b++) {
      let byte = '';
      for (let i = 0; i < 8; i++) byte += Math.random() < 0.5 ? '0' : '1';
      bytes.push(byte);
    }
    lines.push(bytes.join(' '));
  }
  const text = lines.join('\n');
  const chars = text.split('');
  const bitIndices: number[] = [];
  chars.forEach((c, i) => {
    if (c === '0' || c === '1') bitIndices.push(i);
  });
  const toScramble = Math.ceil(bitIndices.length * 0.03);
  const picks = bitIndices.sort(() => Math.random() - 0.5).slice(0, toScramble);
  picks.forEach((pos) => {
    chars[pos] = passwordChars[Math.floor(Math.random() * passwordChars.length)];
  });
  return chars.join('');
}

function getRandomPosition() {
  return {
    top: `${Math.random() * 70 + 15}%`,
    left: `${Math.random() * 70 + 15}%`,
  };
}

const SETS = [
  {
    title: 'para el jueves I',
    embedUrl:
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2278403192&color=%2304bcbc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    title: 'mix para el miércoles I',
    embedUrl:
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2278399775&color=%23dfb8ac&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
  {
    title: 'para el sábado I',
    embedUrl:
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2279361551&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
  },
];

const STREAMING = [
  { label: 'YOUTUBE MUSIC', href: 'https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg' },
  { label: 'YOUTUBE', href: 'https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg' },
  { label: 'APPLE MUSIC', href: 'https://music.apple.com/us/artist/floraluz/1782261856' },
  { label: 'SPOTIFY', href: '' },
  { label: 'BANDCAMP', href: '' },
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState(BRAND);
  const [isAnimating, setIsAnimating] = useState(true);
  const [binaryA, setBinaryA] = useState('');
  const [binaryB, setBinaryB] = useState('');
  const [binaryAPos, setBinaryAPos] = useState({ top: '40%', left: '30%' });
  const [binaryBPos, setBinaryBPos] = useState({ top: '50%', left: '60%' });
  const [rainColumns, setRainColumns] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Title flicker — settle one letter at a time, 800ms per letter
  useEffect(() => {
    if (!isAnimating) return;

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const target = BRAND;
    const letterSettleDuration = 800;
    const totalDuration = target.length * letterSettleDuration;
    const settled = new Array(target.length).fill(false);
    let frames = 0;

    const interval = setInterval(() => {
      frames++;
      const elapsed = frames * 150;

      if (elapsed >= totalDuration) {
        setDisplayText(target);
        setIsAnimating(false);
        clearInterval(interval);
        return;
      }

      target.split('').forEach((_, i) => {
        if (elapsed >= i * letterSettleDuration) settled[i] = true;
      });

      const next = target
        .split('')
        .map((targetChar, i) =>
          settled[i]
            ? targetChar
            : characters[Math.floor(Math.random() * characters.length)],
        )
        .join('');

      setDisplayText(next);
    }, 150);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Floating binary blocks — regenerate position + scramble every 10s
  useEffect(() => {
    setBinaryA(makeBinaryBlock());
    setBinaryB(makeBinaryBlock());
    setBinaryAPos(getRandomPosition());
    setBinaryBPos(getRandomPosition());

    const interval = setInterval(() => {
      setBinaryA(makeBinaryBlock());
      setBinaryB(makeBinaryBlock());
      setBinaryAPos(getRandomPosition());
      setBinaryBPos(getRandomPosition());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Binary rain for the middle section — 16 columns, regenerated every 200ms
  useEffect(() => {
    const buildColumn = () => {
      let col = '';
      for (let i = 0; i < 40; i++) col += Math.random() < 0.5 ? '0' : '1';
      return col;
    };
    const buildAll = () => Array.from({ length: 16 }, buildColumn);

    setRainColumns(buildAll());
    const interval = setInterval(() => setRainColumns(buildAll()), 200);
    return () => clearInterval(interval);
  }, []);

  // Three-section scroll-pinned animation.
  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const ctx = gsap.context(() => {
      gsap.set('.first-section', { zIndex: 3 });
      gsap.set('.second-section', { zIndex: 2 });
      gsap.set('.third-section', { zIndex: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=200%',
        },
      });

      tl.to('.first-section', {
        x: window.innerWidth * 1.3,
        y: -window.innerHeight * 0.4,
        rotation: 15,
        ease: 'power2.out',
        duration: 1,
      }).to(
        '.second-section',
        {
          x: -window.innerWidth,
          ease: 'power2.out',
          duration: 1,
        },
        '+=0',
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const renderPage = (inverted = false) => {
    const block = inverted ? binaryB : binaryA;
    const pos = inverted ? binaryBPos : binaryAPos;

    return (
      <div
        className={`relative min-h-screen overflow-hidden ${
          inverted ? 'bg-black' : 'bg-white'
        }`}
      >
        {/* Floating binary block */}
        <div className="absolute inset-0 select-none pointer-events-none">
          {block && (
            <pre
              className={`absolute ${inverted ? 'text-gray-400' : 'text-gray-600'}`}
              style={{
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                fontSize: '0.95rem',
                lineHeight: '1.4',
                fontFamily: 'Courier New, monospace',
                margin: 0,
              }}
            >
              {block}
            </pre>
          )}
        </div>

        {/* Foreground */}
        <div className="relative z-10 min-h-screen">
          {/* Logo top-left */}
          <div
            className="absolute top-6 left-6 select-none"
            style={{
              filter: inverted ? 'none' : 'invert(1)',
            }}
          >
            <Image
              src="/favicon.png"
              alt="floraluz"
              width={80}
              height={80}
              priority
              draggable={false}
            />
          </div>

          {/* Mouse coordinates */}
          <div className="absolute top-8 right-8">
            <div
              className={`flex flex-col font-black select-none uppercase ${
                inverted ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: 'min(15vw, 12vh)',
                lineHeight: '1',
                transform: inverted ? 'scaleX(-1)' : 'none',
              }}
            >
              <div style={{ lineHeight: '1' }}>X{mousePos.x}</div>
              <div style={{ lineHeight: '1' }}>Y{mousePos.y}</div>
            </div>
          </div>

          {/* Brand title bottom-left */}
          <div className="absolute bottom-0 left-8">
            <h1
              className={`font-black tracking-tight select-none lowercase ${
                inverted ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: 'min(14vw, 40vh)',
                lineHeight: '1',
                transform: inverted ? 'scaleX(-1)' : 'none',
              }}
            >
              {displayText}
            </h1>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* GSAP hero */}
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        {/* First (white) section */}
        <div className="first-section absolute inset-0 w-full h-full">
          {renderPage(false)}
        </div>

        {/* Second (sky-blue with binary rain) section */}
        <div className="second-section absolute inset-0 w-full h-full bg-sky-300 overflow-hidden">
          <div className="absolute inset-0 flex justify-between px-2 select-none pointer-events-none">
            {rainColumns.map((col, i) => (
              <pre
                key={i}
                className="text-white/40"
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.95rem',
                  lineHeight: '1.1',
                  margin: 0,
                  writingMode: 'vertical-rl',
                  whiteSpace: 'pre',
                }}
              >
                {col}
              </pre>
            ))}
          </div>

          <div
            className="absolute top-6 right-6 z-10 text-white/70 select-none"
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
            }}
          >
            floraluz333@gmail.com
          </div>
        </div>

        {/* Third (inverted/black) section */}
        <div className="third-section absolute inset-0 w-full h-full">
          {renderPage(true)}
        </div>
      </div>

      {/* Fixed footer — streaming links, always visible */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 text-center pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center text-[10px] md:text-xs pointer-events-auto">
          <a
            href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-60 transition-opacity tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            YOUTUBE MUSIC
          </a>
          <span className="text-white/50">•</span>
          <a
            href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-60 transition-opacity tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            YOUTUBE
          </a>
          <span className="text-white/50">•</span>
          <a
            href="https://music.apple.com/us/artist/floraluz/1782261856"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-60 transition-opacity tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            APPLE MUSIC
          </a>
        </div>
      </div>

      {/* ── Bio ── */}
      <section className="bg-white text-black py-32 md:py-48 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-black lowercase tracking-tight leading-none mb-16 md:mb-24 select-none"
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: 'clamp(4.5rem, 18vw, 14rem)',
            }}
          >
            floraluz
          </h2>
          <div
            className="max-w-2xl ml-auto space-y-8"
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              lineHeight: '1.85',
            }}
          >
            <p>
              floraluz es música hecha de pantallas encendidas, de madrugadas frente a un ordenador
              y de las horas robadas al silencio. Un proyecto que nació en Quito, Ecuador, donde la
              electrónica, el ambient y el downtempo se mezclan con la necesidad de decir algo sin
              palabras.
            </p>
            <p>
              El 27 de febrero de 2026 llegó{' '}
              <em>noches en vela, Vol. II</em>, el EP más reciente: seis piezas construidas durante
              meses de trabajo silencioso. DJ sets y música en vivo disponibles para shows en Quito
              y alrededores.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mixes ── */}
      <section className="bg-black text-white py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-xs tracking-widest uppercase text-white/30 mb-12"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            MIXES & DJ SETS
          </div>
          <div className="space-y-6">
            {SETS.map((set, i) => (
              <div key={i} className="border border-white/10">
                <div
                  className="px-4 pt-4 pb-2 text-xs tracking-widest text-white/40"
                  style={{ fontFamily: 'Courier New, monospace' }}
                >
                  [ {String(i + 1).padStart(2, '0')} ] {set.title}
                </div>
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder={0}
                  allow="autoplay"
                  src={set.embedUrl}
                  loading="lazy"
                  className="block"
                  style={{ filter: 'saturate(0.6) contrast(1.1)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Streaming ── */}
      <section className="bg-white text-black py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-xs tracking-widest uppercase text-black/30 mb-12"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            ESCUCHAR / LISTEN
          </div>
          <div className="space-y-3">
            {STREAMING.map(({ label, href }) => (
              <a
                key={label}
                href={href || '#'}
                target={href ? '_blank' : undefined}
                rel={href ? 'noopener noreferrer' : undefined}
                className={`flex items-baseline gap-3 font-black tracking-tight lowercase transition-opacity hover:opacity-40 ${
                  !href ? 'opacity-20 pointer-events-none' : ''
                }`}
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                  lineHeight: '1.15',
                }}
              >
                {label}
                {href && (
                  <span
                    className="text-black/30"
                    style={{ fontFamily: 'Courier New, monospace', fontSize: '0.5em' }}
                  >
                    ↗
                  </span>
                )}
                {!href && (
                  <span
                    className="text-black/20"
                    style={{ fontFamily: 'Courier New, monospace', fontSize: '0.4em' }}
                  >
                    próximamente
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="bg-black text-white py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-xs tracking-widest uppercase text-white/30 mb-12"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            VIDEO
          </div>
          <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
            <span
              className="text-white/20 text-xs tracking-widest"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              [ VIDEO PRÓXIMAMENTE ]
            </span>
          </div>
        </div>
      </section>

      {/* ── Shows ── */}
      <section className="bg-white text-black py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-xs tracking-widest uppercase text-black/30 mb-16"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            SHOWS
          </div>

          <div className="mb-16">
            <div
              className="text-[10px] tracking-widest uppercase text-black/25 mb-6"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              PRÓXIMOS
            </div>
            <div
              className="text-sm text-black/25 tracking-wider"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              [ SIN SHOWS ANUNCIADOS ]
            </div>
          </div>

          <div>
            <div
              className="text-[10px] tracking-widest uppercase text-black/25 mb-6"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              PASADOS
            </div>
            <div
              className="space-y-2 text-sm text-black/35"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              <div className="flex gap-6">
                <span>2026-02</span>
                <span>—</span>
                <span>Quito, EC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <footer className="bg-black text-white py-24 px-6 text-center">
        <div
          className="mt-10 text-[10px] text-white/15 tracking-widest"
          style={{ fontFamily: 'Courier New, monospace' }}
        >
          [ floraluz :: 2026 ]
        </div>
      </footer>
    </>
  );
}
