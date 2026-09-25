// "Clarity." as a pinned moment: the same particle strokes as the hero start
// scattered across the screen and converge, with scroll, into the letters.
// Targets are sampled from the word set in the real display face.
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export async function mountClarity(section: HTMLElement) {
  const stage = section.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = stage.querySelector<HTMLCanvasElement>('canvas')!;
  const sub = section.querySelector<HTMLElement>('[data-sub]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
  const WORD = 'Clarity.';

  let W = 0, H = 0, dpr = 1;
  let n = 0;
  let sx = new Float32Array(0), sy = new Float32Array(0), tx = new Float32Array(0), ty = new Float32Array(0), lag = new Float32Array(0), ph = new Float32Array(0);

  async function layout() {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    try { await document.fonts.load('700 100px "Schibsted Grotesk"'); } catch {}
    // Set the word off-screen and sample its ink on a grid.
    const size = Math.min(W * (W < 760 ? 0.27 : 0.2), H * 0.42);
    const off = document.createElement('canvas');
    off.width = Math.ceil(W); off.height = Math.ceil(H);
    const o = off.getContext('2d')!;
    o.font = `700 ${size}px "Schibsted Grotesk", Arial, sans-serif`;
    o.textBaseline = 'alphabetic';
    const m = o.measureText(WORD);
    const left = W < 760 ? W * 0.06 : W * 0.07;
    const base = H * 0.56;
    o.fillStyle = '#000';
    o.letterSpacing = `${-0.05 * size}px`;
    o.fillText(WORD, left, base);
    const img = o.getImageData(0, 0, off.width, off.height).data;
    const step = Math.max(3, Math.round(size / (lite ? 34 : 56)));
    const pts: [number, number][] = [];
    for (let y = 0; y < off.height; y += step)
      for (let x = 0; x < off.width; x += step)
        if (img[(y * off.width + x) * 4 + 3] > 140) pts.push([x + (Math.random() - 0.5) * step * 0.4, y + (Math.random() - 0.5) * step * 0.4]);
    n = pts.length;
    sx = new Float32Array(n); sy = new Float32Array(n); tx = new Float32Array(n); ty = new Float32Array(n); lag = new Float32Array(n); ph = new Float32Array(n);
    const cx = left + m.width / 2;
    pts.forEach(([x, y], i) => {
      tx[i] = x; ty[i] = y;
      sx[i] = Math.random() * W; sy[i] = Math.random() * H;
      // Particles farther from the word's centre arrive a little later.
      lag[i] = Math.min(0.35, (Math.abs(x - cx) / W) * 0.6 + Math.random() * 0.12);
      ph[i] = Math.random() * Math.PI * 2;
    });
    draw();
  }

  let p = 0, time = 0;
  function progress() {
    if (reduced) return 1;
    const r = section.getBoundingClientRect();
    const travel = r.height - stage.offsetHeight;
    return travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 1;
  }

  function draw() {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    const conv = reduced ? 1 : smooth(0.05, 0.72, p);
    ctx!.strokeStyle = '#000';
    ctx!.fillStyle = '#000';
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    const dots: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = easeOut(Math.min(1, Math.max(0, (conv - lag[i]) / (1 - lag[i] || 1))));
      // Before arriving, each particle drifts on a small orbit, like the field.
      const w = (1 - t) * 14;
      const dx = Math.cos(time * 0.9 + ph[i]) * w, dy = Math.sin(time * 0.7 + ph[i]) * w;
      const x = sx[i] + (tx[i] - sx[i]) * t + dx, y = sy[i] + (ty[i] - sy[i]) * t + dy;
      if (t > 0.985) { dots.push(x, y); continue; }
      // A short stroke pointing the way it is travelling.
      const vx = tx[i] - sx[i], vy = ty[i] - sy[i], l = Math.hypot(vx, vy) || 1;
      const len = 3 + 9 * (1 - t);
      ctx!.moveTo(x, y);
      ctx!.lineTo(x - (vx / l) * len, y - (vy / l) * len);
    }
    ctx!.stroke();
    const s = lite ? 1.9 : 2.3;
    for (let i = 0; i < dots.length; i += 2) ctx!.fillRect(dots[i] - s / 2, dots[i + 1] - s / 2, s, s);
    if (sub) {
      const o = reduced ? 1 : smooth(0.74, 0.86, p);
      sub.style.opacity = o.toFixed(3);
      sub.style.transform = reduced ? '' : `translate3d(0, ${((1 - o) * 12).toFixed(1)}px, 0)`;
    }
  }

  let running = false, raf = 0, last = 0;
  function frame(now: number) {
    if (!running) return;
    time += Math.min(0.05, (now - last) / 1000); last = now;
    p = progress();
    draw();
    raf = requestAnimationFrame(frame);
  }
  if (!reduced) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    }).observe(stage);
  }
  addEventListener('resize', () => { layout(); });
  p = progress();
  await layout();
}
