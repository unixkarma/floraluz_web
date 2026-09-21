"use client";

import { useEffect, useRef, useState } from "react";
import type { VisualsFrameMessage } from "./broadcast";

/**
 * WebSocket link from the control page to tools/artnet-bridge (the Node
 * process that owns the UDP socket and talks Art-Net to the WLED tubes).
 * Auto-reconnects every 2s so you can start the bridge before or after the
 * page. `send` is a stable ref-backed function safe to call from the rAF
 * loop; it drops frames while disconnected or while the socket buffer is
 * backing up (a stalled bridge must never stall the render loop).
 */
export const BRIDGE_URL = "ws://localhost:9500";

export function useBridge() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let disposed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const open = () => {
      if (disposed) return;
      const ws = new WebSocket(BRIDGE_URL);
      socketRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        socketRef.current = null;
        if (!disposed) retry = setTimeout(open, 2000);
      };
      ws.onerror = () => ws.close();
    };
    open();

    return () => {
      disposed = true;
      clearTimeout(retry);
      socketRef.current?.close();
    };
  }, []);

  const send = (frame: VisualsFrameMessage) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || ws.bufferedAmount > 64 * 1024) return;
    ws.send(JSON.stringify(frame));
  };

  return { connected, send };
}
