export interface Bands {
  sub: number; // ~20-60Hz, 0-1
  low: number; // ~60-250Hz
  mid: number; // ~250-2000Hz
  high: number; // ~2-6kHz
  air: number; // ~6-16kHz
}

export interface AudioAnalysis {
  bands: Bands;
  /** Instantaneous RMS of the time-domain signal, 0-1ish. */
  rms: number;
  /** Attack/release-smoothed envelope of rms — the "energy" bus param source. */
  energy: number;
  /** Raw spectral-flux onset strength for this frame. */
  flux: number;
  /** True on frames where an onset crossed the adaptive threshold. */
  isBeat: boolean;
  /** Rolling BPM estimate from recent beat intervals, null until enough data. */
  bpm: number | null;
  /** Fast-attack/short-release envelope of `isBeat` — a decaying 0-1 "hit" per beat, distinct from the continuous bands. Drives the bpm zone/flash. */
  beatPulse: number;
}

export const SILENT_ANALYSIS: AudioAnalysis = {
  bands: { sub: 0, low: 0, mid: 0, high: 0, air: 0 },
  rms: 0,
  energy: 0,
  flux: 0,
  isBeat: false,
  bpm: null,
  beatPulse: 0,
};
