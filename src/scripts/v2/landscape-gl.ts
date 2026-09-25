// The Descent: a live loss landscape in raw WebGL. Two draw calls per frame:
// the wireframe terrain (static geometry, "breathing" in the shader) and the
// particle streaks (CPU-integrated stochastic gradient descent on the real
// field, uploaded each frame as line segments). No library.
import { f, grad, HALF, globalMin } from '../../lib/landscape.js';

export type Tier = 'full' | 'lite';
export type Readout = { k: number; f: number; g: number; n: number };

const HEIGHT = 0.62; // world units per unit of f
const FOV = (38 * Math.PI) / 180;

// ---------- small matrix helpers (column-major) ----------
type M4 = Float32Array;
const m4 = () => new Float32Array(16);
function perspective(out: M4, fovy: number, aspect: number, near: number, far: number) {
  const t = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  out.fill(0);
  out[0] = t / aspect; out[5] = t; out[10] = (far + near) * nf; out[11] = -1; out[14] = 2 * far * near * nf;
  return out;
}
function lookAt(out: M4, e: number[], c: number[], up = [0, 1, 0]) {
  let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2];
  let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
  let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx;
  l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  out.set([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
    -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
  return out;
}
function mul(out: M4, a: M4, b: M4) {
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
    out[i * 4 + j] = s;
  }
  return out;
}
function invert(out: M4, m: M4) {
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m;
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  const det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
  out.set([
    (a11 * b11 - a12 * b10 + a13 * b09) * det, (a02 * b10 - a01 * b11 - a03 * b09) * det, (a31 * b05 - a32 * b04 + a33 * b03) * det, (a22 * b04 - a21 * b05 - a23 * b03) * det,
    (a12 * b08 - a10 * b11 - a13 * b07) * det, (a00 * b11 - a02 * b08 + a03 * b07) * det, (a32 * b02 - a30 * b05 - a33 * b01) * det, (a20 * b05 - a22 * b02 + a23 * b01) * det,
    (a10 * b10 - a11 * b08 + a13 * b06) * det, (a01 * b08 - a00 * b10 - a03 * b06) * det, (a30 * b04 - a31 * b02 + a33 * b00) * det, (a21 * b02 - a20 * b04 - a23 * b00) * det,
    (a11 * b07 - a10 * b09 - a12 * b06) * det, (a00 * b09 - a01 * b07 + a02 * b06) * det, (a31 * b01 - a30 * b03 - a32 * b00) * det, (a20 * b03 - a21 * b01 + a22 * b00) * det,
  ]);
  return out;
}

const VERT = `
attribute vec3 p;
uniform mat4 mvp;
uniform float zs;
uniform vec3 eye;
varying float d;
void main() {
  vec3 q = vec3(p.x, p.y * zs, p.z);
  d = distance(q, eye);
  gl_Position = mvp * vec4(q, 1.0);
}`;
const FRAG = `
precision mediump float;
uniform vec4 col;
uniform float far;
varying float d;
void main() {
  float a = col.a * clamp(1.35 - d / far, 0.12, 1.0);
  gl_FragColor = vec4(col.rgb * a, a);
}`;

// World coordinates: x → x, height → y (up), domain y → −z.
const W = (x: number, y: number, h: number): [number, number, number] => [x, h * HEIGHT, -y];

// `flat`: the closing view. The same landscape, optimised almost flat, with a
// few calm particles and a slow fixed orbit.
export function createLandscape(canvas: HTMLCanvasElement, opts: { tier: Tier; staticFrame?: boolean; flat?: boolean; particles?: number }) {
  const FLAT = opts.flat ? 0.14 : 1;
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return null;

  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const aP = gl.getAttribLocation(prog, 'p');
  const uMvp = gl.getUniformLocation(prog, 'mvp');
  const uZs = gl.getUniformLocation(prog, 'zs');
  const uEye = gl.getUniformLocation(prog, 'eye');
  const uCol = gl.getUniformLocation(prog, 'col');
  const uFar = gl.getUniformLocation(prog, 'far');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // ---------- terrain wireframe ----------
  const N = opts.tier === 'full' ? 64 : 40, S = opts.tier === 'full' ? 96 : 56;
  const terrain: number[] = [];
  const line = (pts: [number, number][]) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      terrain.push(...W(x0, y0, f(x0, y0)), ...W(x1, y1, f(x1, y1)));
    }
  };
  for (let i = 0; i <= N; i++) {
    const a = -HALF + (2 * HALF * i) / N;
    line(Array.from({ length: S + 1 }, (_, j) => [a, -HALF + (2 * HALF * j) / S] as [number, number]));
    line(Array.from({ length: S + 1 }, (_, j) => [-HALF + (2 * HALF * j) / S, a] as [number, number]));
  }
  const terrainBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, terrainBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(terrain), gl.STATIC_DRAW);
  const terrainCount = terrain.length / 3;

  // ---------- particles ----------
  const baseCount = opts.particles ?? (opts.flat ? (opts.tier === 'full' ? 700 : 300) : opts.tier === 'full' ? 4200 : 1400);
  let count = baseCount;
  const MAX = 6000;
  const px = new Float32Array(MAX), py = new Float32Array(MAX), vx = new Float32Array(MAX), vy = new Float32Array(MAX);
  const age = new Float32Array(MAX), still = new Float32Array(MAX);
  const seg = new Float32Array(MAX * 6);
  const partBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, partBuf);
  gl.bufferData(gl.ARRAY_BUFFER, seg.byteLength, gl.DYNAMIC_DRAW); // allocated once
  let lead = { k: 0 };
  let cursor = 1;
  const spawn = (i: number, x?: number, y?: number) => {
    px[i] = x ?? (Math.random() * 2 - 1) * HALF * 0.98;
    py[i] = y ?? (Math.random() * 2 - 1) * HALF * 0.98;
    vx[i] = vy[i] = 0; age[i] = 0; still[i] = 0;
    if (i === 0) lead.k = 0;
  };
  for (let i = 0; i < MAX; i++) { spawn(i); age[i] = Math.random() * 6; }

  const [gx0, gy0, gf0] = globalMin();
  const minWorld = W(gx0, gy0, gf0);

  // ---------- camera ----------
  const proj = m4(), view = m4(), vp = m4(), inv = m4();
  let eye = [0, 0, 0];
  let progress = 0;
  let time = 0;
  let width = 1, height = 1, dpr = 1;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function camera() {
    if (opts.flat) {
      const az = 0.5 + time * 0.012, dist = 7.6, elev = (24 * Math.PI) / 180;
      eye = [dist * Math.cos(elev) * Math.sin(az), -0.2 + dist * Math.sin(elev), dist * Math.cos(elev) * Math.cos(az)];
      perspective(proj, FOV, width / height, 0.05, 40);
      lookAt(view, eye, [0, -0.2, 0]);
      mul(vp, proj, view);
      invert(inv, vp);
      return dist;
    }
    // From a high overview slowly orbiting, down into the global basin.
    const p = ease(Math.min(1, Math.max(0, (progress - 0.04) / 0.9)));
    const az = 0.62 + time * 0.018 * (1 - p) + p * 0.35;
    const dist = 8.4 + (2.3 - 8.4) * p;
    const elev = (33 + (58 - 33) * p) * (Math.PI / 180);
    const tx = minWorld[0] * p, ty = (minWorld[1] - 0.15) * p - 0.25 * (1 - p), tz = minWorld[2] * p;
    eye = [tx + dist * Math.cos(elev) * Math.sin(az), ty + dist * Math.sin(elev), tz + dist * Math.cos(elev) * Math.cos(az)];
    perspective(proj, FOV, width / height, 0.05, 40);
    lookAt(view, eye, [tx, ty, tz]);
    mul(vp, proj, view);
    invert(inv, vp);
    return dist;
  }

  // Pointer → domain point on the mid-height plane.
  let pointer: { x: number; y: number; active: boolean } = { x: 0, y: 0, active: false };
  function toDomain(clientX: number, clientY: number) {
    const r = canvas.getBoundingClientRect();
    const nx = ((clientX - r.left) / r.width) * 2 - 1, ny = -(((clientY - r.top) / r.height) * 2 - 1);
    const un = (z: number) => {
      const v = [nx, ny, z, 1];
      const o = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) o[i] = inv[i] * v[0] + inv[4 + i] * v[1] + inv[8 + i] * v[2] + inv[12 + i] * v[3];
      return [o[0] / o[3], o[1] / o[3], o[2] / o[3]];
    };
    const a = un(-1), b = un(1);
    const plane = -0.1 * HEIGHT;
    const t = (plane - a[1]) / (b[1] - a[1]);
    if (!isFinite(t) || t < 0) return null;
    const wx = a[0] + (b[0] - a[0]) * t, wz = a[2] + (b[2] - a[2]) * t;
    if (!Number.isFinite(wx) || !Number.isFinite(wz)) return null;
    return { x: wx, y: -wz };
  }

  function step(dt: number) {
    const eta = opts.flat ? 0.28 : 0.55, noise = 0.05 * Math.sqrt(dt);
    const R = 0.75, push = 2.2;
    for (let i = 0; i < count; i++) {
      let x = px[i], y = py[i];
      const [gx, gy] = grad(x, y);
      let dx = -eta * gx * dt + (Math.random() - 0.5) * noise;
      let dy = -eta * gy * dt + (Math.random() - 0.5) * noise;
      if (pointer.active) {
        const ox = x - pointer.x, oy = y - pointer.y, d = Math.hypot(ox, oy);
        if (d < R && d > 1e-4) {
          const k = (1 - d / R) ** 2 * push * dt;
          // Bend around the cursor: radial push plus a tangential swirl.
          dx += (ox / d) * k + (-oy / d) * k * 0.6;
          dy += (oy / d) * k + (ox / d) * k * 0.6;
        }
      }
      x += dx; y += dy;
      const sp = Math.hypot(dx, dy) / dt;
      vx[i] = vx[i] * 0.6 + (dx / dt) * 0.4;
      vy[i] = vy[i] * 0.6 + (dy / dt) * 0.4;
      age[i] += dt;
      still[i] = sp < 0.03 ? still[i] + dt : 0;
      if (i === 0) lead.k++;
      if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > HALF || Math.abs(y) > HALF || still[i] > 1.2 || age[i] > 14) { spawn(i); continue; }
      px[i] = x; py[i] = y;
    }
  }

  function fillSegments(zs: number) {
    // Streak from the current position back along the velocity.
    const tail = 0.16;
    for (let i = 0; i < count; i++) {
      const x = px[i], y = py[i];
      const bx = x - vx[i] * tail, by = y - vy[i] * tail;
      const o = i * 6;
      const lift = 0.012; // sit just above the surface
      seg[o] = x; seg[o + 1] = f(x, y) * HEIGHT + lift / zs; seg[o + 2] = -y;
      seg[o + 3] = bx; seg[o + 4] = f(bx, by) * HEIGHT + lift / zs; seg[o + 5] = -by;
    }
  }

  let lineRGB = [0.969, 0.969, 0.969];
  let lastZs = 1;
  let fade = 1;
  function draw() {
    const far = camera();
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    const zs = (lastZs = (1 + 0.045 * Math.sin(time * 0.7)) * FLAT); // breathing
    gl!.uniformMatrix4fv(uMvp, false, vp);
    gl!.uniform1f(uZs, zs);
    gl!.uniform3fv(uEye, eye);
    gl!.uniform1f(uFar, far * 1.9);

    gl!.bindBuffer(gl!.ARRAY_BUFFER, terrainBuf);
    gl!.enableVertexAttribArray(aP);
    gl!.vertexAttribPointer(aP, 3, gl!.FLOAT, false, 0, 0);
    gl!.uniform4f(uCol, lineRGB[0], lineRGB[1], lineRGB[2], (opts.tier === 'full' ? 0.34 : 0.4) * fade);
    gl!.drawArrays(gl!.LINES, 0, terrainCount);

    if (count === 0) return;
    fillSegments(zs);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, partBuf);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, seg.subarray(0, count * 6));
    gl!.vertexAttribPointer(aP, 3, gl!.FLOAT, false, 0, 0);
    gl!.uniform4f(uCol, lineRGB[0], lineRGB[1], lineRGB[2], 0.95 * fade);
    gl!.drawArrays(gl!.LINES, 0, count * 2);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(opts.tier === 'full' ? 2 : 1.5, window.devicePixelRatio || 1);
    width = Math.max(1, r.width); height = Math.max(1, r.height);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  }

  // ---------- loop with adaptive load ----------
  let running = false, last = 0, raf = 0, slow = 0;
  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
    last = now;
    time += dt;
    step(dt);
    draw();
    // If frames run long for a sustained stretch, halve the particles.
    // Sustained long frames halve the particles; a sustained fast stretch
    // restores them, so one hitch does not cost the session its detail.
    slow = dt > 1 / 45 ? slow + 1 : slow - 1;
    if (slow > 90 && count > 600 && baseCount > 0) { count = Math.round(count / 2); slow = 0; }
    else if (slow < -240 && count < baseCount) { count = Math.min(baseCount, count * 2); slow = 0; }
    raf = requestAnimationFrame(frame);
  }

  resize();
  if (opts.staticFrame) {
    // Reduced motion: settle the field silently, then draw one still frame
    // in which each streak is a stretch of its real descent path.
    for (let s = 0; s < 90; s++) step(1 / 30);
    draw();
  }

  return {
    minWorld,
    start() { if (running || opts.staticFrame) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize() { resize(); if (!running) draw(); },
    setProgress(p: number) { progress = p; if (!running) draw(); },
    setInk(rgb: [number, number, number], alpha = 1) { lineRGB = rgb; fade = alpha; if (!running) draw(); },
    pointerMove(cx: number, cy: number) {
      const d = toDomain(cx, cy);
      pointer = d ? { ...d, active: Math.abs(d.x) < HALF + 0.5 && Math.abs(d.y) < HALF + 0.5 } : { x: 0, y: 0, active: false };
      return pointer.active ? pointer : null;
    },
    pointerLeave() { pointer.active = false; },
    burst(cx: number, cy: number, n = 360) {
      const d = toDomain(cx, cy);
      if (!d) return;
      // Recycle particles round-robin (index 0 is the readout's lead).
      for (let j = 0; j < n; j++) {
        if (count < 2) return;
        cursor = 1 + ((cursor - 1 + 1) % (count - 1));
        const i = cursor; const r = Math.sqrt(Math.random()) * 0.28, t = Math.random() * Math.PI * 2; spawn(i, d.x + r * Math.cos(t), d.y + r * Math.sin(t)); }
    },
    readout(): Readout {
      if (!Number.isFinite(px[0]) || !Number.isFinite(py[0])) spawn(0);
      const [gx, gy] = grad(px[0], py[0]);
      return { k: lead.k, f: f(px[0], py[0]), g: Math.hypot(gx, gy), n: count };
    },
    /** Screen position of the global minimum (CSS px, relative to the canvas). */
    minOnScreen() {
      const v = [minWorld[0], minWorld[1] * lastZs, minWorld[2], 1], o = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) o[i] = vp[i] * v[0] + vp[4 + i] * v[1] + vp[8 + i] * v[2] + vp[12 + i];
      return { x: ((o[0] / o[3] + 1) / 2) * width, y: ((1 - o[1] / o[3]) / 2) * height, visible: o[3] > 0 };
    },
  };
}
