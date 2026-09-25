// Gradient descent on a curved valley, computed at build time.
// f(x, y) = A·(y − B·x²)² + C·(x − X0)² + D·(y − Y0)²
// A banana-shaped valley: steepest descent drops into the valley first,
// then bends along it toward the minimum, so the path curves visibly.
import { contours } from 'd3-contour';

const A = 3.2, B = 0.55, C = 0.9, X0 = 0.55, D = 0.05, Y0 = 0.15;

export const f = (x, y) => A * (y - B * x * x) ** 2 + C * (x - X0) ** 2 + D * (y - Y0) ** 2;
const grad = (x, y) => {
  const r = y - B * x * x;
  return [-4 * A * B * x * r + 2 * C * (x - X0), 2 * A * r + 2 * D * (y - Y0)];
};

// Domain in function space, mapped onto the drawing.
export const DOMAIN = { x0: -2.6, x1: 2.0, y0: -1.1, y1: 3.4 };

export function descentPath({ start = [-2.2, 3.05], eta = 0.012, iters = 4000, keep = 22 } = {}) {
  let [x, y] = start;
  const all = [[x, y]];
  for (let i = 0; i < iters; i++) {
    const [gx, gy] = grad(x, y);
    x -= eta * gx; y -= eta * gy;
    all.push([x, y]);
    if (Math.hypot(gx, gy) < 1e-5) break;
  }
  // Trim the long tail where the steps become invisible, then mark every
  // k-th iterate: long strides where the slope is steep, short ones as the
  // path settles into the minimum.
  let end = all.length - 1;
  while (end > 0 && f(...all[end - 1]) < 2e-4) end--;
  const line = all.slice(0, end + 1);
  const k = Math.max(1, Math.round(end / (keep - 1)));
  const marks = [];
  for (let i = 0; i < end; i += k) marks.push(line[i]);
  marks.push(line[end]);
  return { line, marks };
}

// Contour lines as SVG path data in a `size`-wide square view box.
export function contourPaths(size = 1000, res = 180, levels) {
  // Sample 6% beyond the view on every side: d3 closes each ring along the
  // grid edge, and those closing segments must fall outside the drawing.
  const PAD = 0.06;
  const w = DOMAIN.x1 - DOMAIN.x0, h = DOMAIN.y1 - DOMAIN.y0;
  const x0 = DOMAIN.x0 - w * PAD, x1 = DOMAIN.x1 + w * PAD, y0 = DOMAIN.y0 - h * PAD, y1 = DOMAIN.y1 + h * PAD;
  const values = new Float64Array(res * res);
  for (let j = 0; j < res; j++)
    for (let i = 0; i < res; i++)
      values[j * res + i] = f(x0 + ((x1 - x0) * i) / (res - 1), y1 - ((y1 - y0) * j) / (res - 1));
  const lv = levels ?? Array.from({ length: 13 }, (_, k) => 0.04 * Math.pow(1.72, k));
  const s = (size * (1 + 2 * PAD)) / (res - 1);
  const o = size * PAD;
  return contours().size([res, res]).thresholds(lv)(values).map((c) =>
    c.coordinates
      .flatMap((poly) => poly.map((ring) =>
        'M' + ring.map(([px, py]) => `${((px - 0.5) * s - o).toFixed(1)},${((py - 0.5) * s - o).toFixed(1)}`).join('L') + 'Z'))
      .join('')
  );
}

export function toView([x, y], size = 1000) {
  const { x0, x1, y0, y1 } = DOMAIN;
  return [((x - x0) / (x1 - x0)) * size, ((y1 - y) / (y1 - y0)) * size];
}
