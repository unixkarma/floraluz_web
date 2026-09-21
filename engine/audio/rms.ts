/** RMS of an AnalyserNode-style time-domain array (0-255, centered at 128). Returns ~0-1. */
export function computeRms(time: Uint8Array): number {
  let sumSq = 0;
  for (let i = 0; i < time.length; i++) {
    const v = (time[i] - 128) / 128;
    sumSq += v * v;
  }
  return Math.sqrt(sumSq / time.length);
}
