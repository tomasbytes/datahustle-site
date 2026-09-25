// The thread: the descent path continues from the hero's minimum down the
// page's left margin, steps through each [data-thread-point] in order and
// ends at the closing mark. It draws itself up to a line near the bottom of
// the viewport; points it has passed light up.
//
// Point attributes:
//   data-thread-x="margin"   use the page margin instead of the element centre
//   data-thread-y="bottom"   use the element's bottom edge instead of its centre
//   data-thread-route="hv"   reach this point horizontally first (default "vh")
type P = { x: number; y: number; el?: HTMLElement; lit?: boolean };

const R = 0; // square, ruled turns

export function mountThread(svg: SVGSVGElement) {
  const path = svg.querySelector('path')!;
  const host = svg.parentElement!;
  const instrument = document.querySelector<HTMLElement>('[data-instrument]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pts: P[] = [];
  let cum: number[] = [];
  let lastLen = -1;

  const docTop = (el: Element) => el.getBoundingClientRect().top + scrollY - host.getBoundingClientRect().top - scrollY;

  function layout() {
    const hostRect = host.getBoundingClientRect();
    const wrap = document.querySelector<HTMLElement>('.wrap')!;
    const wr = wrap.getBoundingClientRect();
    const margin = wr.left - hostRect.left + parseFloat(getComputedStyle(wrap).paddingLeft) * 0.5;
    svg.setAttribute('width', String(host.clientWidth));
    svg.setAttribute('height', String(host.scrollHeight));
    svg.setAttribute('viewBox', `0 0 ${host.clientWidth} ${host.scrollHeight}`);

    const route: P[] = [];
    // Start: the instrument's minimum, where it rests once the hero unpins.
    if (instrument) {
      const stage = instrument.querySelector<HTMLElement>('[data-stage]')!;
      const hero = instrument.closest<HTMLElement>('[data-hero]')!;
      const pin = hero.firstElementChild as HTMLElement;
      const heroTop = docTop(hero);
      const pinFinal = heroTop + hero.offsetHeight - pin.offsetHeight;
      const sr = stage.getBoundingClientRect(), pr = pin.getBoundingClientRect();
      const u = parseFloat(instrument.dataset.endU || '0.68'), v = parseFloat(instrument.dataset.endV || '0.72');
      // Desktop: from the minimum itself (the map is flat again once the hero
      // lets go). Narrow screens: from under the readout panel, because the
      // map may still be tilted as it scrolls away.
      const flatAtExit = matchMedia('(min-width: 60.01rem)').matches;
      const panel = instrument.querySelector<HTMLElement>('.panel');
      const below = panel ? panel.getBoundingClientRect().bottom - sr.top : sr.height;
      route.push({ x: sr.left - hostRect.left + u * sr.width, y: pinFinal + (sr.top - pr.top) + (flatAtExit ? v * sr.height : below) });
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-thread-point]')) {
      const r = el.getBoundingClientRect();
      const x = el.dataset.threadX === 'margin' ? margin : r.left - hostRect.left + r.width / 2;
      const y = (el.dataset.threadY === 'bottom' ? r.bottom : r.top + r.height / 2) - hostRect.top;
      const prev = route[route.length - 1];
      if (prev) {
        const corner = el.dataset.threadRoute === 'hv' ? { x, y: prev.y } : { x: prev.x, y };
        if (Math.abs(corner.x - prev.x) > 0.5 || Math.abs(corner.y - prev.y) > 0.5) route.push(corner);
      }
      route.push({ x, y, el });
    }
    pts = route;
    cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    lastLen = -1;
    update();
  }

  // Length along the route at which the path reaches document height y.
  function lengthAtY(y: number) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (b.y > y) {
        if (b.y === a.y) return cum[i - 1];
        const t = Math.max(0, (y - a.y) / (b.y - a.y));
        return cum[i - 1] + t * (cum[i] - cum[i - 1]);
      }
    }
    return cum[cum.length - 1];
  }

  function d(len: number) {
    // Polyline truncated at `len`; corners use radius R (0: square turns).
    const out: P[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] <= len) { out.push(pts[i]); continue; }
      const a = pts[i - 1], b = pts[i], t = (len - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      break;
    }
    let s = `M${out[0].x.toFixed(1)},${out[0].y.toFixed(1)}`;
    for (let i = 1; i < out.length; i++) {
      const p = out[i], prev = out[i - 1], next = out[i + 1];
      if (!next) { s += `L${p.x.toFixed(1)},${p.y.toFixed(1)}`; break; }
      const l1 = Math.hypot(p.x - prev.x, p.y - prev.y), l2 = Math.hypot(next.x - p.x, next.y - p.y);
      const r = Math.min(R, l1 / 2, l2 / 2);
      const ax = p.x + ((prev.x - p.x) / (l1 || 1)) * r, ay = p.y + ((prev.y - p.y) / (l1 || 1)) * r;
      const bx = p.x + ((next.x - p.x) / (l2 || 1)) * r, by = p.y + ((next.y - p.y) / (l2 || 1)) * r;
      s += `L${ax.toFixed(1)},${ay.toFixed(1)}Q${p.x.toFixed(1)},${p.y.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
    }
    return s;
  }

  // While the hero is pinned its content floats over the thread's route, so
  // the thread waits until the hero lets go.
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const heroPinned = () => {
    if (!hero) return false;
    const pin = hero.firstElementChild as HTMLElement;
    return hero.getBoundingClientRect().bottom - pin.getBoundingClientRect().bottom > 1;
  };

  function update() {
    if (pts.length < 2) return;
    const hostTop = host.getBoundingClientRect().top;
    const len = reduced ? cum[cum.length - 1] : heroPinned() ? 0 : lengthAtY(innerHeight * 0.72 - hostTop);
    if (Math.abs(len - lastLen) < 0.5) return;
    lastLen = len;
    path.setAttribute('d', len > 0 ? d(len) : '');
    let current: HTMLElement | null = null;
    pts.forEach((p, i) => {
      if (!p.el || !p.el.hasAttribute('data-thread-light')) return;
      const on = cum[i] <= len + 0.5;
      p.el.classList.toggle('is-lit', on);
      if (on) current = p.el;
    });
    document.querySelectorAll('.is-current').forEach((e) => e !== current && e.classList.remove('is-current'));
    (current as HTMLElement | null)?.classList.add('is-current');
  }

  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  new ResizeObserver(() => layout()).observe(host);
  document.fonts?.ready.then(layout);
  addEventListener('load', layout);
  layout();
}
