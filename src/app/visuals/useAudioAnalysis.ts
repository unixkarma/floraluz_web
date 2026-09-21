"use client";

import { useCallback, useRef, useState } from "react";
import { computeBands } from "@engine/audio/bands";
import { computeRms } from "@engine/audio/rms";
import { createBeatDetector } from "@engine/audio/beat";
import { createEnvelopeFollower } from "@engine/audio/envelope";
import { createAutoGain } from "@engine/audio/normalize";
import { SILENT_ANALYSIS, type AudioAnalysis } from "@engine/audio/types";

export interface AudioInputDevice {
  deviceId: string;
  label: string;
}

/**
 * Browser-only audio capture + per-frame analysis. Lives outside engine/
 * on purpose (AudioContext/getUserMedia are DOM APIs) — everything it
 * produces (AudioAnalysis) is the plain data the pure engine/audio math
 * consumes.
 */
export function useAudioAnalysis() {
  const [devices, setDevices] = useState<AudioInputDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // Separate unsmoothed analyser for onsets — the band analyser's smoothing
  // blurs exactly the transients the beat detector needs to see.
  const onsetAnalyserRef = useRef<AnalyserNode | null>(null);
  const onsetBufRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const beatDetectorRef = useRef(createBeatDetector());
  const envelopeRef = useRef(createEnvelopeFollower(15, 300));
  // Fast attack / short release so it reads as a distinct "hit" per beat,
  // not a smooth pulse like the band-driven zones. Shared by the bpm zone
  // and the on-screen flash monitor so they always agree.
  const beatPulseRef = useRef(createEnvelopeFollower(5, 150));
  // Per-band adaptive gain: raw analyser averages barely move (~0.1-0.4),
  // so each band is rescaled against its own recent peak. `gain` is a
  // manual multiplier on top for when the auto-tracked peak still feels shy.
  const bandGainsRef = useRef({
    sub: createAutoGain(),
    low: createAutoGain(),
    mid: createAutoGain(),
    high: createAutoGain(),
    air: createAutoGain(),
  });
  const rmsGainRef = useRef(createAutoGain({ curve: 1.2 }));
  const [gain, setGain] = useState(1);
  const gainRef = useRef(gain);
  gainRef.current = gain;
  const freqBufRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const timeBufRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const disconnect = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
    onsetAnalyserRef.current = null;
    setConnected(false);
  }, []);

  const connect = useCallback(
    async (deviceId: string) => {
      disconnect();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: deviceId },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        streamRef.current = stream;
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        // Safari in particular can create the context suspended when it
        // isn't sure this is still "inside" a user gesture (we're a few
        // `await`s deep by now) — the analyser would silently read zeros
        // forever without this.
        if (ctx.state === "suspended") await ctx.resume();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.4;
        source.connect(analyser);
        analyserRef.current = analyser;
        const onset = ctx.createAnalyser();
        onset.fftSize = 1024;
        onset.smoothingTimeConstant = 0;
        source.connect(onset);
        onsetAnalyserRef.current = onset;
        onsetBufRef.current = new Uint8Array(onset.frequencyBinCount);
        // Kick region only (~30-200Hz) for onset flux.
        const binHz = ctx.sampleRate / onset.fftSize;
        beatDetectorRef.current.setBins([Math.floor(30 / binHz), Math.ceil(200 / binHz)]);
        freqBufRef.current = new Uint8Array(analyser.frequencyBinCount);
        timeBufRef.current = new Uint8Array(analyser.fftSize);
        beatDetectorRef.current.reset();
        envelopeRef.current.reset();
        Object.values(bandGainsRef.current).forEach((g) => g.reset());
        rmsGainRef.current.reset();
        beatPulseRef.current.reset();
        setActiveDeviceId(deviceId);
        setConnected(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setConnected(false);
      }
    },
    [disconnect],
  );

  const listDevices = useCallback(async () => {
    try {
      // Labels are blank until permission is granted at least once.
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
      probe.getTracks().forEach((t) => t.stop());
      const all = await navigator.mediaDevices.enumerateDevices();
      const inputs = all
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "input" }));
      setDevices(inputs);
      const blackhole = inputs.find((d) => /blackhole/i.test(d.label));
      // Auto-connect to BlackHole when we find it — that's the whole point
      // of the auto-detect; just pre-selecting it in the dropdown left
      // `connected` false and the AUDIO button stuck disabled.
      if (blackhole) await connect(blackhole.deviceId);
      setError(null);
      return inputs;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    }
  }, [connect]);

  /** Call once per animation frame; returns the latest analysis snapshot. */
  const tick = useCallback((nowMs: number): AudioAnalysis => {
    const analyser = analyserRef.current;
    const onset = onsetAnalyserRef.current;
    const ctx = ctxRef.current;
    const freq = freqBufRef.current;
    const time = timeBufRef.current;
    const onsetBuf = onsetBufRef.current;
    if (!analyser || !onset || !ctx || !freq || !time || !onsetBuf) return SILENT_ANALYSIS;

    analyser.getByteFrequencyData(freq);
    analyser.getByteTimeDomainData(time);
    onset.getByteFrequencyData(onsetBuf);

    const raw = computeBands(freq, ctx.sampleRate, analyser.fftSize);
    const g = gainRef.current;
    const ag = bandGainsRef.current;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const bands = {
      sub: clamp01(ag.sub.update(raw.sub, nowMs) * g),
      low: clamp01(ag.low.update(raw.low, nowMs) * g),
      mid: clamp01(ag.mid.update(raw.mid, nowMs) * g),
      high: clamp01(ag.high.update(raw.high, nowMs) * g),
      air: clamp01(ag.air.update(raw.air, nowMs) * g),
    };
    const rms = clamp01(rmsGainRef.current.update(computeRms(time), nowMs) * g);
    const { flux, isBeat, bpm } = beatDetectorRef.current.process(onsetBuf, nowMs);
    const energy = envelopeRef.current.update(rms, nowMs);
    const beatPulse = beatPulseRef.current.update(isBeat ? 1 : 0, nowMs);

    return { bands, rms, energy, flux, isBeat, bpm, beatPulse };
  }, []);

  return { devices, activeDeviceId, connected, error, gain, setGain, listDevices, connect, disconnect, tick };
}
