/**
 * Shared channel name so the control window (full audio/MIDI/engine logic)
 * and the clean output window (projector — canvas only, no panel) agree on
 * the same live LightState via BroadcastChannel. Same-origin only, which is
 * fine — both are routes of this app.
 */
export const VISUALS_CHANNEL = "floraluz-visuals";

export interface VisualsFrameMessage {
  state: import("@engine/types").LightState;
  beatPulse: number;
}
