/**
 * Onset (beat) detection via spectral flux with an adaptive threshold, plus
 * a rolling BPM estimate from recent beat-to-beat intervals. Pure TS — takes
 * a frequency-magnitude snapshot each frame, owns no audio nodes.
 *
 * This is the fallback/always-on clock source for public/no-Ableton mode.
 * When Ableton MIDI clock or Link is present (later phases) that should win
 * — see the clock precedence note in the floraluz-live-visuals memory.
 */
export interface BeatDetectorOptions {
  /** Multiplier over the recent mean flux to call a frame an onset. */
  sensitivity?: number;
  /** Minimum ms between beats — caps false-triggers at high tempos (~300bpm). */
  refractoryMs?: number;
  /** How many recent flux samples to average for the adaptive threshold. */
  historyLength?: number;
  /**
   * Bin range [start, end) the flux is computed over. Defaults to the whole
   * spectrum; the hook narrows it to the kick/low region so hats and vocals
   * don't smear the onset signal.
   */
  bins?: [number, number];
}

export function createBeatDetector(opts: BeatDetectorOptions = {}) {
  const sensitivity = opts.sensitivity ?? 1.5;
  const refractoryMs = opts.refractoryMs ?? 250;
  const historyLength = opts.historyLength ?? 43;
  let bins = opts.bins;

  let prevSpectrum: Uint8Array | null = null;
  let prevFlux = 0;
  let fluxHistory: number[] = [];
  let lastBeatT = -Infinity;
  let beatIntervals: number[] = [];

  function flux(spectrum: Uint8Array): number {
    if (!prevSpectrum || prevSpectrum.length !== spectrum.length) {
      prevSpectrum = new Uint8Array(spectrum);
      return 0;
    }
    const start = Math.max(0, bins?.[0] ?? 0);
    const end = Math.min(spectrum.length, bins?.[1] ?? spectrum.length);
    let sum = 0;
    for (let i = start; i < end; i++) {
      const diff = spectrum[i] - prevSpectrum[i];
      if (diff > 0) sum += diff;
    }
    prevSpectrum.set(spectrum);
    return sum / Math.max(1, end - start) / 255;
  }

  /** Median of recent intervals, octave-folded into a 70-180bpm window so
   *  half/double-time onsets (every other kick, hats) land on the same tempo. */
  function estimateBpm(): number | null {
    if (beatIntervals.length < 3) return null;
    const sorted = [...beatIntervals].sort((a, b) => a - b);
    let bpm = 60000 / sorted[Math.floor(sorted.length / 2)];
    while (bpm < 70) bpm *= 2;
    while (bpm > 180) bpm /= 2;
    return bpm;
  }

  return {
    process(spectrum: Uint8Array, nowMs: number): { flux: number; isBeat: boolean; bpm: number | null } {
      const f = flux(spectrum);
      fluxHistory.push(f);
      if (fluxHistory.length > historyLength) fluxHistory.shift();
      const n = fluxHistory.length;
      const mean = fluxHistory.reduce((a, b) => a + b, 0) / n;
      const variance = fluxHistory.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n;
      // Relative threshold (mean + k·σ) instead of a fixed absolute floor —
      // the old `+0.02` was above the flux of a normal mix so nothing ever fired.
      const threshold = mean + sensitivity * Math.sqrt(variance) + 0.002;

      let isBeat = false;
      // Rising-edge only: fire on the frame the flux jumps, not while it's
      // still above threshold on the way down.
      if (f > threshold && f > prevFlux && nowMs - lastBeatT > refractoryMs) {
        isBeat = true;
        if (Number.isFinite(lastBeatT)) {
          const interval = nowMs - lastBeatT;
          if (interval > 250 && interval < 1500) {
            beatIntervals.push(interval);
            if (beatIntervals.length > 12) beatIntervals.shift();
          }
        }
        lastBeatT = nowMs;
      }
      prevFlux = f;

      return { flux: f, isBeat, bpm: estimateBpm() };
    },
    setBins(range: [number, number] | undefined) {
      bins = range;
    },
    reset() {
      prevSpectrum = null;
      prevFlux = 0;
      fluxHistory = [];
      lastBeatT = -Infinity;
      beatIntervals = [];
    },
  };
}

export type BeatDetector = ReturnType<typeof createBeatDetector>;
