/**
 * Art-Net bridge for the pixel tubes.
 *
 * The browser can't send UDP, so the /visuals control page streams its
 * per-frame {state, beatPulse} over a local WebSocket to this process,
 * which renders the pixel buffer (engine/pixel) and fires Art-Net at the
 * WLED controller. Runs on the show laptop next to `next dev`:
 *
 *   WLED_IP=192.168.4.1 TUBES=4 PPT=30 npm run bridge
 *
 * Env:
 *   WLED_IP     controller address (default 4.3.2.1 = WLED AP mode)
 *   TUBES       tubes in series (default 4)
 *   PPT         pixels per tube (default 30)
 *   UNIVERSE    first Art-Net universe, must match WLED (default 0)
 *   FPS         output rate (default 40; WLED is happy at 40-60)
 *   WS_PORT     WebSocket port (default 9500)
 *   FLIPPED     comma list of tubes wired top-down, e.g. "1,3"
 *
 * Keeps sending the last frame if the page stops (so tubes don't freeze in
 * a random state if the tab hiccups), goes black after 2s of silence.
 */
import dgram from "node:dgram";
import { WebSocketServer } from "ws";
import type { Frame } from "../../engine/types";
import { pixelCount, renderPixels, type PixelLayout } from "../../engine/pixel";
import { ARTNET_PORT, rgbToArtDmxPackets } from "../../renderers/artnet/packet";

const env = (k: string, d: string) => process.env[k] ?? d;
const WLED_IP = env("WLED_IP", "4.3.2.1");
const UNIVERSE = Number(env("UNIVERSE", "0"));
const FPS = Number(env("FPS", "40"));
const WS_PORT = Number(env("WS_PORT", "9500"));
const layout: PixelLayout = {
  tubes: Number(env("TUBES", "4")),
  pixelsPerTube: Number(env("PPT", "30")),
  flipped: env("FLIPPED", "")
    .split(",")
    .filter(Boolean)
    .map(Number),
  gamma: 2.2,
};

let latest: Frame | null = null;
let lastFrameAt = 0;
let sequence = 1;
const rgb = new Uint8Array(pixelCount(layout) * 3);
const sock = dgram.createSocket("udp4");
const t0 = performance.now();

const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => {
  console.log("[bridge] control page connected");
  ws.on("message", (raw) => {
    try {
      latest = JSON.parse(raw.toString()) as Frame;
      lastFrameAt = performance.now();
    } catch {
      /* ignore malformed */
    }
  });
  ws.on("close", () => console.log("[bridge] control page disconnected"));
});

function send(buf: Uint8Array) {
  const packets = rgbToArtDmxPackets(buf, UNIVERSE, sequence);
  sequence = (sequence % 255) + 1;
  for (const p of packets) sock.send(p, ARTNET_PORT, WLED_IP);
}

setInterval(() => {
  const now = performance.now();
  if (!latest || now - lastFrameAt > 2000) {
    rgb.fill(0);
    send(rgb);
    return;
  }
  renderPixels(latest, (now - t0) / 1000, layout, rgb);
  send(rgb);
}, 1000 / FPS);

console.log(
  `[bridge] ws://localhost:${WS_PORT} -> artnet ${WLED_IP}:${ARTNET_PORT} ` +
    `universe ${UNIVERSE}+, ${layout.tubes}×${layout.pixelsPerTube}px @ ${FPS}fps`,
);
