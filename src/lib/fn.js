// The optimization surface shared by the build (contours) and the browser
// (live readout and descent). Kept dependency-free so it ships small.
//   f(x, y) = A·(y − B·x²)² + C·(x − X0)² + D·(y − Y0)²
// A curved ("banana") valley: steepest descent drops into the valley, then
// bends along it to the minimum near (0.55, 0.17).

export const A = 3.2, B = 0.55, C = 0.9, X0 = 0.55, D = 0.05, Y0 = 0.15;

export const f = (x, y) => A * (y - B * x * x) ** 2 + C * (x - X0) ** 2 + D * (y - Y0) ** 2;

export const grad = (x, y) => {
  const r = y - B * x * x;
  return [-4 * A * B * x * r + 2 * C * (x - X0), 2 * A * r + 2 * D * (y - Y0)];
};

// Drawing window in function space.
export const DOMAIN = { x0: -2.6, x1: 2.0, y0: -1.1, y1: 3.4 };

// Contour levels (geometric) and the height map used for the 3D view.
export const LEVEL0 = 0.04, LEVEL_RATIO = 1.72, LEVELS = 13;
export const levels = () => Array.from({ length: LEVELS }, (_, k) => LEVEL0 * LEVEL_RATIO ** k);
const TOP = LEVEL0 * LEVEL_RATIO ** (LEVELS - 1);
export const height = (v) => Math.min(1, Math.log1p(v / LEVEL0) / Math.log1p(TOP / LEVEL0));

// Unit-square coordinates (u right, v down) ↔ function space.
export const toUnit = (x, y) => [(x - DOMAIN.x0) / (DOMAIN.x1 - DOMAIN.x0), (DOMAIN.y1 - y) / (DOMAIN.y1 - DOMAIN.y0)];
export const fromUnit = (u, v) => [DOMAIN.x0 + u * (DOMAIN.x1 - DOMAIN.x0), DOMAIN.y1 - v * (DOMAIN.y1 - DOMAIN.y0)];

export const START = [-2.2, 3.05];
export const ETA = 0.012;

// One gradient step with a simple backtracking guard, so a start on a steep
// wall cannot overshoot and diverge. Returns the next point and the step used.
export function step([x, y], eta = ETA) {
  const [gx, gy] = grad(x, y);
  const fx = f(x, y);
  let e = eta;
  for (let i = 0; i < 12; i++) {
    const nx = x - e * gx, ny = y - e * gy;
    if (f(nx, ny) <= fx) return { p: [nx, ny], g: Math.hypot(gx, gy) };
    e /= 2;
  }
  return { p: [x, y], g: 0 };
}

// Full run from a start point, stopping once the steps become invisible.
export function run(start = START, { maxIter = 4000, tol = 2e-4 } = {}) {
  const pts = [start];
  let p = start;
  for (let k = 0; k < maxIter; k++) {
    const { p: q, g } = step(p);
    pts.push(q);
    p = q;
    if (f(...q) < tol || g < 1e-5) break;
  }
  return pts;
}
