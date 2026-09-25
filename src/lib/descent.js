// Build-time geometry for the hero: contour rings (unit square) and the
// default descent path. Uses d3-contour, which never ships to the browser.
import { contours } from 'd3-contour';
import { f, levels, fromUnit, toUnit, run, START } from './fn.js';

// Douglas–Peucker simplification in unit coordinates.
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let idx = 0, max = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1e-9;
    const d = Math.abs(dy * px - dx * py + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > max) { max = d; idx = i; }
  }
  if (max <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

// Contour lines as open polylines in unit coordinates [0,1]², one entry per
// level: { level, lines: [[[u, v], ...], ...] }. Segments that run along the
// frame (d3 closes rings there) are removed, so no box is drawn.
export function contourLines(res = 180, tol = 0.0012) {
  const values = new Float64Array(res * res);
  for (let j = 0; j < res; j++)
    for (let i = 0; i < res; i++) values[j * res + i] = f(...fromUnit((i + 0.5) / res, (j + 0.5) / res));
  const lv = levels();
  const edge = (p) => p[0] <= 0 || p[0] >= res || p[1] <= 0 || p[1] >= res;
  return contours().size([res, res]).thresholds(lv)(values).map((c, k) => {
    const lines = [];
    for (const poly of c.coordinates) for (const ring of poly) {
      let cur = [];
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i], q = ring[i + 1];
        cur.push([p[0] / res, p[1] / res]);
        if (q && edge(p) && edge(q)) { if (cur.length > 1) lines.push(cur); cur = []; }
      }
      if (cur.length > 1) lines.push(cur);
    }
    const span = (l) => { const us = l.map((p) => p[0]), vs = l.map((p) => p[1]); return Math.max(Math.max(...us) - Math.min(...us), Math.max(...vs) - Math.min(...vs)); };
    return { level: lv[k], lines: lines.filter((l) => span(l) > 0.01).map((l) => simplify(l, tol).map(([u, v]) => [+u.toFixed(4), +v.toFixed(4)])) };
  });
}

export function defaultPath() {
  return run(START).map((p) => toUnit(...p));
}

// SVG path data (for the no-JS fallback) in a `size` view box.
export const toPathD = (line, size) => 'M' + line.map(([u, v]) => `${(u * size).toFixed(1)},${(v * size).toFixed(1)}`).join('L');
