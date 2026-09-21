/**
 * Art-Net ArtDmx packet builder. Pure — no sockets — so it can be unit
 * tested and reused by whatever process ends up owning the UDP socket
 * (tools/artnet-bridge today, Electron main later).
 *
 * Art-Net 4 ArtDmx layout (all multi-byte fields little-endian unless noted):
 *   0-7   "Art-Net\0"
 *   8-9   OpCode 0x5000
 *   10-11 ProtVer 14 (big-endian)
 *   12    Sequence (1-255, 0 = disabled)
 *   13    Physical
 *   14    SubUni (universe low byte)
 *   15    Net (universe high 7 bits)
 *   16-17 Length (big-endian, 2-512, even)
 *   18..  DMX data
 */
export const ARTNET_PORT = 6454;
export const DMX_CHANNELS = 512;
/** Whole RGB pixels that fit in one universe (170 * 3 = 510). */
export const PIXELS_PER_UNIVERSE = 170;

const HEADER = new Uint8Array([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x00, 0x0e]);

export function buildArtDmx(universe: number, data: Uint8Array, sequence = 0): Uint8Array {
  const len = Math.min(DMX_CHANNELS, Math.max(2, data.length + (data.length % 2)));
  const pkt = new Uint8Array(18 + len);
  pkt.set(HEADER, 0);
  pkt[12] = sequence & 0xff;
  pkt[13] = 0;
  pkt[14] = universe & 0xff;
  pkt[15] = (universe >> 8) & 0x7f;
  pkt[16] = (len >> 8) & 0xff;
  pkt[17] = len & 0xff;
  pkt.set(data.subarray(0, Math.min(data.length, len)), 18);
  return pkt;
}

/**
 * Split a flat RGB buffer into consecutive universes starting at
 * `startUniverse`, 170 pixels each — matches WLED's "Multi RGB" DMX mode.
 */
export function rgbToArtDmxPackets(rgb: Uint8Array, startUniverse: number, sequence = 0): Uint8Array[] {
  const pixels = Math.floor(rgb.length / 3);
  const packets: Uint8Array[] = [];
  for (let u = 0, px = 0; px < pixels; u++, px += PIXELS_PER_UNIVERSE) {
    const count = Math.min(PIXELS_PER_UNIVERSE, pixels - px);
    packets.push(buildArtDmx(startUniverse + u, rgb.subarray(px * 3, (px + count) * 3), sequence));
  }
  return packets;
}
