import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

// Página oculta: no enlazada desde ningún lado y excluida de indexación.
export const metadata: Metadata = {
  title: 'Rider Técnico — floraluz',
  robots: { index: false, follow: false },
};

export default function RiderTecnico() {
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
            RIDER TÉCNICO · TECHNICAL RIDER
          </div>
        </header>

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
                  'Controlador MIDI',
                  'Mixer',
                  'Interfaz de audio',
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
                  'Sistema de sonido PA',
                  'Mixer con al menos 1 canal estéreo libre',
                  'Monitor de escenario (opcional)',
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
