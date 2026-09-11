/**
 * Phase-1 WebGL renderer: draws each zone as a vertical bar whose color/
 * brightness comes straight from `LightState`. No effects engine yet
 * (chase/movement land with the audio + performer layers in phases 2-3) —
 * this exists to prove the state -> pixels path and give the debug UI
 * something to look at.
 */
import type { LightState } from "../../engine/types";

const VERTEX_SRC = `
  attribute vec2 a_position;
  uniform vec2 u_offset;
  uniform vec2 u_scale;
  void main() {
    vec2 pos = a_position * u_scale + u_offset;
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision mediump float;
  uniform vec3 u_color;
  void main() {
    gl_FragColor = vec4(u_color, 1.0);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${info}`);
  }
  return shader;
}

/** HSV (0-1 each) -> RGB (0-1 each). */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

export interface WebglRenderer {
  draw(state: LightState, tNowMs: number): void;
  dispose(): void;
}

export function createWebglRenderer(canvas: HTMLCanvasElement): WebglRenderer {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL not supported on this canvas");

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SRC));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  // Unit quad, -1..1 on both axes; scaled/offset per zone at draw time.
  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const offsetLoc = gl.getUniformLocation(program, "u_offset");
  const scaleLoc = gl.getUniformLocation(program, "u_scale");
  const colorLoc = gl.getUniformLocation(program, "u_color");

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    }
    gl!.viewport(0, 0, canvas.width, canvas.height);
  }

  function draw(state: LightState, tNowMs: number) {
    resize();
    const { bus, zones } = state;

    // Strobe: hard on/off flicker gated by u_strobe, frequency scales with the param.
    const strobeOn =
      bus.strobe <= 0 || Math.sin((tNowMs / 1000) * (2 + bus.strobe * 28) * Math.PI * 2) > 0;

    gl!.clearColor(0, 0, 0, 1);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    if (bus.blackout || !strobeOn) return;

    const n = zones.length || 1;
    const gutter = 0.04;
    const cellWidth = 2 / n;

    zones.forEach((zone, i) => {
      const [r, g, b] = hsvToRgb(zone.hue, zone.saturation, 1);
      const level = zone.intensity * bus.master;
      const cx = -1 + cellWidth * (i + 0.5);

      gl!.uniform2f(offsetLoc, cx, 0);
      gl!.uniform2f(scaleLoc, cellWidth / 2 - gutter, 1);
      gl!.uniform3f(colorLoc, r * level, g * level, b * level);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    });
  }

  return {
    draw,
    dispose() {
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    },
  };
}
