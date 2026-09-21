import type { Scene } from "@engine/scenes";
import type { MidiBindings } from "./useMidiControl";

/**
 * "Show" file = everything that otherwise only lives in this browser's
 * localStorage: the scene bank, the MIDI mappings, and the two UI settings
 * worth keeping. Export before the gig, import on whatever laptop/profile
 * ends up on stage. Plain JSON so it can be versioned in the repo too.
 */
export const SHOW_FILE_VERSION = 1;

export interface ShowFile {
  version: typeof SHOW_FILE_VERSION;
  exportedAt: string;
  scenes: (Scene | null)[];
  midi: MidiBindings;
  settings: { sceneFadeMs: number; bpmFlashVisibility: number };
}

export function downloadShowFile(file: ShowFile) {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `floraluz-show-${file.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function pickShowFile(): Promise<ShowFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return resolve(null);
      try {
        const parsed = JSON.parse(await f.text()) as Partial<ShowFile>;
        if (parsed.version !== SHOW_FILE_VERSION || !Array.isArray(parsed.scenes) || typeof parsed.midi !== "object") {
          throw new Error("formato inválido");
        }
        resolve(parsed as ShowFile);
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}
