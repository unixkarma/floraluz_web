import type { LightState, Zone } from "./types";

/**
 * Scenes = full LightState snapshots you recall with a crossfade. Phase-4
 * cut: a flat bank of slots, no per-scene audio modulator depths yet (the
 * audio layer keeps applying on top of whatever scene is active, which is
 * what a first show needs). Fired from the UI, a pad, or a note clip in the
 * Ableton "LIGHTS" track.
 */
export interface Scene {
  name: string;
  state: LightState;
}

export const SCENE_SLOTS = 8;

export function snapshotScene(name: string, state: LightState): Scene {
  return { name, state: structuredClone(state) };
}

/** Linear blend a→b at t∈[0,1]; hue takes the short way round the wheel, booleans switch at the midpoint. */
export function lerpLightState(a: LightState, b: LightState, t: number): LightState {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const zones: Zone[] = b.zones.map((zb, i) => {
    const za = a.zones[i] ?? zb;
    return {
      intensity: lerp(za.intensity, zb.intensity, k),
      hue: lerpHue(za.hue, zb.hue, k),
      saturation: lerp(za.saturation, zb.saturation, k),
      offset: lerp(za.offset, zb.offset, k),
    };
  });
  return {
    bus: {
      master: lerp(a.bus.master, b.bus.master, k),
      blackout: k < 0.5 ? a.bus.blackout : b.bus.blackout,
      strobe: lerp(a.bus.strobe, b.bus.strobe, k),
      chaseSpeed: lerp(a.bus.chaseSpeed, b.bus.chaseSpeed, k),
      energy: lerp(a.bus.energy, b.bus.energy, k),
      movement: lerp(a.bus.movement, b.bus.movement, k),
      spread: lerp(a.bus.spread, b.bus.spread, k),
      hue: lerpHue(a.bus.hue, b.bus.hue, k),
      saturation: lerp(a.bus.saturation, b.bus.saturation, k),
    },
    zones,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHue(a: number, b: number, t: number): number {
  let d = b - a;
  if (d > 0.5) d -= 1;
  else if (d < -0.5) d += 1;
  const h = a + d * t;
  return ((h % 1) + 1) % 1;
}
