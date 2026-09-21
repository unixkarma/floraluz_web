/** Simple exponential attack/release follower — pure math, no audio-API dependency. */
export function createEnvelopeFollower(attackMs: number, releaseMs: number) {
  let value = 0;
  let lastT: number | null = null;

  return {
    update(target: number, nowMs: number): number {
      if (lastT === null) {
        lastT = nowMs;
        value = target;
        return value;
      }
      const dt = Math.max(0, nowMs - lastT);
      lastT = nowMs;
      const timeConstant = target > value ? attackMs : releaseMs;
      const coeff = 1 - Math.exp(-dt / Math.max(1, timeConstant));
      value += (target - value) * coeff;
      return value;
    },
    get value() {
      return value;
    },
    reset(v = 0) {
      value = v;
      lastT = null;
    },
  };
}

export type EnvelopeFollower = ReturnType<typeof createEnvelopeFollower>;
