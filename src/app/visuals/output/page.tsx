"use client";

/**
 * floraluz live-visuals — clean output view.
 *
 * No panel, no sliders — just the canvas, full screen, black background.
 * This is what goes on the projector. Open it in its own window (the
 * control page has an "abrir salida" button that does this for you), drag
 * that window onto the extended display, and fullscreen it there. It has no
 * audio/MIDI logic of its own — it just renders whatever LightState the
 * control window broadcasts over BroadcastChannel.
 */
import { useEffect, useRef } from "react";
import { createDefaultLightState, type Frame } from "@engine/types";
import { createWebglRenderer, type WebglRenderer } from "@renderers/webgl/renderer";
import { VISUALS_CHANNEL, type VisualsFrameMessage } from "../broadcast";

export default function VisualsOutputPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashElRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<Frame>({ state: createDefaultLightState(), beatPulse: 0, chasePhase: 0 });

  useEffect(() => {
    const channel = new BroadcastChannel(VISUALS_CHANNEL);
    channel.onmessage = (e: MessageEvent<VisualsFrameMessage>) => {
      frameRef.current = e.data;
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer: WebglRenderer = createWebglRenderer(canvas);

    let raf = 0;
    const loop = (t: number) => {
      renderer.draw(frameRef.current, t);
      if (flashElRef.current) flashElRef.current.style.opacity = String(frameRef.current.beatPulse);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div
        ref={flashElRef}
        className="pointer-events-none absolute right-6 top-6 h-16 w-16 rounded-full bg-white"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
