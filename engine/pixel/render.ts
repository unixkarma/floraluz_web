import type { Frame, Zone } from "../types";
import { pixelCount, type PixelLayout } from "./types";

/**
 * LightState -> RGB bytes for the pixel tubes.
 *
 * Per tube (one zone each):
 *   - VU fill: the zone's intensity lights that fraction of the tube from
 *     the bottom in the zone's colour; the rest idles at a dim floor so the
 *     tube still reads as an object between hits.
 *   - Wave: a travelling sine along the tube driven by the frame's
 *     chasePhase (bar-locked when Ableton's clock runs) + the zone's offset,
 *     blended in by bus.movement. spread sets how many wave cycles fit in
 *     one tube.
 *   - Beat: beatPulse is an additive white burst from the tube's centre
 *     outwards on every tube (HTP with the colour underneath), so the kick
 *     is readable no matter which zone the tube shows.
 *   - strobe / blackout / master behave like the WebGL renderer.
 *
 * `out` must be pixelCount(layout) * 3 bytes; it is filled in place so the
 * bridge can reuse one buffer per frame. `timeSec` (monotonic seconds) is
 * only used for the strobe gate.
 */
export function renderPixels(frame: Frame, timeSec: number, layout: PixelLayout, out: Uint8Array): Uint8Array {
  const { state, beatPulse, chasePhase } = frame;
  const n = pixelCount(layout);
  if (out.length < n * 3) throw new Error(`renderPixels: out needs ${n * 3} bytes, got ${out.length}`);

  const { bus, zones } = state;
  if (bus.blackout || zones.length === 0) {
    out.fill(0, 0, n * 3);
    return out;
  }

  // Strobe gates the whole frame; faster + harder as strobe -> 1.
  let strobeGate = 1;
  if (bus.strobe > 0.01) {
    const hz = 2 + bus.strobe * 18;
    strobeGate = (timeSec * hz) % 1 < 0.5 ? 1 : 1 - bus.strobe;
  }
  const master = bus.master * strobeGate;
  const gamma = layout.gamma ?? 2.2;
  const cycles = 0.5 + bus.spread * 2.5;
  const phase = chasePhase;
  const beat = clamp01(beatPulse);
  const ppt = layout.pixelsPerTube;
  const flipped = new Set(layout.flipped ?? []);

  for (let tube = 0; tube < layout.tubes; tube++) {
    const zoneIdx = layout.zoneOfTube?.[tube] ?? tube;
    const zone: Zone = zones[zoneIdx % zones.length];
    const [zr, zg, zb] = hsvToRgb(zone.hue, zone.saturation, 1);
    const flip = flipped.has(tube);

    for (let p = 0; p < ppt; p++) {
      // t: 0 at the floor end, 1 at the top, regardless of wiring direction.
      const t = ppt > 1 ? (flip ? ppt - 1 - p : p) / (ppt - 1) : 0;

      const vu = t <= zone.intensity ? 1 : 0.06;
      const wave = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t * cycles - phase + zone.offset));
      const level = zone.intensity * ((1 - bus.movement) * vu + bus.movement * wave * (0.3 + 0.7 * vu));

      // Beat burst: centre-out, width grows with the pulse.
      const dist = Math.abs(t - 0.5) * 2;
      const burst = beat > 0.001 ? beat * Math.max(0, 1 - dist / Math.max(0.15, beat)) : 0;

      let r = zr * level + burst;
      let g = zg * level + burst;
      let b = zb * level + burst;
      r = clamp01(r) * master;
      g = clamp01(g) * master;
      b = clamp01(b) * master;

      const i = (tube * ppt + p) * 3;
      out[i] = Math.round(Math.pow(r, gamma) * 255);
      out[i + 1] = Math.round(Math.pow(g, gamma) * 255);
      out[i + 2] = Math.round(Math.pow(b, gamma) * 255);
    }
  }
  return out;
}

/** h, s, v in 0-1 -> r, g, b in 0-1. */
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (((i % 6) + 6) % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
