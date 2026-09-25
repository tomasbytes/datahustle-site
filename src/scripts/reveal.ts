// Adds `.is-on` to [data-reveal] elements once they are well into view.
export function reveal(selector = '[data-reveal]') {
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-on')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); }
  }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}
