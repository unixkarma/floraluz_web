/**
 * Adaptive per-signal normalizer. Raw band averages from an AnalyserNode sit
 * around 0.1-0.4 for normal program material (lots of quiet bins get
 * averaged in), so mapping them straight to 0-1 intensity looks nearly dead.
 * This tracks a slowly-decaying peak per signal and rescales against it, so
 * whatever the incoming level, each band spans its full range — with an
 * optional contrast curve to make hits pop instead of hover mid-range.
 */
export interface AutoGainOptions {
  /** How fast the tracked peak decays when the signal drops (ms). */
  decayMs?: number;
  /** Peak never goes below this — keeps silence from blowing up to 1. */
  floor?: number;
  /** Exponent applied after normalizing (>1 = more contrast, punchier). */
  curve?: number;
}

export function createAutoGain({ decayMs = 4000, floor = 0.08, curve = 1.6 }: AutoGainOptions = {}) {
  let peak = floor;
  let lastT: number | null = null;

  return {
    update(v: number, nowMs: number): number {
      if (lastT === null) lastT = nowMs;
      const dt = Math.max(0, nowMs - lastT);
      lastT = nowMs;
      if (v > peak) peak = v;
      else peak = Math.max(floor, peak * Math.exp(-dt / decayMs));
      const norm = Math.max(0, Math.min(1, v / peak));
      return Math.pow(norm, curve);
    },
    get peak() {
      return peak;
    },
    reset() {
      peak = floor;
      lastT = null;
    },
  };
}

export type AutoGain = ReturnType<typeof createAutoGain>;
