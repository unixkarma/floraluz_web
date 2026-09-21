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
import { chasePhase, createMidiClock, createTapTempo } from "@engine/clock";
import { createEnvelopeFollower } from "@engine/audio/envelope";
import { lerpLightState, SCENE_SLOTS } from "@engine/scenes";
import { applyAudioReactive, AUDIO_ZONE_LABELS } from "@engine/audio/mapping";
import { SILENT_ANALYSIS, type AudioAnalysis } from "@engine/audio/types";
import { createWebglRenderer, type WebglRenderer } from "@renderers/webgl/renderer";
import { useAudioAnalysis } from "./useAudioAnalysis";
import { useMidiControl, type MidiControl } from "./useMidiControl";
import { VISUALS_CHANNEL } from "./broadcast";
import { useBridge } from "./useBridge";
import { useScenes } from "./useScenes";
import { downloadShowFile, pickShowFile, SHOW_FILE_VERSION } from "./showFile";

// 4 zones so the reactive mapping is exactly bpm / low / mid / high — see
// engine/audio/mapping.ts. Manual mode still lets you repaint any of them.
const ZONE_COUNT = 4;

export default function VisualsDebugPage() {
  const [state, setState] = useState<LightState>(() => createDefaultLightState(ZONE_COUNT));
  const [bpm, setBpm] = useState<number | null>(null);
  const [audioMode, setAudioMode] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<AudioAnalysis>(SILENT_ANALYSIS);
  const [bpmFlashVisibility, setBpmFlashVisibility] = useState(0.8);
  const [clockBpm, setClockBpm] = useState<number | null>(null);
  const [sceneFadeMs, setSceneFadeMs] = useState(400);
  const [armSave, setArmSave] = useState(false);
  const [activeScene, setActiveScene] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashElRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebglRenderer | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const audioModeRef = useRef(audioMode);
  audioModeRef.current = audioMode;
  const bpmFlashVisibilityRef = useRef(bpmFlashVisibility);
  bpmFlashVisibilityRef.current = bpmFlashVisibility;
  const tapTempoRef = useRef(createTapTempo());
  // MIDI clock from Ableton (IAC bus with Sync on). While it runs, its
  // downbeats drive beatPulse (HTP with the audio detector) and its BPM
  // replaces the audio estimate — grid-exact even during breaks with no kick.
  const midiClockRef = useRef(createMidiClock());
  const clockPulseRef = useRef(createEnvelopeFollower(5, 150));
  // Scene crossfade in flight: rendered every frame in the rAF loop, and
  // React state catches up at ~10Hz so the sliders visibly move to the
  // scene without a setState per frame.
  const fadeRef = useRef<{ from: LightState; to: LightState; start: number; dur: number } | null>(null);
  const scenes = useScenes();
  const sceneFadeMsRef = useRef(sceneFadeMs);
  sceneFadeMsRef.current = sceneFadeMs;
  const audio = useAudioAnalysis();
  // useAudioAnalysis() returns a new object every render, so the rAF loop
  // below (mounted once) would otherwise close over `connected: false`
  // from the very first render forever — same trap audioModeRef exists for.
  const audioConnectedRef = useRef(audio.connected);
  audioConnectedRef.current = audio.connected;
  const audioTickRef = useRef(audio.tick);
  audioTickRef.current = audio.tick;
  // Art-Net bridge for the pixel tubes (tools/artnet-bridge). Same frame the
  // output window gets, just over a WebSocket to the Node process.
  const bridge = useBridge();
  const bridgeSendRef = useRef(bridge.send);
  bridgeSendRef.current = bridge.send;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createWebglRenderer(canvas);
    rendererRef.current = renderer;
    const channel = new BroadcastChannel(VISUALS_CHANNEL);

    let raf = 0;
    let lastUiUpdate = 0;
    let lastClockBpm: number | null = null;
    const loop = (t: number) => {
      let base = stateRef.current;

      const fade = fadeRef.current;
      if (fade) {
        const k = fade.dur > 0 ? (t - fade.start) / fade.dur : 1;
        base = lerpLightState(fade.from, fade.to, k);
        if (k >= 1) {
          fadeRef.current = null;
          setState(fade.to);
        } else if (t - lastUiUpdate > 100) {
          setState(base);
        }
      }

      let live = base;
      let analysis = SILENT_ANALYSIS;
      if (audioConnectedRef.current) analysis = audioTickRef.current(t);

      const clock = midiClockRef.current.snapshot(t);
      const clockPulse = clockPulseRef.current.update(clock.beatHit ? 1 : 0, t);
      if (clock.running) {
        analysis = {
          ...analysis,
          beatPulse: Math.max(analysis.beatPulse, clockPulse),
          isBeat: analysis.isBeat || clock.beatHit,
          bpm: clock.bpm ?? analysis.bpm,
        };
      }
      const roundedBpm = clock.bpm ? Math.round(clock.bpm * 10) / 10 : null;
      if (roundedBpm !== lastClockBpm) {
        lastClockBpm = roundedBpm;
        setClockBpm(roundedBpm);
      }

      if (audioModeRef.current && (audioConnectedRef.current || clock.running)) {
        live = applyAudioReactive(base, analysis);
      }
      if (t - lastUiUpdate > 120) {
        lastUiUpdate = t;
        if (audioConnectedRef.current || clock.running) setLiveAnalysis(analysis);
      }

      // BPM flash: same beatPulse envelope driving the bpm zone, just as a
      // corner monitor that works even while lighting stays on manual
      // sliders (independent of audioMode).
      if (flashElRef.current) {
        flashElRef.current.style.opacity = String(analysis.beatPulse * bpmFlashVisibilityRef.current);
      }

      const frame = {
        state: live,
        beatPulse: analysis.beatPulse,
        chasePhase: chasePhase(clock.running ? clock : null, live.bus.chaseSpeed, t / 1000),
      };
      renderer.draw(frame, t);
      channel.postMessage(frame);
      bridgeSendRef.current(frame);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      rendererRef.current = null;
      channel.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Web MIDI binding layer — "learn" a knob/pad against a paramId, then it
  // drives that slider/toggle directly. Switches instead of computed
  // property writes so each dispatch stays type-safe.
  const midi = useMidiControl({
    onCC: (id, v) => {
      if (id.startsWith("bus.")) {
        const key = id.slice(4);
        if (key === "master") setBus("master", v);
        else if (key === "strobe") setBus("strobe", v);
        else if (key === "chaseSpeed") setBus("chaseSpeed", v);
        else if (key === "energy") setBus("energy", v);
        else if (key === "movement") setBus("movement", v);
        else if (key === "spread") setBus("spread", v);
      } else if (id === "ui.bpmFlash") {
        setBpmFlashVisibility(v);
      } else if (id.startsWith("zone.")) {
        const [, idxStr, param] = id.split(".");
        const idx = Number(idxStr);
        if (param === "intensity") setZone(idx, { intensity: v });
        else if (param === "hue") setZone(idx, { hue: v });
        else if (param === "saturation") setZone(idx, { saturation: v });
      }
    },
    onTrigger: (id) => {
      if (id === "toggle.blackout") setBus("blackout", !stateRef.current.bus.blackout);
      else if (id === "toggle.audioMode") setAudioMode((m) => !m);
      else if (id.startsWith("scene.")) recallScene(Number(id.slice(6)));
    },
    onRealtime: (status, ts) => midiClockRef.current.onMessage(status, ts),
  });

  function recallScene(slot: number) {
    const scene = scenes.bank[slot];
    if (!scene) return;
    const from = fadeRef.current
      ? lerpLightState(fadeRef.current.from, fadeRef.current.to, (performance.now() - fadeRef.current.start) / fadeRef.current.dur)
      : stateRef.current;
    fadeRef.current = { from, to: structuredClone(scene.state), start: performance.now(), dur: sceneFadeMsRef.current };
    setActiveScene(slot);
  }

  function exportShow() {
    downloadShowFile({
      version: SHOW_FILE_VERSION,
      exportedAt: new Date().toISOString(),
      scenes: scenes.bank,
      midi: midi.bindings,
      settings: { sceneFadeMs, bpmFlashVisibility },
    });
  }

  async function importShow() {
    const file = await pickShowFile();
    if (!file) return;
    scenes.replaceAll(file.scenes);
    midi.replaceAll(file.midi);
    if (file.settings) {
      setSceneFadeMs(file.settings.sceneFadeMs);
      setBpmFlashVisibility(file.settings.bpmFlashVisibility);
    }
    setActiveScene(null);
  }

  function onSceneSlot(slot: number) {
    if (armSave) {
      scenes.save(slot, stateRef.current);
      setArmSave(false);
      setActiveScene(slot);
    } else {
      recallScene(slot);
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-black text-white">
      <div className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div
          ref={flashElRef}
          className="pointer-events-none absolute right-6 top-6 h-16 w-16 rounded-full bg-white"
          style={{ opacity: 0 }}
        />
        <button
          onClick={() => window.open("/visuals/output", "floraluz-output", "width=1280,height=720")}
          className="absolute left-4 top-4 rounded bg-black/60 px-3 py-1 text-sm hover:bg-black/80"
        >
          abrir salida ↗
        </button>
        <div
          className={`absolute left-4 top-12 rounded bg-black/60 px-3 py-1 text-xs ${
            bridge.connected ? "text-emerald-400" : "text-white/40"
          }`}
          title="tools/artnet-bridge — npm run bridge"
        >
          tubos {bridge.connected ? "● conectado" : "○ sin bridge"}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 border-t border-white/10 bg-neutral-950 p-4 text-sm">
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">bus</h2>
          <Slider label="master" value={state.bus.master} onChange={(v) => setBus("master", v)} bindId="bus.master" midi={midi} />
          <Slider label="strobe" value={state.bus.strobe} onChange={(v) => setBus("strobe", v)} bindId="bus.strobe" midi={midi} />
          <Slider
            label="chaseSpeed"
            value={state.bus.chaseSpeed}
            onChange={(v) => setBus("chaseSpeed", v)}
            bindId="bus.chaseSpeed"
            midi={midi}
          />
          <Slider label="energy" value={state.bus.energy} onChange={(v) => setBus("energy", v)} bindId="bus.energy" midi={midi} />
          <Slider
            label="movement"
            value={state.bus.movement}
            onChange={(v) => setBus("movement", v)}
            bindId="bus.movement"
            midi={midi}
          />
          <Slider label="spread" value={state.bus.spread} onChange={(v) => setBus("spread", v)} bindId="bus.spread" midi={midi} />
          <div className="mt-1 flex items-center gap-2">
            <button
              onClick={() => setBus("blackout", !state.bus.blackout)}
              className={`rounded px-3 py-1 font-semibold ${
                state.bus.blackout ? "bg-red-600" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              blackout {state.bus.blackout ? "ON" : "off"}
            </button>
            <MidiBadge id="toggle.blackout" midi={midi} />
          </div>
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
          <div className={clockBpm !== null ? "text-emerald-400" : "text-white/40"} title="Ableton → IAC Driver con Sync ON">
            midi clock {clockBpm !== null ? `▶ ${clockBpm.toFixed(1)}` : "○ —"}
          </div>
          <Slider label="bpm flash" value={bpmFlashVisibility} onChange={setBpmFlashVisibility} bindId="ui.bpmFlash" midi={midi} />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">midi</h2>
          {!midi.supported && <div className="max-w-40 text-amber-400">Web MIDI no soportado — usa Chrome/Edge.</div>}
          {midi.supported && (
            <div className="flex flex-col gap-0.5 text-white/50">
              {midi.connectedInputs.length === 0 ? (
                <span>sin dispositivos</span>
              ) : (
                midi.connectedInputs.map((name) => <span key={name}>{name}</span>)
              )}
            </div>
          )}
          <button onClick={midi.clearAll} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">
            borrar mapeos
          </button>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">audio</h2>
          <button
            onClick={() => audio.listDevices()}
            className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
          >
            list devices
          </button>
          {audio.devices.length > 0 && (
            <select
              value={audio.activeDeviceId ?? ""}
              onChange={(e) => audio.connect(e.target.value)}
              className="rounded bg-white/10 px-2 py-1"
            >
              <option value="" disabled>
                pick input…
              </option>
              {audio.devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
          )}
          {audio.error && <div className="max-w-48 text-red-400">{audio.error}</div>}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioMode((m) => !m)}
              disabled={!audio.connected && clockBpm === null}
              className={`rounded px-3 py-1 font-semibold disabled:opacity-30 ${
                audioMode ? "bg-emerald-600" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {audioMode ? "AUDIO ON" : "AUDIO off"}
            </button>
            <MidiBadge id="toggle.audioMode" midi={midi} />
          </div>
          {audio.connected && (
            <label className="flex flex-col gap-0.5 text-white/50">
              <span>gain {audio.gain.toFixed(1)}x</span>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.1}
                value={audio.gain}
                onChange={(e) => audio.setGain(Number(e.target.value))}
              />
            </label>
          )}
          {audio.connected && (
            <div className="flex flex-col gap-0.5 text-white/50">
              <span>energy {liveAnalysis.energy.toFixed(2)}</span>
              <span>low/mid/high {liveAnalysis.bands.low.toFixed(2)} {liveAnalysis.bands.mid.toFixed(2)} {liveAnalysis.bands.high.toFixed(2)}</span>
              <span>bpm {liveAnalysis.bpm ? liveAnalysis.bpm.toFixed(1) : "—"}</span>
              <span>beat {liveAnalysis.isBeat ? "●" : "○"}</span>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-white/70">escenas</h2>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: SCENE_SLOTS }, (_, i) => {
              const filled = scenes.bank[i] !== null;
              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => onSceneSlot(i)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      scenes.clear(i);
                      if (activeScene === i) setActiveScene(null);
                    }}
                    title={armSave ? "guardar aquí" : filled ? "disparar (clic derecho: borrar)" : "vacía"}
                    className={`h-9 w-9 rounded font-semibold ${
                      armSave
                        ? "bg-amber-500/60 hover:bg-amber-500"
                        : activeScene === i
                          ? "bg-emerald-600"
                          : filled
                            ? "bg-white/20 hover:bg-white/30"
                            : "bg-white/5 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </button>
                  <MidiBadge id={`scene.${i}`} midi={midi} />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setArmSave((a) => !a)}
            className={`rounded px-3 py-1 ${armSave ? "bg-amber-500 text-black" : "bg-white/10 hover:bg-white/20"}`}
          >
            {armSave ? "elige slot…" : "guardar"}
          </button>
          <div className="flex gap-1">
            <button onClick={exportShow} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20" title="escenas + mapeos MIDI → JSON">
              exportar show
            </button>
            <button onClick={importShow} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">
              importar
            </button>
          </div>
          <label className="flex flex-col gap-0.5 text-white/50">
            <span>fade {sceneFadeMs} ms</span>
            <input type="range" min={0} max={4000} step={50} value={sceneFadeMs} onChange={(e) => setSceneFadeMs(Number(e.target.value))} />
          </label>
        </section>

        <section className="flex flex-1 flex-wrap gap-4">
          {state.zones.map((zone, i) => (
            <div key={i} className="flex flex-col gap-2 rounded border border-white/10 p-2">
              <h3 className="text-white/50">{AUDIO_ZONE_LABELS[i] ?? `zone ${i}`}</h3>
              <Slider
                label="intensity"
                value={zone.intensity}
                onChange={(v) => setZone(i, { intensity: v })}
                bindId={`zone.${i}.intensity`}
                midi={midi}
              />
              <Slider label="hue" value={zone.hue} onChange={(v) => setZone(i, { hue: v })} bindId={`zone.${i}.hue`} midi={midi} />
              <Slider
                label="sat"
                value={zone.saturation}
                onChange={(v) => setZone(i, { saturation: v })}
                bindId={`zone.${i}.saturation`}
                midi={midi}
              />
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
  bindId,
  midi,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  bindId?: string;
  midi?: MidiControl;
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
      {bindId && midi && <MidiBadge id={bindId} midi={midi} />}
    </label>
  );
}

/** Click: enter/exit "learn" for this paramId. Double-click: forget its binding. */
function MidiBadge({ id, midi }: { id: string; midi: MidiControl }) {
  if (!midi.supported) return null;
  const binding = midi.bindings[id];
  const learning = midi.learnTarget === id;
  return (
    <button
      type="button"
      onClick={() => midi.setLearnTarget(learning ? null : id)}
      onDoubleClick={() => midi.clearBinding(id)}
      title="clic: aprender MIDI · doble clic: borrar"
      className={`rounded px-1.5 py-0.5 text-[10px] ${
        learning ? "animate-pulse bg-amber-500 text-black" : binding ? "bg-emerald-700" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {learning ? "…" : binding ? `${binding.kind}${binding.number}` : "midi"}
    </button>
  );
}
