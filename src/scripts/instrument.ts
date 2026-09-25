// The hero instrument. One canvas, redrawn only when something changes:
// the contour map of f, a gradient descent run, a crosshair readout, and a
// scroll-driven tilt that lifts every contour to its own height so the map
// becomes a wireframe valley. No libraries; a small orthographic-plus-
// perspective projection is enough for lines.
import { f, fromUnit, toUnit, step, height, START } from '../lib/fn.js';

type Line = [number, number][];
type Data = { lines: { level: number; lines: Line[] }[]; end: [number, number] };

const INK = '#000';
const BLUE = '#3335ff';
const MESH = 16; // wireframe grid divisions
const MESH_SAMPLES = 40;
const LIFT = 0.44; // surface height at full tilt, in map widths
const PITCH = 0.98; // radians at full tilt (~56°)
const YAW = -0.3;
const CAMERA = 2.6; // perspective distance, in map widths

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n: number, d = 4) => (Math.abs(n) >= 1000 ? n.toExponential(2) : n.toFixed(d));

export function mountInstrument(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const readout = root.querySelector<HTMLElement>('[data-readout]')!;
  const kEl = root.querySelector<HTMLElement>('[data-k]')!;
  const lossEl = root.querySelector<HTMLElement>('[data-loss]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const data: Data = JSON.parse(root.querySelector('[data-instrument-data]')!.textContent || '{}');
  const ctx = canvas.getContext('2d')!;
  const hero = root.closest<HTMLElement>('[data-hero]');

  // Contours carry their height once; the mesh heights are precomputed.
  const contours = data.lines.map((l) => ({ h: height(l.level), lines: l.lines }));
  const meshH: number[][] = [];
  for (let i = 0; i <= MESH; i++) {
    meshH[i] = [];
    for (let j = 0; j <= MESH_SAMPLES; j++) meshH[i][j] = height(f(...fromUnit(i / MESH, j / MESH_SAMPLES)));
  }
  const meshV: number[][] = [];
  for (let j = 0; j <= MESH; j++) {
    meshV[j] = [];
    for (let i = 0; i <= MESH_SAMPLES; i++) meshV[j][i] = height(f(...fromUnit(i / MESH_SAMPLES, j / MESH)));
  }

  let size = 0;
  let dpr = 1;
  let tilt = 0; // 0 = flat map, 1 = full 3D
  let pointer: { u: number; v: number } | null = null;

  // Current run: unit coordinates + heights, and how much of it is drawn.
  let run: { u: number; v: number; h: number; f: number }[] = [];
  let shown = 0; // iterations revealed (float)
  let runStart = 0;
  let runDuration = 0;
  let animating = false;

  const project = (u: number, v: number, h: number): [number, number] => {
    const t = tilt;
    const X = u - 0.5, Y = 0.5 - v, Z = h * LIFT * t;
    const yaw = YAW * t, pitch = PITCH * t;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const X1 = X * cy - Y * sy, Y1 = X * sy + Y * cy;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const Y2 = Y1 * cp + Z * sp, Z2 = -Y1 * sp + Z * cp;
    const s = (t === 0 ? 1 : CAMERA / (CAMERA - Z2)) * (1 - 0.14 * t); // shrink a little so the raised rim stays inside the frame
    const drop = 0.07 * t; // keep the tilted surface optically centred
    return [(0.5 + X1 * s) * size, (0.5 - Y2 * s + drop) * size];
  };

  const unproject = (px: number, py: number) => ({ u: px / size, v: py / size });

  function computeRun(start: [number, number]) {
    const pts: [number, number][] = [start];
    let p = start;
    for (let k = 0; k < 4000; k++) {
      const { p: q, g } = step(p);
      pts.push(q);
      p = q;
      if (f(...q) < 2e-4 || g < 1e-5) break;
    }
    return pts.map(([x, y]) => {
      const [u, v] = toUnit(x, y);
      const fx = f(x, y);
      return { u, v, h: height(fx), f: fx };
    });
  }

  function startRun(start: [number, number], animate = true) {
    run = computeRun(start);
    const n = run.length - 1;
    if (!animate || reduced()) {
      shown = n;
      animating = false;
      updateCounter();
      render();
      return;
    }
    shown = 0;
    runStart = performance.now();
    runDuration = Math.min(4200, Math.max(1600, 400 + n * 9));
    animating = true;
    tick();
  }

  function updateCounter() {
    const i = Math.min(run.length - 1, Math.floor(shown));
    kEl.textContent = String(i);
    lossEl.textContent = run[i] ? fmt(run[i].f) : '—';
  }

  function tick() {
    if (!animating) return;
    const n = run.length - 1;
    const p = Math.min(1, (performance.now() - runStart) / runDuration);
    // Iterations appear at a steady pace; the geometry itself shows the
    // steps shrinking as the gradient flattens.
    shown = p * n;
    updateCounter();
    render();
    if (p < 1) requestAnimationFrame(tick);
    else animating = false;
  }

  function resize() {
    const w = stage.clientWidth;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    size = w;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * dpr);
    render();
  }

  let frame = 0;
  function render() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      draw();
    });
  }

  function polyline(pts: [number, number][], hOf: (i: number) => number) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = project(pts[i][0], pts[i][1], hOf(i));
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Wireframe mesh: fades in with the tilt.
    if (tilt > 0.02) {
      ctx.strokeStyle = `rgba(0,0,0,${(0.13 * tilt).toFixed(3)})`;
      ctx.lineWidth = 1;
      const col: [number, number][] = Array.from({ length: MESH_SAMPLES + 1 }, () => [0, 0]);
      for (let i = 0; i <= MESH; i++) {
        for (let j = 0; j <= MESH_SAMPLES; j++) { col[j][0] = i / MESH; col[j][1] = j / MESH_SAMPLES; }
        polyline(col, (j) => meshH[i][j]);
      }
      for (let j = 0; j <= MESH; j++) {
        for (let i = 0; i <= MESH_SAMPLES; i++) { col[i][0] = i / MESH_SAMPLES; col[i][1] = j / MESH; }
        polyline(col, (i) => meshV[j][i]);
      }
    }

    // Contours, each lifted to its level.
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    for (const c of contours) for (const ln of c.lines) polyline(ln, () => c.h);

    // Crosshair on the flat map only.
    if (pointer && tilt < 0.04) {
      const [px, py] = [pointer.u * size, pointer.v * size];
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(px) + 0.5, 0); ctx.lineTo(Math.round(px) + 0.5, size);
      ctx.moveTo(0, Math.round(py) + 0.5); ctx.lineTo(size, Math.round(py) + 0.5);
      ctx.stroke();
    }

    if (!run.length) return;
    const n = run.length - 1;
    const upto = Math.min(n, shown);
    const whole = Math.floor(upto);

    // The path, drawn up to the current iterate (with the partial step).
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, size, size); ctx.clip();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= whole; i++) {
      const [x, y] = project(run[i].u, run[i].v, run[i].h);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    if (whole < n) {
      const a = run[whole], b = run[whole + 1], t = upto - whole;
      const [x, y] = project(a.u + (b.u - a.u) * t, a.v + (b.v - a.v) * t, a.h + (b.h - a.h) * t);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Step marks: every k-th iterate, so strides read long then short.
    const every = Math.max(1, Math.round(n / 20));
    ctx.fillStyle = INK;
    for (let i = 0; i <= whole; i += every) {
      if (i === n) break;
      const [x, y] = project(run[i].u, run[i].v, run[i].h);
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    }

    // The minimum: the one blue mark, once the run arrives.
    if (whole >= n) {
      const [x, y] = project(run[n].u, run[n].v, run[n].h);
      ctx.fillStyle = BLUE;
      ctx.fillRect(Math.round(x - 6), Math.round(y - 6), 12, 12);
    }
    ctx.restore();
  }

  // Pointer: crosshair and a precision readout beside the cursor.
  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    if (tilt >= 0.04 || px < 0 || py < 0 || px > r.width || py > r.height) return onLeave();
    pointer = unproject(px, py);
    const [x, y] = fromUnit(pointer.u, pointer.v);
    readout.textContent = `x ${x >= 0 ? ' ' : ''}${x.toFixed(3)}   y ${y >= 0 ? ' ' : ''}${y.toFixed(3)}\nf ${fmt(f(x, y))}`;
    readout.hidden = false;
    const w = readout.offsetWidth, h = readout.offsetHeight;
    const ox = px + 14 + w > r.width ? px - 14 - w : px + 14;
    const oy = py + 14 + h > r.height ? py - 14 - h : py + 14;
    readout.style.transform = `translate(${Math.round(ox)}px, ${Math.round(oy)}px)`;
    render();
  }
  function onLeave() {
    if (!pointer) return;
    pointer = null;
    readout.hidden = true;
    render();
  }
  function onClick(e: MouseEvent) {
    if (tilt >= 0.04) return;
    const r = canvas.getBoundingClientRect();
    const { u, v } = unproject(e.clientX - r.left, e.clientY - r.top);
    // Keep the first strides inside the plot: start no closer than 15% to an edge.
    const cl = (n: number) => Math.min(0.85, Math.max(0.15, n));
    hint.textContent = 'Descending from your point.';
    startRun(fromUnit(cl(u), cl(v)));
    window.dataLayer?.push({ event: 'instrument_descent' });
  }
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  // `click`, not pointerup: a touch that scrolls the page must not start a run.
  canvas.addEventListener('click', onClick);

  // Scroll tilt. Desktop pins the hero (CSS) and maps its scroll progress to
  // a rise-and-settle; on narrow screens the tilt follows the stage's
  // position in the viewport.
  const wide = matchMedia('(min-width: 60.01rem)');
  function updateTilt() {
    if (reduced()) { tilt = 0; return; }
    let t = 0;
    if (wide.matches && hero) {
      const r = hero.getBoundingClientRect();
      const pin = hero.firstElementChild as HTMLElement;
      const travel = r.height - pin.offsetHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      t = Math.sin(Math.PI * p);
    } else {
      const r = stage.getBoundingClientRect();
      const c = (r.top + r.height / 2) / innerHeight;
      const p = Math.min(1, Math.max(0, (0.55 - c) / 0.95));
      t = Math.sin(Math.PI * p);
    }
    t = t * t * (3 - 2 * t); // smoothstep: settle gently at both ends
    if (Math.abs(t - tilt) > 0.001) {
      tilt = t;
      if (tilt >= 0.04) onLeave();
      render();
    }
  }
  addEventListener('scroll', updateTilt, { passive: true });
  wide.addEventListener('change', updateTilt);

  new ResizeObserver(resize).observe(stage);
  resize();
  updateTilt();

  // The first run plays once by itself when the instrument is on screen.
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    setTimeout(() => startRun(START), 300);
  }, { threshold: 0.35 });
  run = computeRun(START);
  shown = 0;
  updateCounter();
  if (reduced()) startRun(START, false);
  else io.observe(stage);
}

declare global {
  interface Window { dataLayer?: unknown[] }
}
