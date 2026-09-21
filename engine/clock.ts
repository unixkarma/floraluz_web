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

/**
 * MIDI beat clock ingestion (24 ppqn). Ableton sends this on any MIDI
 * output whose "Sync" toggle is on (Preferences → Link/Tempo/MIDI); over the
 * IAC bus it lands in Web MIDI as 1-byte system-realtime messages:
 *   0xF8 tick · 0xFA start · 0xFB continue · 0xFC stop
 * Pure — feed `onMessage` from wherever MIDI arrives, read `snapshot` per
 * frame. Wins over tap tempo / audio beat detection while `running`.
 */
const PPQN = 24;
/** Consider the clock dead if no tick for this long (Ableton stopped, cable pulled). */
const CLOCK_TIMEOUT_MS = 1000;

export interface MidiClockSnapshot {
  running: boolean;
  bpm: number | null;
  /** 0-1 position inside the current beat, extrapolated from the last tick. */
  beatPhase: number;
  /** Quarter-note count since start. */
  beat: number;
  /** True exactly once per beat, on the first frame after the downbeat tick. */
  beatHit: boolean;
}

export function createMidiClock() {
  let running = false;
  let ticks = 0;
  let lastTickAt: number | null = null;
  let tickIntervals: number[] = [];
  let pendingBeats = 0;

  return {
    onMessage(status: number, nowMs: number) {
      if (status === 0xfa) {
        running = true;
        ticks = 0;
        tickIntervals = [];
        lastTickAt = null;
      } else if (status === 0xfb) {
        running = true;
      } else if (status === 0xfc) {
        running = false;
      } else if (status === 0xf8) {
        if (lastTickAt !== null) {
          const dt = nowMs - lastTickAt;
          if (dt > 0 && dt < 200) {
            tickIntervals.push(dt);
            if (tickIntervals.length > PPQN) tickIntervals.shift();
          }
        }
        lastTickAt = nowMs;
        // Some senders never send start; ticks alone mean "running".
        running = true;
        if (ticks % PPQN === 0) pendingBeats++;
        ticks++;
      }
    },

    snapshot(nowMs: number): MidiClockSnapshot {
      if (lastTickAt !== null && nowMs - lastTickAt > CLOCK_TIMEOUT_MS) running = false;
      let bpm: number | null = null;
      if (tickIntervals.length >= PPQN / 2) {
        const sorted = [...tickIntervals].sort((a, b) => a - b);
        const medianTick = sorted[Math.floor(sorted.length / 2)];
        bpm = 60000 / (medianTick * PPQN);
      }
      const tickInBeat = ticks % PPQN;
      const msPerTick = bpm ? 60000 / bpm / PPQN : 0;
      const sinceTick = lastTickAt !== null && msPerTick > 0 ? Math.min(1, (nowMs - lastTickAt) / msPerTick) : 0;
      const beatPhase = running ? Math.min(1, (tickInBeat + sinceTick) / PPQN) : 0;
      const beatHit = pendingBeats > 0;
      pendingBeats = 0;
      return { running, bpm: running ? bpm : null, beatPhase, beat: Math.floor(ticks / PPQN), beatHit };
    },
  };
}

export type MidiClock = ReturnType<typeof createMidiClock>;
