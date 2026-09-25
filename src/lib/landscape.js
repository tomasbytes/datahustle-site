// The v2 loss landscape: a wide bowl with four basins and a gentle ripple,
// so the gradient field has several minima to flow into. The deepest basin
// near (1.2, −0.9) is the global minimum the page descends to.
export const HALF = 3; // domain is [−3, 3]²
const WELLS = [
  [1.2, -0.9, 1.3, 0.55],
  [-1.5, 1.2, 0.85, 0.8],
  [-0.4, -1.9, 0.6, 0.45],
  [1.8, 1.6, 0.55, 0.6],
];
const R = 0.12;

export function f(x, y) {
  let v = 0.06 * (x * x + y * y) + R * Math.sin(1.7 * x + 0.4) * Math.cos(1.5 * y - 0.3);
  for (const [cx, cy, d, w] of WELLS) v -= d * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / w);
  return v;
}

export function grad(x, y) {
  let gx = 0.12 * x + R * 1.7 * Math.cos(1.7 * x + 0.4) * Math.cos(1.5 * y - 0.3);
  let gy = 0.12 * y - R * 1.5 * Math.sin(1.7 * x + 0.4) * Math.sin(1.5 * y - 0.3);
  for (const [cx, cy, d, w] of WELLS) {
    const e = d * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / w) * (2 / w);
    gx += e * (x - cx);
    gy += e * (y - cy);
  }
  return [gx, gy];
}

// Global minimum by coarse grid search plus gradient refinement.
export function globalMin() {
  let best = [0, 0], bv = Infinity;
  for (let i = 0; i <= 120; i++) for (let j = 0; j <= 120; j++) {
    const x = -HALF + (2 * HALF * i) / 120, y = -HALF + (2 * HALF * j) / 120, v = f(x, y);
    if (v < bv) { bv = v; best = [x, y]; }
  }
  let [x, y] = best;
  for (let k = 0; k < 400; k++) { const [gx, gy] = grad(x, y); x -= 0.05 * gx; y -= 0.05 * gy; }
  return [x, y, f(x, y)];
}
