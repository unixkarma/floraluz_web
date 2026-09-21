"use client";

import { useCallback, useState } from "react";
import { SCENE_SLOTS, snapshotScene, type Scene } from "@engine/scenes";
import type { LightState } from "@engine/types";

/** Scene bank persisted in localStorage (same policy as MIDI bindings). */
const STORAGE_KEY = "floraluz-visuals-scenes";

type Bank = (Scene | null)[];

function load(): Bank {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Bank) : [];
    return Array.from({ length: SCENE_SLOTS }, (_, i) => parsed[i] ?? null);
  } catch {
    return Array.from({ length: SCENE_SLOTS }, () => null);
  }
}

export function useScenes() {
  const [bank, setBank] = useState<Bank>(() => (typeof window === "undefined" ? Array(SCENE_SLOTS).fill(null) : load()));

  const persist = useCallback((next: Bank) => {
    setBank(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* best-effort */
    }
  }, []);

  const save = useCallback(
    (slot: number, state: LightState) => {
      const next = [...bank];
      next[slot] = snapshotScene(`${slot + 1}`, state);
      persist(next);
    },
    [bank, persist],
  );

  const clear = useCallback(
    (slot: number) => {
      const next = [...bank];
      next[slot] = null;
      persist(next);
    },
    [bank, persist],
  );

  return { bank, save, clear };
}
