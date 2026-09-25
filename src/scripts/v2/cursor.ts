// A precision crosshair that replaces the pointer on fine-pointer devices.
// It shows coordinates: the landscape's (x, y) over the hero, screen pixels
// elsewhere. Over links and controls the gap opens; over text fields the
// native caret returns.
export function mountCrosshair() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const root = document.documentElement;
  const el = document.createElement('div');
  el.className = 'xhair';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="xh-h"></span><span class="xh-v"></span><span class="xh-l"></span>';
  document.body.appendChild(el);
  const label = el.querySelector<HTMLElement>('.xh-l')!;
  root.classList.add('has-xhair');

  let domain: { x: number; y: number } | null = null;
  window.addEventListener('xhair:coords', (e) => { domain = (e as CustomEvent).detail; });

  const pad = (n: number) => String(Math.round(n)).padStart(4, '0');
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    const t = e.target as HTMLElement;
    const field = t.closest('input, textarea, select');
    el.classList.toggle('is-hidden', !!field);
    el.classList.toggle('is-open', !field && !!t.closest('a, button, [role="slider"], input[type="range"], [data-toy-drag]'));
    label.textContent = domain
      ? `x ${domain.x >= 0 ? ' ' : ''}${domain.x.toFixed(3)}  y ${domain.y >= 0 ? ' ' : ''}${domain.y.toFixed(3)}`
      : `${pad(e.clientX)} · ${pad(e.clientY)}`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => el.classList.remove('is-hidden'));
}
