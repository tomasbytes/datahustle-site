// Four small instruments, one per service. Each proves its point by letting
// the visitor move the variable that matters. Drawn in SVG lines; blue marks
// only the optimum or the choice.
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag: string, attrs: Record<string, string | number> = {}, parent?: Element) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent?.appendChild(e);
  return e;
};
function rng(s: number) {
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const gauss = (r: () => number) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const W = 480, H = 280, P = 28;
const X = (t: number) => P + t * (W - 2 * P);
const Y = (t: number) => H - P - t * (H - 2 * P);

function frame(host: HTMLElement, label: string) {
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': label, class: 'toy-svg' });
  host.querySelector('[data-plot]')!.appendChild(svg);
  svgEl('path', { d: `M${X(0)},${Y(1)}V${Y(0)}H${X(1)}`, class: 't-axis' }, svg);
  return svg;
}

// Animate a number toward a target (ease-out, ~160ms), then settle.
function tweenText(el: HTMLElement, to: number, digits = 2, suffix = '') {
  const from = parseFloat(el.dataset.v || String(to));
  el.dataset.v = String(to);
  if (reduced()) { el.textContent = to.toFixed(digits) + suffix; return; }
  const t0 = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / 160), e = 1 - (1 - t) ** 3;
    el.textContent = (from + (to - from) * e).toFixed(digits) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---------- 1. Signal / noise ----------
function signal(host: HTMLElement) {
  const svg = frame(host, 'A noisy chart that clears into a trend as noise is removed');
  const r = rng(11);
  const n = 64;
  const trend = (t: number) => 0.22 + 0.52 * t + 0.07 * Math.sin(6 * t);
  const noise = Array.from({ length: n }, () => gauss(r) * 0.2);
  const spike = Array.from({ length: n }, () => (r() < 0.1 ? (r() - 0.5) * 0.9 : 0));
  const gap = Array.from({ length: n }, () => r() < 0.08);
  const raw = svgEl('path', { class: 't-raw' }, svg);
  const dots = svgEl('g', { class: 't-dots' }, svg);
  const pts = Array.from({ length: n }, () => svgEl('circle', { r: 2.2 }, dots));
  const fit = svgEl('polyline', { class: 't-fit', points: Array.from({ length: 41 }, (_, i) => `${X(i / 40)},${Y(trend(i / 40))}`).join(' ') }, svg);
  const input = host.querySelector<HTMLInputElement>('input[type="range"]')!;
  const out = host.querySelector<HTMLElement>('[data-out]')!;
  let touched = false;

  function render(s: number) {
    let d = '', pen = false;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const missing = gap[i] && s < 0.7;
      const y = Math.min(0.98, Math.max(0.02, trend(t) + noise[i] * (1 - s) + spike[i] * (1 - s) ** 2));
      pts[i].setAttribute('cx', X(t).toFixed(1));
      pts[i].setAttribute('cy', Y(y).toFixed(1));
      pts[i].setAttribute('opacity', missing ? '0' : '1');
      if (missing) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${X(t).toFixed(1)},${Y(y).toFixed(1)}`;
      pen = true;
    }
    raw.setAttribute('d', d);
    fit.setAttribute('opacity', Math.max(0, (s - 0.35) / 0.65).toFixed(2));
    raw.setAttribute('opacity', (1 - 0.55 * s).toFixed(2));
    const sigma = 0.2 * (1 - s);
    out.textContent = `σ ${sigma.toFixed(3)}   gaps ${gap.filter(Boolean).length && s < 0.7 ? gap.filter(Boolean).length : 0}`;
  }
  input.addEventListener('input', () => { touched = true; render(+input.value / 100); });
  // Until the visitor takes the slider, scrolling through cleans the signal.
  const onScroll = () => {
    if (touched) return;
    const rct = host.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (innerHeight * 0.85 - rct.top) / (innerHeight * 0.9)));
    const s = 0.08 + 0.72 * t;
    input.value = String(Math.round(s * 100));
    render(s);
  };
  if (reduced()) { input.value = '100'; render(1); }
  else { addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
}

// ---------- 2. Neural network ----------
function network(host: HTMLElement) {
  const svg = frame(host, 'A small neural network; hovering a node shows the signal flowing to the prediction');
  svg.querySelector('.t-axis')?.remove();
  const layers = [3, 5, 4, 1];
  const r = rng(5);
  const w: number[][][] = layers.slice(1).map((c, l) => Array.from({ length: c }, () => Array.from({ length: layers[l] }, () => (r() - 0.5) * 2.4)));
  const base = [0.35, 0.6, 0.45];
  const nx = (l: number) => X(0.04 + (0.8 * l) / (layers.length - 1));
  const ny = (l: number, i: number) => Y(0.5 + ((i - (layers[l] - 1) / 2) * 0.9) / 5);
  const edges: { l: number; i: number; j: number; el: Element }[] = [];
  const gE = svgEl('g', {}, svg), gN = svgEl('g', {}, svg);
  for (let l = 0; l < layers.length - 1; l++)
    for (let j = 0; j < layers[l + 1]; j++)
      for (let i = 0; i < layers[l]; i++)
        edges.push({ l, i, j, el: svgEl('line', { x1: nx(l), y1: ny(l, i), x2: nx(l + 1), y2: ny(l + 1, j), class: 't-edge' }, gE) });
  const nodes: Element[][] = layers.map((c, l) => Array.from({ length: c }, (_, i) => {
    const n = svgEl('circle', { cx: nx(l), cy: ny(l, i), r: l === 0 ? 9 : 7, class: 't-node', tabindex: l === 0 ? 0 : -1, 'data-toy-drag': '' }, gN);
    if (l === 0) { n.setAttribute('role', 'button'); n.setAttribute('aria-label', `Input ${i + 1}: raise to see its effect`); }
    return n;
  }));
  svgEl('text', { x: nx(3) + 18, y: ny(3, 0) + 4, class: 't-lbl' }, svg).textContent = 'ŷ';
  const out = host.querySelector<HTMLElement>('[data-out]')!;
  const val = host.querySelector<HTMLElement>('[data-val]')!;
  const sig = (z: number) => 1 / (1 + Math.exp(-z));

  function run(focus: number | null) {
    const x = base.map((v, i) => (i === focus ? 1 : v));
    const acts: number[][] = [x];
    for (let l = 0; l < w.length; l++) acts.push(w[l].map((row) => sig(row.reduce((s, wi, i) => s + wi * acts[l][i], 0))));
    const y = acts[acts.length - 1][0];
    // Edge weight shown as contribution |w·a|; the hovered input's paths go black.
    const reach = new Set<string>();
    if (focus !== null) { reach.add(`0:${focus}`); for (let l = 1; l < layers.length; l++) for (let j = 0; j < layers[l]; j++) reach.add(`${l}:${j}`); }
    for (const e of edges) {
      const c = Math.min(1, Math.abs(w[e.l][e.j][e.i] * acts[e.l][e.i]) / 1.2);
      const on = focus !== null && (e.l > 0 || e.i === focus);
      e.el.setAttribute('stroke-width', (0.5 + c * (on ? 2.2 : 1)).toFixed(2));
      e.el.setAttribute('stroke-opacity', (on ? 0.35 + c * 0.65 : 0.1 + c * 0.25).toFixed(2));
    }
    nodes.forEach((col, l) => col.forEach((n, i) => n.classList.toggle('is-on', focus !== null && reach.has(`${l}:${i}`) && acts[l][i] > 0.5)));
    tweenText(val, y, 3);
    out.textContent = focus === null ? 'Hover an input to raise it to 1.0' : `x${focus + 1} = 1.0   →   ŷ ${y > 0.5 ? 'rises' : 'falls'}`;
  }
  nodes[0].forEach((n, i) => {
    n.addEventListener('pointerenter', () => run(i));
    n.addEventListener('focus', () => run(i));
    n.addEventListener('click', () => run(i));
  });
  svg.addEventListener('pointerleave', () => run(null));
  nodes[0].forEach((n) => n.addEventListener('blur', () => run(null)));
  run(null);
}

// ---------- 3. Budget allocation ----------
function budget(host: HTMLElement) {
  const svg = frame(host, 'Three diminishing-returns curves with current and optimal spend marked');
  const ch = [
    { name: 'Search', a: 62, b: 0.042 },
    { name: 'Social', a: 48, b: 0.03 },
    { name: 'Display', a: 30, b: 0.065 },
  ];
  const MAXS = 100, MAXR = 70;
  const ret = (c: (typeof ch)[0], x: number) => c.a * (1 - Math.exp(-c.b * x));
  ch.forEach((c, k) => {
    svgEl('polyline', { class: `t-curve${k ? ' t-curve-2' : ''}`, points: Array.from({ length: 51 }, (_, i) => `${X(i / 50)},${Y(ret(c, (i / 50) * MAXS) / MAXR)}`).join(' ') }, svg);
    svgEl('text', { x: X(1) + 4, y: Y(ret(c, MAXS) / MAXR) + 4, class: 't-lbl' }, svg).textContent = c.name;
  });
  const cur = ch.map(() => svgEl('circle', { r: 4.5, class: 't-cur' }, svg));
  const opt = ch.map(() => svgEl('rect', { width: 9, height: 9, class: 't-opt' }, svg));
  const sliders = [...host.querySelectorAll<HTMLInputElement>('input[type="range"]')];
  const outs = [...host.querySelectorAll<HTMLElement>('[data-spend]')];
  const total = host.querySelector<HTMLElement>('[data-total]')!;
  const best = host.querySelector<HTMLElement>('[data-best]')!;
  const gapEl = host.querySelector<HTMLElement>('[data-gap]')!;
  const apply = host.querySelector<HTMLButtonElement>('[data-apply]')!;

  // Optimal split of a fixed budget: equalise marginal returns (water-filling).
  function optimal(B: number) {
    let lo = 1e-6, hi = 10;
    const alloc = (lam: number) => ch.map((c) => Math.min(MAXS, Math.max(0, Math.log((c.a * c.b) / lam) / c.b)));
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; alloc(m).reduce((s, v) => s + v, 0) > B ? (lo = m) : (hi = m); }
    return alloc((lo + hi) / 2);
  }
  function render() {
    const x = sliders.map((s) => +s.value);
    const B = x.reduce((s, v) => s + v, 0);
    const o = optimal(B);
    const R = ch.reduce((s, c, i) => s + ret(c, x[i]), 0), Ro = ch.reduce((s, c, i) => s + ret(c, o[i]), 0);
    ch.forEach((c, i) => {
      cur[i].setAttribute('cx', X(x[i] / MAXS).toFixed(1)); cur[i].setAttribute('cy', Y(ret(c, x[i]) / MAXR).toFixed(1));
      opt[i].setAttribute('x', (X(o[i] / MAXS) - 4.5).toFixed(1)); opt[i].setAttribute('y', (Y(ret(c, o[i]) / MAXR) - 4.5).toFixed(1));
      outs[i].textContent = String(x[i]).padStart(3, ' ');
    });
    tweenText(total, R, 1);
    tweenText(best, Ro, 1);
    gapEl.textContent = Ro - R < 0.05 ? 'at the optimum' : `${(((Ro - R) / R) * 100).toFixed(1)}% left on the table`;
    apply.disabled = Ro - R < 0.05;
    host.dataset.o = JSON.stringify(o);
  }
  sliders.forEach((s) => s.addEventListener('input', render));
  apply.addEventListener('click', () => {
    const o: number[] = JSON.parse(host.dataset.o || '[]');
    const from = sliders.map((s) => +s.value);
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = reduced() ? 1 : Math.min(1, (now - t0) / 420), e = 1 - (1 - t) ** 3;
      sliders.forEach((s, i) => (s.value = String(Math.round(from[i] + (o[i] - from[i]) * e))));
      render();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  render();
}

// ---------- 4. Pareto frontier ----------
function pareto(host: HTMLElement) {
  const svg = frame(host, 'A Pareto frontier of effort against return; drag to choose a point on the frontier');
  const r = rng(23);
  const cand = Array.from({ length: 30 }, () => {
    const e = 0.04 + r() * 0.92;
    return [e, Math.max(0.04, (1 - (1 - e) ** 2.3) * (0.5 + r() * 0.5))] as [number, number];
  });
  const front = cand.filter(([e, v]) => !cand.some(([e2, v2]) => e2 <= e && v2 >= v && (e2 < e || v2 > v))).sort((a, b) => a[0] - b[0]);
  cand.filter((c) => !front.includes(c)).forEach(([e, v]) => svgEl('circle', { cx: X(e), cy: Y(v), r: 2.8, class: 't-cand' }, svg));
  svgEl('polyline', { class: 't-front', points: front.map(([e, v]) => `${X(e)},${Y(v)}`).join(' ') }, svg);
  front.forEach(([e, v]) => svgEl('circle', { cx: X(e), cy: Y(v), r: 3, class: 't-fpt' }, svg));
  svgEl('text', { x: X(1), y: Y(0) + 20, class: 't-lbl', 'text-anchor': 'end' }, svg).textContent = 'Effort →';
  svgEl('text', { x: X(0) + 6, y: Y(1) + 4, class: 't-lbl' }, svg).textContent = 'Return ↑';
  const guideX = svgEl('line', { class: 't-guide' }, svg), guideY = svgEl('line', { class: 't-guide' }, svg);
  const pick = svgEl('rect', { width: 11, height: 11, class: 't-opt t-pick' }, svg);
  const out = host.querySelector<HTMLElement>('[data-out]')!;
  let idx = front.reduce((b, p, i) => (p[1] - 0.6 * p[0] > front[b][1] - 0.6 * front[b][0] ? i : b), 0);

  function place(i: number) {
    idx = Math.max(0, Math.min(front.length - 1, i));
    const [e, v] = front[idx];
    pick.setAttribute('x', (X(e) - 5.5).toFixed(1)); pick.setAttribute('y', (Y(v) - 5.5).toFixed(1));
    guideX.setAttribute('x1', X(e)); guideX.setAttribute('x2', X(e)); guideX.setAttribute('y1', Y(v)); guideX.setAttribute('y2', Y(0));
    guideY.setAttribute('x1', X(0)); guideY.setAttribute('x2', X(e)); guideY.setAttribute('y1', Y(v)); guideY.setAttribute('y2', Y(v));
    const prev = front[Math.max(0, idx - 1)];
    const slope = idx ? (v - prev[1]) / (e - prev[0]) : NaN;
    out.textContent = `effort ${e.toFixed(2)}   return ${v.toFixed(2)}   ${isNaN(slope) ? '' : `marginal ${slope.toFixed(2)}`}`;
    svg.setAttribute('aria-valuenow', String(idx + 1));
    svg.setAttribute('aria-valuetext', `Effort ${e.toFixed(2)}, return ${v.toFixed(2)}`);
  }
  svg.setAttribute('role', 'slider');
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('aria-valuemin', '1');
  svg.setAttribute('aria-valuemax', String(front.length));
  svg.setAttribute('data-toy-drag', '');
  const fromPointer = (e: PointerEvent) => {
    const rc = svg.getBoundingClientRect();
    const t = ((e.clientX - rc.left) / rc.width) * W;
    const eff = (t - P) / (W - 2 * P);
    let bi = 0, bd = Infinity;
    front.forEach(([fe], i) => { const d = Math.abs(fe - eff); if (d < bd) { bd = d; bi = i; } });
    place(bi);
  };
  let dragging = false;
  svg.addEventListener('pointerdown', (e) => { dragging = true; svg.setPointerCapture(e.pointerId); fromPointer(e); });
  svg.addEventListener('pointermove', (e) => dragging && fromPointer(e));
  svg.addEventListener('pointerup', () => (dragging = false));
  svg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { place(idx + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { place(idx - 1); e.preventDefault(); }
  });
  place(idx);
}

const TOYS: Record<string, (h: HTMLElement) => void> = { signal, network, budget, pareto };
export function mountToys() {
  document.querySelectorAll<HTMLElement>('[data-toy]').forEach((h) => TOYS[h.dataset.toy!]?.(h));
}
