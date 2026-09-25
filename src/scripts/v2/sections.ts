// Scroll-driven sections below the descent: the horizontal method track, the
// client constellation, the H-cut dividers, and figure reveals.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// How we work: vertical scroll drives a horizontal track; the path steps
// down to each k and lights it as its panel reaches the centre.
export function mountMethod(section: HTMLElement) {
  const pin = section.querySelector<HTMLElement>('[data-pin]')!;
  const track = section.querySelector<HTMLElement>('[data-track]')!;
  const path = section.querySelector<SVGPathElement>('[data-path]');
  const points = [...section.querySelectorAll<HTMLElement>('[data-k]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-panel]')];
  const wide = matchMedia('(min-width: 60.01rem)');
  let len = 0;

  function size() {
    if (!wide.matches || reduced()) { section.style.height = ''; track.style.transform = ''; update(); return; }
    const extra = track.scrollWidth - innerWidth;
    section.style.height = `${pin.offsetHeight + Math.max(0, extra)}px`;
    // Draw the staircase in real pixels so the dash-based draw-in is exact:
    // step k lands at x = 20·k % of the track, y = 30 % + 10 %·(k − 1).
    if (path) {
      const w = track.scrollWidth, h = track.offsetHeight;
      const svg = path.ownerSVGElement!;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      // Start just before step 1, clear of the intro copy.
      let d = `M ${(0.2 * w - 56).toFixed(1)} ${(0.3 * h).toFixed(1)}`;
      for (let i = 0; i < 4; i++) d += ` H ${(0.2 * (i + 1) * w).toFixed(1)} V ${((0.3 + 0.1 * i) * h).toFixed(1)}`;
      d = d.replace(/^(M [\d.]+ [\d.]+) H ([\d.]+) V [\d.]+/, '$1 H $2');
      d += ` H ${w}`;
      path.setAttribute('d', d);
    }
    len = path?.getTotalLength() || 0;
    if (path) { path.style.strokeDasharray = `${len}`; }
    update();
  }
  function update() {
    if (!wide.matches || reduced()) {
      points.forEach((p) => p.classList.add('is-lit'));
      panels.forEach((p) => p.classList.add('is-on'));
      if (path) { path.style.strokeDasharray = ''; path.style.strokeDashoffset = ''; }
      return;
    }
    const r = section.getBoundingClientRect();
    const travel = section.offsetHeight - pin.offsetHeight;
    const p = clamp(-r.top / Math.max(1, travel));
    const extra = track.scrollWidth - innerWidth;
    track.style.transform = `translate3d(${(-p * extra).toFixed(1)}px, 0, 0)`;
    if (path) path.style.strokeDashoffset = String(len * (1 - clamp(p * 1.08)));
    let current: HTMLElement | null = null;
    panels.forEach((panel, i) => {
      const pr = panel.getBoundingClientRect();
      const on = pr.left < innerWidth * 0.62;
      panel.classList.toggle('is-on', on);
      points[i]?.classList.toggle('is-lit', on);
      if (on) current = points[i];
    });
    points.forEach((pt) => pt.classList.toggle('is-current', pt === current));
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', size);
  wide.addEventListener('change', size);
  document.fonts?.ready.then(size);
  size();
}

// Clients: logos start as a scattered constellation joined by faint lines,
// then converge into the ruled index as the section arrives.
export function mountConstellation(section: HTMLElement) {
  const cells = [...section.querySelectorAll<HTMLElement>('[data-logo]')];
  const lines = section.querySelector<SVGSVGElement>('[data-lines]');
  const seed = (i: number) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  const offsets = cells.map((_, i) => ({ x: (seed(i) - 0.5) * 0.9, y: (seed(i + 11) - 0.5) * 1.1 }));
  function update() {
    const r = section.getBoundingClientRect();
    const t = reduced() ? 1 : easeInOut(clamp((innerHeight * 0.95 - r.top) / (innerHeight * 0.75)));
    const w = r.width, h = Math.max(1, r.height);
    const centres: [number, number][] = [];
    cells.forEach((c, i) => {
      const dx = offsets[i].x * w * (1 - t), dy = offsets[i].y * h * (1 - t);
      c.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      c.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      c.style.setProperty('--t', t.toFixed(3));
      const cr = (c.querySelector('.star') || c).getBoundingClientRect();
      centres.push([cr.left - r.left + cr.width / 2, cr.top - r.top + cr.height / 2]);
    });
    section.style.setProperty('--grid', t.toFixed(3));
    if (lines) {
      lines.setAttribute('viewBox', `0 0 ${w} ${h}`);
      // Nearest-neighbour links, fading out as the grid forms.
      let d = '';
      centres.forEach((a, i) => {
        let bj = -1, bd = Infinity;
        centres.forEach((b, j) => { if (j !== i) { const dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (dd < bd) { bd = dd; bj = j; } } });
        if (bj > i || (bj >= 0 && i % 2)) d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${centres[bj][0].toFixed(1)},${centres[bj][1].toFixed(1)}`;
      });
      lines.querySelector('path')!.setAttribute('d', d);
      lines.style.opacity = t > 0.98 ? '0' : (0.5 * (1 - t)).toFixed(3);
    }
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', update);
  update();
}

export function mountReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); }
  }, { threshold: 0.35 });
  els.forEach((e) => io.observe(e));
}
