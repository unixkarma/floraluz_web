/**
 * Tempo utilities. Phase 1 only needs tap tempo (for debugging/rehearsal
 * without Ableton running). Phase 2/3 will add MIDI clock ingestion
 * (from Ableton via the IAC "CLOCK" bus) and Ableton Link, both of which
 * should win over tap tempo when present — see floraluz-live-visuals memory.
 */

const MAX_TAPS = 8;
/** Ignore taps slower than this (avoids one stray tap resetting to a bogus BPM). */
const MAX_INTERVAL_MS = 2000;

export function createTapTempo() {
  let taps: number[] = [];

  return {
    /** Register a tap; returns the estimated BPM, or null if not enough data yet. */
    tap(now: number = performance.now()): number | null {
      if (taps.length > 0 && now - taps[taps.length - 1] > MAX_INTERVAL_MS) {
        taps = [];
      }
      taps.push(now);
      if (taps.length > MAX_TAPS) taps.shift();
      if (taps.length < 2) return null;

      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1]);
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      return 60000 / avgMs;
    },
    reset() {
      taps = [];
    },
  };
}

export type TapTempo = ReturnType<typeof createTapTempo>;
