// Scroll orchestration for The Descent: one pinned stage whose scroll
// progress drives the camera into the landscape and the page colour from
// brand blue to off-white (the brand gradient), with statements fading in
// and out along the way.
import { createLandscape, type Tier } from './landscape-gl';

const BLUE = [0x33, 0x35, 0xff], PAPER = [0xf7, 0xf7, 0xf7];
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const hex = (c: number[]) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const fmt = (n: number, d = 4) => (n >= 0 ? ' ' : '') + n.toFixed(d);

export function mountJourney(section: HTMLElement) {
  const root = document.documentElement;
  const stage = section.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = section.querySelector<HTMLCanvasElement>('canvas')!;
  const beats = [...section.querySelectorAll<HTMLElement>('[data-beat]')];
  const kEl = section.querySelector<HTMLElement>('[data-r-k]');
  const fEl = section.querySelector<HTMLElement>('[data-r-f]');
  const gEl = section.querySelector<HTMLElement>('[data-r-g]');
  const nEl = section.querySelector<HTMLElement>('[data-r-n]');
  const minMark = section.querySelector<HTMLElement>('[data-min-mark]');
  const readoutEl = section.querySelector<HTMLElement>('.readout');
  let coordsCleared = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lite = coarse || (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 || innerWidth < 760;
  const tier: Tier = lite ? 'lite' : 'full';

  if (reduced) root.classList.add('descent-static');
  const gl = createLandscape(canvas, { tier, staticFrame: reduced });
  if (!gl) root.classList.add('no-webgl');

  let p = 0;
  function progress() {
    if (reduced) return 0;
    const r = section.getBoundingClientRect();
    const travel = r.height - stage.offsetHeight;
    return travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
  }

  // Colour of the page at a given progress: the brand gradient, sampled.
  function paint() {
    if (reduced) {
      // Static still: the section paints its own gradient. The header stays
      // blue while the blue hero is under it; past the journey, the section
      // themes own the header.
      if (section.getBoundingClientRect().bottom <= 40) return;
      const onHero = scrollY < innerHeight * 0.55;
      root.style.setProperty('--bg', onHero ? '#3335ff' : '#f7f7f7');
      root.style.setProperty('--fg', onHero ? '#f7f7f7' : '#000000');
      root.classList.toggle('on-blue', onHero);
      gl?.setInk([0.969, 0.969, 0.969]);
      for (const b of beats) { b.style.opacity = '1'; b.style.visibility = 'visible'; }
      return;
    }
    const s = smooth(0.36, 0.86, p);
    const bg = mix(BLUE, PAPER, s);
    const dark = s < 0.5;
    root.style.setProperty('--bg', hex(bg));
    root.style.setProperty('--fg', dark ? '#f7f7f7' : '#000000');
    root.classList.toggle('on-blue', dark);
    // Lines stay paper on blue, then turn to black as the field clears.
    const ink = smooth(0.46, 0.7, s);
    // The terrain fades out as the stage releases, so the descent exits clean.
    gl?.setInk([0.969 * (1 - ink), 0.969 * (1 - ink), 0.969 * (1 - ink)], 1 - smooth(0.93, 1, p));
    if (readoutEl) readoutEl.style.opacity = (1 - smooth(0.84, 0.92, p)).toFixed(3);
    if (p >= 0.08 && !coordsCleared) { window.dispatchEvent(new CustomEvent('xhair:coords', { detail: null })); coordsCleared = true; }
    if (p < 0.08) coordsCleared = false;
    gl?.setProgress(p);

    for (const b of beats) {
      const [a, z] = (b.dataset.beat || '0,1').split(',').map(Number);
      const fade = 0.035;
      const o = reduced ? 1 : Math.min(smooth(a - fade, a, p), 1 - smooth(z - fade, z, p));
      b.style.opacity = o.toFixed(3);
      b.style.transform = reduced ? '' : `translate3d(0, ${((1 - o) * (p < a ? 14 : -14)).toFixed(1)}px, 0)`;
      b.style.visibility = o < 0.01 ? 'hidden' : 'visible';
    }

    if (minMark && gl) {
      const m = gl.minOnScreen();
      const show = smooth(0.84, 0.94, p);
      minMark.style.opacity = show.toFixed(3);
      minMark.style.transform = `translate3d(${(m.x - 6).toFixed(1)}px, ${(m.y - 6).toFixed(1)}px, 0)`;
    }
  }

  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; p = progress(); paint(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { gl?.resize(); onScroll(); });

  // Readout: the lead particle's iterate, a few times a second.
  if (gl && !reduced) {
    setInterval(() => {
      if (document.hidden) return;
      const r = gl.readout();
      if (kEl) kEl.textContent = String(r.k).padStart(5, '0');
      if (fEl) fEl.textContent = fmt(r.f);
      if (gEl) gEl.textContent = r.g.toFixed(4);
      if (nEl) nEl.textContent = String(r.n);
    }, 120);
  }

  // Run the simulation only while the stage is on screen and the tab is visible.
  if (gl) {
    const io = new IntersectionObserver(([e]) => { e.isIntersecting && !document.hidden ? gl.start() : gl.stop(); });
    io.observe(stage);
    document.addEventListener('visibilitychange', () => (document.hidden ? gl.stop() : stage.getBoundingClientRect().bottom > 0 && gl.start()));

    // The cursor is a force; a click drops a burst of new particles.
    if (!coarse && !reduced) {
      stage.addEventListener('pointermove', (e) => {
        const d = gl.pointerMove(e.clientX, e.clientY);
        window.dispatchEvent(new CustomEvent('xhair:coords', { detail: d && p < 0.08 ? d : null }));
      });
      stage.addEventListener('pointerleave', () => { gl.pointerLeave(); window.dispatchEvent(new CustomEvent('xhair:coords', { detail: null })); });
    }
    if (!reduced) stage.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      gl.burst(e.clientX, e.clientY, coarse ? 180 : 360);
    });
  }

  p = progress();
  paint();
}
