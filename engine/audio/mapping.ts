import type { LightState } from "../types";
import type { AudioAnalysis } from "./types";

/**
 * Fixed 4-zone reactive mapping: zone 0 = bpm (beatPulse — a distinct hit,
 * not a continuous band), zone 1 = low, zone 2 = mid, zone 3 = high. Meant
 * to be used with `createDefaultLightState(4)`. `base` still supplies hue/
 * sat/everything audio doesn't touch, so the manual sliders remain the
 * palette. This is the phase-2 baseline; phase 3 replaces it with an
 * editable per-param mapping table (curve + depth, HTP/LTP against manual/
 * scene values) per the mix engine design in floraluz-live-visuals.
 */
export const AUDIO_ZONE_LABELS = ["bpm", "low", "mid", "high"] as const;

export function applyAudioReactive(base: LightState, analysis: AudioAnalysis): LightState {
  const { bands, energy, beatPulse } = analysis;
  const levels = [beatPulse, bands.low, bands.mid, bands.high];

  const zones = base.zones.map((zone, i) => ({
    ...zone,
    intensity: clamp01(levels[i % levels.length]),
  }));

  return {
    bus: { ...base.bus, energy },
    zones,
  };
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
