"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic Web MIDI binding layer: any slider/button in the page can expose a
 * `bindId`, the user clicks "learn" and moves a knob/pad, and from then on
 * that CC or note drives it. Bindings persist in localStorage so rehearsal
 * mappings survive a reload. This is a lighter cut of the full phase-3
 * performer layer (scenes/banks/HTP-LTP) from floraluz-live-visuals — just
 * "grab a knob, move a param" for now.
 *
 * Requires Chrome/Edge — Safari doesn't implement Web MIDI.
 */
export type MidiBindingKind = "cc" | "note";
export interface MidiBinding {
  kind: MidiBindingKind;
  channel: number;
  number: number;
}
export type MidiBindings = Record<string, MidiBinding>;

const STORAGE_KEY = "floraluz-visuals-midi-bindings";

function loadBindings(): MidiBindings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MidiBindings) : {};
  } catch {
    return {};
  }
}

function saveBindings(b: MidiBindings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  } catch {
    // best-effort; rehearsal still works, just won't remember next reload
  }
}

export interface MidiControlHandlers {
  /** Continuous control (CC), value normalized 0-1. */
  onCC?: (paramId: string, value01: number) => void;
  /** Note-on treated as a button press (blackout, mode toggles, scene fires…). */
  onTrigger?: (paramId: string) => void;
  /** System-realtime bytes (0xF8 clock tick, 0xFA/0xFB/0xFC transport) with the event's timestamp — for the MIDI clock. */
  onRealtime?: (status: number, timeStampMs: number) => void;
}

export function useMidiControl(handlers: MidiControlHandlers) {
  const [supported, setSupported] = useState(true);
  const [connectedInputs, setConnectedInputs] = useState<string[]>([]);
  const [bindings, setBindingsState] = useState<MidiBindings>(() => loadBindings());
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

  const [learnTarget, setLearnTargetState] = useState<string | null>(null);
  const learnTargetRef = useRef<string | null>(null);

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const setLearnTarget = useCallback((id: string | null) => {
    learnTargetRef.current = id;
    setLearnTargetState(id);
  }, []);

  const setBindings = useCallback((next: MidiBindings) => {
    bindingsRef.current = next;
    setBindingsState(next);
    saveBindings(next);
  }, []);

  const clearBinding = useCallback(
    (id: string) => {
      const next = { ...bindingsRef.current };
      delete next[id];
      setBindings(next);
    },
    [setBindings],
  );

  const clearAll = useCallback(() => setBindings({}), [setBindings]);
  /** Wholesale replace (show file import). */
  const replaceAll = useCallback((next: MidiBindings) => setBindings(next), [setBindings]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("requestMIDIAccess" in navigator)) {
      setSupported(false);
      return;
    }

    let disposed = false;
    let access: MIDIAccess | null = null;

    function handleMessage(e: MIDIMessageEvent) {
      const data = e.data;
      if (!data || data.length === 0) return;
      if (data[0] >= 0xf8) {
        handlersRef.current.onRealtime?.(data[0], e.timeStamp);
        return;
      }
      if (data.length < 2) return;
      const [status, d1, d2 = 0] = data;
      const type = status & 0xf0;
      const channel = status & 0x0f;

      if (learnTargetRef.current) {
        const id = learnTargetRef.current;
        if (type === 0xb0) {
          setBindings({ ...bindingsRef.current, [id]: { kind: "cc", channel, number: d1 } });
          setLearnTarget(null);
        } else if (type === 0x90 && d2 > 0) {
          setBindings({ ...bindingsRef.current, [id]: { kind: "note", channel, number: d1 } });
          setLearnTarget(null);
        }
        return;
      }

      for (const [id, binding] of Object.entries(bindingsRef.current)) {
        if (binding.kind === "cc" && type === 0xb0 && binding.number === d1) {
          handlersRef.current.onCC?.(id, d2 / 127);
        } else if (binding.kind === "note" && type === 0x90 && binding.number === d1 && d2 > 0) {
          handlersRef.current.onTrigger?.(id);
        }
      }
    }

    navigator
      .requestMIDIAccess()
      .then((a) => {
        if (disposed) return;
        access = a;
        const attachAll = () => {
          const names: string[] = [];
          access!.inputs.forEach((input) => {
            input.onmidimessage = handleMessage;
            names.push(input.name ?? "midi input");
          });
          setConnectedInputs(names);
        };
        attachAll();
        access.onstatechange = attachAll;
      })
      .catch(() => setSupported(false));

    return () => {
      disposed = true;
      access?.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
    };
  }, [setBindings, setLearnTarget]);

  return { supported, connectedInputs, bindings, learnTarget, setLearnTarget, clearBinding, clearAll, replaceAll };
}

export type MidiControl = ReturnType<typeof useMidiControl>;
