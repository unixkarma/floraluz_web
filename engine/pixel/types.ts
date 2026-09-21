/**
 * Pixel-strip layout for the DIY tubes (WS2811/WS2812 strips inside a
 * diffuser tube, driven by an ESP32 running WLED via Art-Net). Pure data —
 * the renderer in ./render.ts turns a LightState into one RGB byte triplet
 * per pixel following this layout, and renderers/artnet packs that into
 * DMX universes.
 */
export interface PixelLayout {
  /** How many tubes are wired in series on the controller. */
  tubes: number;
  /** Pixels per tube (WS2811 12V 30/m -> 30, WS2812B 60/m -> 60). */
  pixelsPerTube: number;
  /**
   * Which LightState zone each tube shows. Index into `state.zones`; tubes
   * beyond the array length wrap with `i % zones.length`. Default: tube i
   * = zone i, so with the 4-zone audio mapping tubes are bpm/low/mid/high.
   */
  zoneOfTube?: number[];
  /**
   * Tubes wired "upside down" (data-in at the top) so the VU fill still
   * grows from the floor. Index list.
   */
  flipped?: number[];
  /** Output gamma. LED strips look washed out without ~2.2. */
  gamma?: number;
}

export const DEFAULT_PIXEL_LAYOUT: PixelLayout = {
  tubes: 4,
  pixelsPerTube: 30,
  gamma: 2.2,
};

export function pixelCount(layout: PixelLayout): number {
  return layout.tubes * layout.pixelsPerTube;
}
