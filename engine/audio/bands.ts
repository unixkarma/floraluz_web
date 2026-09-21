import type { Bands } from "./types";

export interface BandRangesHz {
  sub: [number, number];
  low: [number, number];
  mid: [number, number];
  high: [number, number];
  air: [number, number];
}

export const DEFAULT_BAND_HZ: BandRangesHz = {
  sub: [20, 60],
  low: [60, 250],
  mid: [250, 2000],
  high: [2000, 6000],
  air: [6000, 16000],
};

/**
 * Averages an AnalyserNode-style frequency-magnitude array (0-255 per bin,
 * as from `getByteFrequencyData`) into 5 perceptual bands, 0-1 each.
 * Pure function — caller owns the AnalyserNode / AudioContext.
 */
export function computeBands(
  freq: Uint8Array,
  sampleRate: number,
  fftSize: number,
  ranges: BandRangesHz = DEFAULT_BAND_HZ,
): Bands {
  const binHz = sampleRate / fftSize;

  const avg = ([lo, hi]: [number, number]) => {
    const startBin = Math.max(0, Math.floor(lo / binHz));
    const endBin = Math.min(freq.length - 1, Math.ceil(hi / binHz));
    if (endBin <= startBin) return 0;
    let sum = 0;
    for (let i = startBin; i <= endBin; i++) sum += freq[i];
    return sum / (endBin - startBin + 1) / 255;
  };

  return {
    sub: avg(ranges.sub),
    low: avg(ranges.low),
    mid: avg(ranges.mid),
    high: avg(ranges.high),
    air: avg(ranges.air),
  };
}
