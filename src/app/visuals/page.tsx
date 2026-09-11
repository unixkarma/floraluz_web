"use client";

/**
 * floraluz live-visuals — phase 1 debug page.
 *
 * Not linked from the public site nav; visit directly at /visuals. This is
 * the show-prep tool, meant to run full-screen on the laptop feeding the
 * projector during rehearsals and the actual set. Sliders here stand in for
 * audio analysis (phase 2) and MIDI performer control (phase 3).
 */
import { useEffect, useRef, useState } from "react";
import { createDefaultLightState, type LightState } from "@engine/types";
import { createTapTempo } from "@engine/clock";
import { createWebglRenderer, type WebglRenderer } from "@renderers/webgl/renderer";

export default function VisualsDebugPage() {
  const [state, setState] = useState<LightState>(() => createDefaultLightState());
  const [bpm, setBpm] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebglRenderer | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const tapTempoRef = useRef(createTapTempo());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createWebglRenderer(canvas);
    rendererRef.current = renderer;

    let raf = 0;
    const loop = (t: number) => {
      renderer.draw(stateRef.current, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  function setBus<K extends keyof LightState["bus"]>(key: K, value: LightState["bus"][K]) {
    setState((s) => ({ ...s, bus: { ...s.bus, [key]: value } }));
  }

  function setZone(i: number, patch: Partial<LightState["zones"][number]>) {
    setState((s) => ({
      ...s,
      zones: s.zones.map((z, idx) => (idx === i ? { ...z, ...patch } : z)),
    }));
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-black text-white">
      <canvas ref={canvasRef} className="min-h-0 flex-1 w-full" />

      <div className="flex flex-wrap gap-6 border-t border-white/10 bg-neutral-950 p-4 text-sm">
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">bus</h2>
          <Slider label="master" value={state.bus.master} onChange={(v) => setBus("master", v)} />
          <Slider label="strobe" value={state.bus.strobe} onChange={(v) => setBus("strobe", v)} />
          <Slider label="chaseSpeed" value={state.bus.chaseSpeed} onChange={(v) => setBus("chaseSpeed", v)} />
          <Slider label="energy" value={state.bus.energy} onChange={(v) => setBus("energy", v)} />
          <Slider label="movement" value={state.bus.movement} onChange={(v) => setBus("movement", v)} />
          <Slider label="spread" value={state.bus.spread} onChange={(v) => setBus("spread", v)} />
          <button
            onClick={() => setBus("blackout", !state.bus.blackout)}
            className={`mt-1 rounded px-3 py-1 font-semibold ${
              state.bus.blackout ? "bg-red-600" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            blackout {state.bus.blackout ? "ON" : "off"}
          </button>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">clock</h2>
          <button
            onClick={() => setBpm(tapTempoRef.current.tap())}
            className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
          >
            TAP
          </button>
          <div className="text-white/60">{bpm ? `${bpm.toFixed(1)} bpm` : "— bpm"}</div>
        </section>

        <section className="flex flex-1 flex-wrap gap-4">
          {state.zones.map((zone, i) => (
            <div key={i} className="flex flex-col gap-2 rounded border border-white/10 p-2">
              <h3 className="text-white/50">zone {i}</h3>
              <Slider label="intensity" value={zone.intensity} onChange={(v) => setZone(i, { intensity: v })} />
              <Slider label="hue" value={zone.hue} onChange={(v) => setZone(i, { hue: v })} />
              <Slider label="sat" value={zone.saturation} onChange={(v) => setZone(i, { saturation: v })} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-20 text-white/50">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}
