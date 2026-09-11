/**
 * Core data model for the floraluz live-visuals engine.
 *
 * `LightState` is the single normalized snapshot (all params 0-1 unless noted)
 * that every renderer (WebGL, DMX/Art-Net) consumes. Nothing in this file
 * touches the DOM, WebGL, or MIDI — the engine stays a pure, renderer-agnostic
 * TS package so the same state can drive a browser show and real fixtures.
 *
 * Roadmap (see memory `floraluz-live-visuals` / `floraluz-live-set-plan`):
 *   1. engine + WebGL renderer w/ debug sliders  <- this file, phase 1
 *   2. audio-in analysis modulators
 *   3. Web MIDI + performer layer (mix model below is the seam for that)
 *   4. scenes/banks/tap tempo/clock/blackout
 *   5. DMX renderer, fixture profiles, Electron packaging
 */

/** Global params shared by the whole rig. */
export interface GlobalBus {
  /** Overall brightness ceiling. 0-1. */
  master: number;
  /** Hard cut to black, overrides everything else when true. */
  blackout: boolean;
  /** Strobe amount. 0 = off, 1 = fastest/hardest. */
  strobe: number;
  /** Speed of chase/movement effects across zones. 0-1. */
  chaseSpeed: number;
  /** Audio energy envelope (fed by analysis in phase 2, manual for now). 0-1. */
  energy: number;
  /** How much zones drift/move (position, scale) rather than just pulse. 0-1. */
  movement: number;
  /** How spread out zones are from each other (fan out vs. cluster). 0-1. */
  spread: number;
  /** Base hue for scenes that don't set their own per-zone hue. 0-1 -> 0-360°. */
  hue: number;
  /** Base saturation. 0-1. */
  saturation: number;
}

/** One logical group of fixtures / screen region. */
export interface Zone {
  intensity: number; // 0-1
  hue: number; // 0-1 -> 0-360°
  saturation: number; // 0-1
  /** Phase offset (0-1 of a cycle) used by chase/movement effects. */
  offset: number;
}

export interface LightState {
  bus: GlobalBus;
  zones: Zone[];
}

export const DEFAULT_ZONE_COUNT = 6;

export function createDefaultZone(index: number, count: number): Zone {
  return {
    intensity: 0.5,
    hue: count > 0 ? index / count : 0,
    saturation: 0.8,
    offset: count > 0 ? index / count : 0,
  };
}

export function createDefaultLightState(zoneCount = DEFAULT_ZONE_COUNT): LightState {
  return {
    bus: {
      master: 0.8,
      blackout: false,
      strobe: 0,
      chaseSpeed: 0.3,
      energy: 0.5,
      movement: 0.2,
      spread: 0.5,
      hue: 0.6,
      saturation: 0.8,
    },
    zones: Array.from({ length: zoneCount }, (_, i) => createDefaultZone(i, zoneCount)),
  };
}
