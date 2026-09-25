// Four disciplines, one visual. Thirty-two points keep their identity through
// four chapters and move between layouts as you scroll:
//   01 noisy measurements → cleaned into a trend
//   02 the points become the nodes of a neural network
//   03 the network's outputs become three response curves
//   04 the curves collapse into a Pareto frontier
// Every line (series, edges, curves, frontier) is drawn through the points'
// current positions, so the lines morph with them. Each chapter keeps its
// interaction once it has settled.
const NS = 'http://www.w3.org/2000/svg';
const W = 1000, H = 640, N = 32;
const el = (tag: string, a: Record<string, string | number> = {}, parent?: Element) => {
  const e = document.createElementNS(NS, tag);
  for (const k in a) e.setAttribute(k, String(a[k]));
  parent?.appendChild(e);
  return e as SVGElement;
};
function rng(s: number) {
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const gauss = (r: () => number) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const X = (u: number) => 70 + u * (W - 140);
const Y = (v: number) => H - 60 - v * (H - 120);
type P = [number, number];

// ---------- the four layouts ----------
const r = rng(29);
const trend = (t: number) => 0.2 + 0.55 * t + 0.06 * Math.sin(6 * t);
const noise = Array.from({ length: N }, () => gauss(r) * 0.2 + (r() < 0.12 ? (r() - 0.5) * 0.7 : 0));
function signalLayout(s: number): P[] {
  return Array.from({ length: N }, (_, i) => { const t = i / (N - 1); return [X(t), Y(clamp(trend(t) + noise[i] * (1 - s), 0.02, 0.98))]; });
}
const LAYERS = [4, 8, 8, 8, 4];
const layerOf: number[] = [], rowOf: number[] = [];
LAYERS.forEach((c, l) => { for (let i = 0; i < c; i++) { layerOf.push(l); rowOf.push(i); } });
const netLayout: P[] = layerOf.map((l, i) => [X(0.05 + (0.9 * l) / (LAYERS.length - 1)), H / 2 + (rowOf[i] - (LAYERS[l] - 1) / 2) * 62]);
const CH = [
  { name: 'Search', a: 62, b: 0.042 },
  { name: 'Social', a: 48, b: 0.03 },
  { name: 'Display', a: 30, b: 0.065 },
];
const MAXS = 100, MAXR = 68;
const ret = (c: (typeof CH)[0], x: number) => c.a * (1 - Math.exp(-c.b * x));
const curveOf = (i: number) => (i < 11 ? 0 : i < 22 ? 1 : 2);
const curveLayout: P[] = Array.from({ length: N }, (_, i) => {
  const c = curveOf(i), k = i - [0, 11, 22][c], m = [11, 11, 10][c];
  const u = k / (m - 1);
  return [X(u), Y(ret(CH[c], u * MAXS) / MAXR)];
});
const cand: P[] = Array.from({ length: N }, () => {
  const e = 0.04 + r() * 0.92;
  return [e, Math.max(0.04, (1 - (1 - e) ** 2.3) * (0.48 + r() * 0.52))];
});
const frontier = cand.map((p, i) => ({ p, i })).filter(({ p: [e, v] }) => !cand.some(([e2, v2]) => e2 <= e && v2 >= v && (e2 < e || v2 > v))).sort((a, b) => a.p[0] - b.p[0]).map((o) => o.i);
const paretoLayout: P[] = cand.map(([e, v]) => [X(e), Y(v)]);

// Network weights, fixed.
const wts = LAYERS.slice(1).map((c, l) => Array.from({ length: c }, () => Array.from({ length: LAYERS[l] }, () => (r() - 0.5) * 2.2)));
const offs = LAYERS.reduce<number[]>((a, c, i) => (a.push(i ? a[i - 1] + LAYERS[i - 1] : 0), a), []);

export function mountMorph(root: HTMLElement, opts: { fixedChapter?: number } = {}) {
  const host = root.querySelector<HTMLElement>('[data-visual]')!;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'morph-svg', role: 'img', 'aria-label': 'One visual in four chapters: a noisy series, a neural network, response curves and a Pareto frontier' });
  host.appendChild(svg);
  const gAxis = el('path', { d: `M${X(0)},${Y(1.02)}V${Y(0)}H${X(1)}`, class: 'm-axis' }, svg);
  const gFit = el('polyline', { class: 'm-fit' }, svg);
  const gSeries = el('polyline', { class: 'm-series' }, svg);
  const gEdges = el('g', { class: 'm-edges' }, svg);
  const edges: { a: number; b: number; l: number; j: number; i: number; e: SVGElement }[] = [];
  for (let l = 0; l < LAYERS.length - 1; l++)
    for (let j = 0; j < LAYERS[l + 1]; j++)
      for (let i = 0; i < LAYERS[l]; i++) edges.push({ a: offs[l] + i, b: offs[l + 1] + j, l, j, i, e: el('line', {}, gEdges) });
  const gCurves = [0, 1, 2].map((c) => el('polyline', { class: `m-curve${c ? ' m-curve-2' : ''}` }, svg));
  const gFront = el('polyline', { class: 'm-front' }, svg);
  const guideA = el('line', { class: 'm-guide' }, svg), guideB = el('line', { class: 'm-guide' }, svg);
  const dots = Array.from({ length: N }, () => el('circle', { class: 'm-pt' }, svg));
  const cur = CH.map(() => el('circle', { r: 7, class: 'm-cur' }, svg));
  const opt = CH.map(() => el('rect', { width: 13, height: 13, class: 'm-opt' }, svg));
  const pick = el('rect', { width: 15, height: 15, class: 'm-opt m-pick' }, svg);
  const labels = CH.map((c) => { const t = el('text', { class: 'm-lbl' }, svg); t.textContent = c.name; return t; });
  const yhat = el('text', { class: 'm-lbl m-yhat' }, svg);

  const panels = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  const nums = [...root.querySelectorAll<HTMLElement>('[data-num]')];
  const noiseInput = root.querySelector<HTMLInputElement>('[data-noise]');
  const spend = [...root.querySelectorAll<HTMLInputElement>('[data-spend-in]')];
  const out = (name: string) => root.querySelector<HTMLElement>(`[data-out="${name}"]`);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let s = 0.1, userNoise = false;
  let focus: number | null = null;
  let pickIdx = frontier.reduce((b, i, k) => (cand[i][1] - 0.6 * cand[i][0] > cand[frontier[b]][1] - 0.6 * cand[frontier[b]][0] ? k : b), 0);
  let chapter = opts.fixedChapter ?? 0, blend = 0; // blend: 0 = chapter, 1 = next

  const layouts = (): P[][] => [signalLayout(s), netLayout, curveLayout, paretoLayout];

  function forward() {
    const x = [0.4, 0.6, 0.3, 0.5].map((v, i) => (i === focus ? 1 : v));
    const acts: number[][] = [x];
    for (let l = 0; l < wts.length; l++) acts.push(wts[l].map((row) => 1 / (1 + Math.exp(-row.reduce((a, w, i) => a + w * acts[l][i], 0)))));
    return acts;
  }

  function optimal(B: number) {
    let lo = 1e-6, hi = 10;
    const alloc = (lam: number) => CH.map((c) => Math.min(MAXS, Math.max(0, Math.log((c.a * c.b) / lam) / c.b)));
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; alloc(m).reduce((a, v) => a + v, 0) > B ? (lo = m) : (hi = m); }
    return alloc((lo + hi) / 2);
  }

  function render() {
    const L = layouts();
    const a = L[chapter], b = L[Math.min(3, chapter + 1)], t = easeInOut(blend);
    const pos: P[] = a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);
    // Chapter weights for crossfading each chapter's own layer.
    const w = [0, 0, 0, 0];
    w[chapter] += 1 - t; if (chapter < 3) w[chapter + 1] += t;
    const pts = (idx: number[]) => idx.map((i) => `${pos[i][0].toFixed(1)},${pos[i][1].toFixed(1)}`).join(' ');

    gAxis.setAttribute('opacity', (w[0] + w[2] + w[3]).toFixed(3));
    gSeries.setAttribute('points', pts(Array.from({ length: N }, (_, i) => i)));
    gSeries.setAttribute('opacity', (w[0] * (1 - 0.5 * s)).toFixed(3));
    gFit.setAttribute('points', Array.from({ length: 41 }, (_, i) => `${X(i / 40)},${Y(trend(i / 40))}`).join(' '));
    gFit.setAttribute('opacity', (w[0] * smooth((s - 0.35) / 0.5)).toFixed(3));

    const acts = forward();
    edges.forEach((e) => {
      e.e.setAttribute('x1', pos[e.a][0].toFixed(1)); e.e.setAttribute('y1', pos[e.a][1].toFixed(1));
      e.e.setAttribute('x2', pos[e.b][0].toFixed(1)); e.e.setAttribute('y2', pos[e.b][1].toFixed(1));
      const c = Math.min(1, Math.abs(wts[e.l][e.j][e.i] * acts[e.l][e.i]) / 1.1);
      const on = focus !== null && (e.l > 0 || e.i === focus);
      e.e.setAttribute('stroke-width', (0.6 + c * (on ? 2.4 : 1)).toFixed(2));
      e.e.setAttribute('stroke-opacity', (w[1] * (on ? 0.35 + 0.65 * c : 0.08 + 0.3 * c)).toFixed(3));
    });

    [0, 1, 2].forEach((c) => {
      const idx = Array.from({ length: N }, (_, i) => i).filter((i) => curveOf(i) === c);
      gCurves[c].setAttribute('points', pts(idx));
      gCurves[c].setAttribute('opacity', w[2].toFixed(3));
      const last = pos[idx[idx.length - 1]];
      labels[c].setAttribute('x', (last[0] + 10).toFixed(1)); labels[c].setAttribute('y', (last[1] + 4).toFixed(1));
      labels[c].setAttribute('opacity', w[2].toFixed(3));
    });
    gFront.setAttribute('points', pts(frontier));
    gFront.setAttribute('opacity', w[3].toFixed(3));

    const onFront = new Set(frontier);
    dots.forEach((d, i) => {
      d.setAttribute('cx', pos[i][0].toFixed(1)); d.setAttribute('cy', pos[i][1].toFixed(1));
      const rr = 4 * w[0] + 9 * w[1] + 4 * w[2] + (onFront.has(i) ? 4.5 : 4) * w[3];
      d.setAttribute('r', rr.toFixed(2));
      const lit = focus !== null && layerOf[i] > 0 && acts[layerOf[i]][rowOf[i]] > 0.5;
      const fill = w[0] + w[2] + w[1] * (lit || (focus !== null && i === focus) ? 1 : 0) + w[3] * (onFront.has(i) ? 1 : 0);
      d.setAttribute('fill-opacity', Math.min(1, fill).toFixed(3));
      d.setAttribute('stroke-opacity', (w[1] + w[3] * (onFront.has(i) ? 1 : 0.5) + 0.0001).toFixed(3));
    });
    const outIdx = offs[4];
    yhat.textContent = `ŷ ${acts[4].map((v) => v.toFixed(2)).join('  ')}`;
    yhat.setAttribute('x', (netLayout[outIdx][0] - 60).toFixed(1));
    yhat.setAttribute('y', (netLayout[N - 1][1] + 44).toFixed(1));
    yhat.setAttribute('opacity', w[1].toFixed(3));

    // Budget: current spend (black) and the optimal split (blue).
    const x = spend.length ? spend.map((i) => +i.value) : [70, 20, 30];
    const o = optimal(x.reduce((a, v) => a + v, 0));
    CH.forEach((c, i) => {
      cur[i].setAttribute('cx', X(x[i] / MAXS).toFixed(1)); cur[i].setAttribute('cy', Y(ret(c, x[i]) / MAXR).toFixed(1));
      cur[i].setAttribute('opacity', w[2].toFixed(3));
      opt[i].setAttribute('x', (X(o[i] / MAXS) - 6.5).toFixed(1)); opt[i].setAttribute('y', (Y(ret(c, o[i]) / MAXR) - 6.5).toFixed(1));
      opt[i].setAttribute('opacity', w[2].toFixed(3));
    });
    const R = CH.reduce((a, c, i) => a + ret(c, x[i]), 0), Ro = CH.reduce((a, c, i) => a + ret(c, o[i]), 0);
    const ob = out('budget');
    if (ob) ob.textContent = `return ${R.toFixed(1)}   optimal ${Ro.toFixed(1)}   ${Ro - R < 0.05 ? 'at the optimum' : `${(((Ro - R) / R) * 100).toFixed(1)}% left on the table`}`;
    const applyBtn = root.querySelector<HTMLButtonElement>('[data-apply]');
    if (applyBtn) { applyBtn.disabled = Ro - R < 0.05; applyBtn.dataset.o = JSON.stringify(o); }

    // Pareto choice.
    const [ce, cv] = cand[frontier[pickIdx]];
    const px = pos[frontier[pickIdx]];
    pick.setAttribute('x', (px[0] - 7.5).toFixed(1)); pick.setAttribute('y', (px[1] - 7.5).toFixed(1));
    pick.setAttribute('opacity', w[3].toFixed(3));
    guideA.setAttribute('x1', px[0].toFixed(1)); guideA.setAttribute('x2', px[0].toFixed(1)); guideA.setAttribute('y1', px[1].toFixed(1)); guideA.setAttribute('y2', Y(0).toFixed(1));
    guideB.setAttribute('x1', X(0).toFixed(1)); guideB.setAttribute('x2', px[0].toFixed(1)); guideB.setAttribute('y1', px[1].toFixed(1)); guideB.setAttribute('y2', px[1].toFixed(1));
    guideA.setAttribute('opacity', w[3].toFixed(3)); guideB.setAttribute('opacity', w[3].toFixed(3));
    const op = out('pareto');
    if (op) op.textContent = `effort ${ce.toFixed(2)}   return ${cv.toFixed(2)}`;
    const on = out('noise');
    if (on) on.textContent = `σ ${(0.2 * (1 - s)).toFixed(3)}`;
    const onet = out('net');
    if (onet) onet.textContent = focus === null ? 'Hover an input node to raise it to 1.0' : `input ${focus + 1} = 1.0`;

    // Text panels and the margin numbers follow the dominant chapter.
    const lead = w.indexOf(Math.max(...w));
    if (opts.fixedChapter === undefined) {
      // Sequential crossfade: the old text leaves before the new one arrives.
      panels.forEach((pn, i) => { pn.style.opacity = clamp((w[i] - 0.5) * 2).toFixed(3); pn.style.visibility = w[i] < 0.02 ? 'hidden' : 'visible'; pn.inert = i !== lead; });
      nums.forEach((nm, i) => nm.classList.toggle('is-on', i === lead));
    }
    root.dataset.chapter = String(lead);
  }

  // Scroll drives chapter and blend (pinned layout only).
  function fromScroll() {
    if (opts.fixedChapter !== undefined) return;
    const rc = root.getBoundingClientRect();
    const pin = root.querySelector<HTMLElement>('[data-pin]')!;
    const travel = rc.height - pin.offsetHeight;
    const p = clamp(-rc.top / Math.max(1, travel)) * 4;
    chapter = Math.min(3, Math.floor(p));
    const within = p - chapter;
    blend = chapter < 3 ? smooth((within - 0.62) / 0.38) : 0;
    if (chapter === 0 && !userNoise) s = 0.1 + 0.85 * smooth(within / 0.6);
    if (noiseInput && !userNoise) noiseInput.value = String(Math.round(s * 100));
  }

  // ---------- interactions ----------
  noiseInput?.addEventListener('input', () => { userNoise = true; s = +noiseInput.value / 100; render(); });
  spend.forEach((i) => i.addEventListener('input', render));
  root.querySelector<HTMLButtonElement>('[data-apply]')?.addEventListener('click', (e) => {
    const o: number[] = JSON.parse((e.currentTarget as HTMLElement).dataset.o || '[]');
    const from = spend.map((i) => +i.value), t0 = performance.now();
    const tick = (now: number) => {
      const t = reduced ? 1 : clamp((now - t0) / 420), k = 1 - (1 - t) ** 3;
      spend.forEach((inp, i) => (inp.value = String(Math.round(from[i] + (o[i] - from[i]) * k))));
      render();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const toView = (e: PointerEvent) => { const rc = svg.getBoundingClientRect(); return [((e.clientX - rc.left) / rc.width) * W, ((e.clientY - rc.top) / rc.height) * H]; };
  let dragging = false;
  svg.addEventListener('pointermove', (e) => {
    const settled = blend < 0.02;
    const [vx, vy] = toView(e);
    if (settled && chapter === 1) {
      let best: number | null = null, bd = 30;
      for (let i = 0; i < LAYERS[0]; i++) { const d = Math.hypot(netLayout[i][0] - vx, netLayout[i][1] - vy); if (d < bd) { bd = d; best = i; } }
      if (best !== focus) { focus = best; render(); }
    }
    if (settled && chapter === 3 && (dragging || e.pointerType === 'mouse' && e.buttons === 1)) pickNear(vx);
  });
  svg.addEventListener('pointerleave', () => { if (focus !== null) { focus = null; render(); } });
  function pickNear(vx: number) {
    const eff = (vx - X(0)) / (X(1) - X(0));
    let bi = 0, bd = Infinity;
    frontier.forEach((i, k) => { const d = Math.abs(cand[i][0] - eff); if (d < bd) { bd = d; bi = k; } });
    if (bi !== pickIdx) { pickIdx = bi; render(); }
  }
  svg.addEventListener('pointerdown', (e) => {
    if (chapter === 1 && blend < 0.02) { const [vx, vy] = toView(e); for (let i = 0; i < LAYERS[0]; i++) if (Math.hypot(netLayout[i][0] - vx, netLayout[i][1] - vy) < 30) { focus = focus === i ? null : i; render(); } }
    if (chapter !== 3 || blend > 0.02) return;
    dragging = true; svg.setPointerCapture(e.pointerId); pickNear(toView(e)[0]);
  });
  svg.addEventListener('pointerup', () => (dragging = false));
  // Keyboard: arrows move along the frontier in chapter 4.
  svg.setAttribute('tabindex', '0');
  svg.addEventListener('keydown', (e) => {
    if (chapter !== 3) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { pickIdx = Math.min(frontier.length - 1, pickIdx + 1); render(); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { pickIdx = Math.max(0, pickIdx - 1); render(); e.preventDefault(); }
  });

  if (opts.fixedChapter === 0) {
    // A standalone first chapter cleans with scroll until touched.
    const onS = () => {
      if (userNoise) return;
      const rc = root.getBoundingClientRect();
      s = reduced ? 1 : 0.1 + 0.85 * smooth((innerHeight * 0.8 - rc.top) / (innerHeight * 0.8));
      if (noiseInput) noiseInput.value = String(Math.round(s * 100));
      render();
    };
    addEventListener('scroll', onS, { passive: true });
    onS();
  }
  let raf = 0;
  if (opts.fixedChapter === undefined) addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; fromScroll(); render(); }); }, { passive: true });
  fromScroll();
  render();
}
