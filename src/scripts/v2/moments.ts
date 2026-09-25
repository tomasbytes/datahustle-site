// Smaller moments: count-up stats, report cards that open, founder focus
// plots, the closing landscape, and section-aware page colours.
import { createLandscape } from './landscape-gl';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Stats: count up once, ease-out, when the band arrives.
export function mountStats(band: HTMLElement) {
  const nums = [...band.querySelectorAll<HTMLElement>('[data-count]')];
  const run = () => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = reduced() ? 1 : Math.min(1, (now - t0) / 1400), e = 1 - (1 - t) ** 4;
      nums.forEach((n) => (n.textContent = String(Math.round(+n.dataset.count! * e))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.5 }).observe(band);
}

// Findings: a card opens like a report; its chart draws across the width.
export function mountReports(list: HTMLElement) {
  list.querySelectorAll<HTMLButtonElement>('[data-report-toggle]').forEach((btn) => {
    const card = btn.closest<HTMLElement>('[data-report]')!;
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      const fig = card.querySelector<HTMLElement>('.fig');
      if (fig) { fig.classList.remove('is-on'); if (open) requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.add('is-on'))); }
    });
  });
}

// Closing: the landscape again, now nearly flat. Runs only while visible.
export function mountClosing(section: HTMLElement) {
  const canvas = section.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return;
  const lite = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
  const gl = createLandscape(canvas, { tier: lite ? 'lite' : 'full', flat: true, staticFrame: reduced() });
  if (!gl) return;
  gl.setInk([0.969, 0.969, 0.969], 0.8);
  new IntersectionObserver(([e]) => (e.isIntersecting ? gl.start() : gl.stop())).observe(section);
  addEventListener('resize', () => gl.resize());
}

// The header and the crosshair take the colours of the section beneath them.
const THEMES: Record<string, [string, string]> = { paper: ['#f7f7f7', '#000000'], black: ['#000000', '#f7f7f7'], blue: ['#3335ff', '#f7f7f7'] };
export function mountThemes(journey: HTMLElement | null) {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll<HTMLElement>('[data-theme]')];
  const apply = () => {
    if (journey && journey.getBoundingClientRect().bottom > 40) return; // the journey paints itself
    const y = 36;
    const s = sections.find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const [bg, fg] = THEMES[s?.dataset.theme || 'paper'];
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--fg', fg);
    root.classList.toggle('on-blue', s?.dataset.theme === 'blue');
    root.classList.toggle('on-black', s?.dataset.theme === 'black');
  };
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; apply(); }); }, { passive: true });
  apply();
}
