<<<<<<< HEAD
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BRAND = 'floraluz';

// Build a block of binary digits with random scrambling of ~3% of the bits.
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
  // Scramble ~3% of bits with weird glyphs (mirrors hashr's quote scrambler)
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
  const footerRef = useRef<HTMLDivElement>(null);

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

  // Binary rain for the middle (sky-blue) section — 16 columns, regenerated every 200ms
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
  // Why gsap.context + ctx.revert(): ScrollTrigger's pin:true wraps the trigger
  // in a "pin-spacer" <div> outside React's tree. On client-side navigation
  // (e.g. clicking a footer link), React unmounts the trigger while the spacer
  // still wraps it — the reconciler then tries to removeChild a node that's no
  // longer its direct child and throws. ctx.revert() unwraps the spacer
  // synchronously during cleanup, restoring the DOM React expects.
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

  // Footer visibility — driven by raw window.scrollY so it's independent of the
  // GSAP timeline. Visible only at the very top (section 1) and the very bottom
  // (section 3); hidden the entire time section 2 (cryptic) is on screen.
  useEffect(() => {
    const onScroll = () => {
      if (!footerRef.current) return;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = window.scrollY / max;
      const visible = p < 0.05 || p > 0.92;
      footerRef.current.style.opacity = visible ? '1' : '0';
      footerRef.current.style.pointerEvents = visible ? 'auto' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        {/* First (white) section */}
        <div className="first-section absolute inset-0 w-full h-full">
          {renderPage(false)}
        </div>

        {/* Second (sky-blue with binary rain) section */}
        <div className="second-section absolute inset-0 w-full h-full bg-sky-300 overflow-hidden">
          {/* Binary rain */}
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

          {/* Discreet email, top-right */}
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

      {/* Footer links — fixed, hidden over section 2 (cryptic) */}
      <div
        ref={footerRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 text-center pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center text-[10px] md:text-xs pointer-events-auto">
          <a
            href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            YOUTUBE MUSIC
          </a>
          <span className="text-gray-500">•</span>
          <a
            href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            YOUTUBE
          </a>
          <span className="text-gray-500">•</span>
          <a
            href="https://music.apple.com/us/artist/floraluz/1782261856"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            APPLE MUSIC
          </a>
          <span className="text-gray-500">•</span>
          <Link
            href="/sets"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            SETS
          </Link>
          <span className="text-gray-500">•</span>
          <Link
            href="/epk"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            EPK
          </Link>
          <span className="text-gray-500">•</span>
          <Link
            href="/booking"
            className="text-gray-400 hover:text-white transition-colors tracking-wider"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            BOOKING
          </Link>
        </div>
      </div>
    </>
  );
=======
import CoordCounter from './CoordCounter'

export default function Home() {
  return (
    <main
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{ animation: 'colorInvert1 7s infinite, colorInvert2 12s infinite' }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
        }}
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <div className="text-center space-y-10 md:space-y-16">

          {/* Title */}
          <div className="relative">
            <h1
              className="text-7xl md:text-8xl font-light tracking-wider mb-8"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              floraluz
            </h1>
            <div className="h-px bg-white/15 w-48 mx-auto" />
          </div>

          {/* Binary message */}
          <div className="max-w-lg mx-auto">
            <p className="text-gray-600 text-xs leading-relaxed tracking-widest opacity-70 text-center">
              01000011 01110101 01100001 01101110 01110100 01101111<br />
              00100000 01101101 11100001 01110011 00100000 01110011<br />
              01101001 01101100 01100101 01101110 01100011 01101001<br />
              01101111 01110011 01101111 00100000 01110100 01100101<br />
              00100000 01110110 01110101 01100101 01101100 01110110<br />
              01100001 01110011 00101100 00100000 01101101 11100001<br />
              01110011 00100000 01100110 01110101 01100101 01110010<br />
              01110100 01100101 00100000 01110000 01101111 01100100<br />
              01110010 11100001 01110011 00100000 01100101 01110011<br />
              01100011 01110101 01100011 01101000 01100001 01110010<br />
              00101110
            </p>
          </div>
        </div>

        {/* Music links */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center w-full px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-8 text-xs">
            <a
              href="https://music.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider"
            >
              YOUTUBE MUSIC
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://www.youtube.com/channel/UCNT-gxhr3otfMZlk4-EyaFg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider"
            >
              YOUTUBE
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://music.apple.com/us/artist/floraluz/1782261856"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors tracking-wider"
            >
              APPLE MUSIC
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 tracking-widest">
          <span>floraluz333@gmail.com</span>
          <span
            className="ml-1 text-red-800/60"
            style={{ animation: 'blink 1s infinite' }}
          >
            _
          </span>
        </div>
      </div>

      {/* XY coordinate counter */}
      <CoordCounter />
    </main>
  )
>>>>>>> 31163e1 (del)
}
