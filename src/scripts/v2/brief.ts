// The contact brief: four numbered fields. Each valid field moves a point
// one step down a small descent curve; a successful submit takes it to the
// minimum, where it turns blue. Submission goes to Netlify Forms and pushes
// `form_submit` to the dataLayer.
export function mountBrief(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const dot = root.querySelector<SVGGElement>('[data-dot]')!;
  const stepsEl = root.querySelector<HTMLElement>('[data-k-out]')!;
  const sent = root.querySelector<HTMLElement>('[data-sent]')!;
  const err = root.querySelector<HTMLElement>('[data-form-error]')!;
  const button = root.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const label = root.querySelector<HTMLElement>('[data-label]')!;
  const stops = JSON.parse(root.dataset.stops || '[]') as [number, number][];
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')];

  const ok = (f: HTMLInputElement | HTMLTextAreaElement) => f.value.trim() !== '' && f.checkValidity();
  function move(k: number, done = false) {
    const [x, y] = stops[Math.min(k, stops.length - 1)];
    dot.style.transform = `translate(${x}px, ${y}px)`;
    root.classList.toggle('is-done', done);
    stepsEl.textContent = done ? 'minimum reached' : `k = ${k}`;
  }
  const progress = () => move(fields.filter(ok).length);
  fields.forEach((f) => {
    f.addEventListener('input', () => { progress(); if (f.getAttribute('aria-invalid') === 'true') validate(f); });
    f.addEventListener('blur', () => { if (f.value) validate(f); });
  });
  function validate(f: HTMLInputElement | HTMLTextAreaElement) {
    const good = ok(f);
    f.setAttribute('aria-invalid', String(!good));
    const e = f.closest('.field')?.querySelector<HTMLElement>('[data-error]');
    if (e) e.hidden = good;
    return good;
  }
  if (new URLSearchParams(location.search).has('sent')) { form.hidden = true; sent.hidden = false; move(stops.length - 1, true); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const bad = fields.filter((f) => !validate(f));
    if (bad.length) { bad[0].focus(); return; }
    button.disabled = true;
    label.textContent = 'Sending…';
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw new Error(String(res.status));
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'form_submit', form_name: 'strategy-session' });
      move(stops.length - 1, true);
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
    } catch {
      err.hidden = false;
      button.disabled = false;
      label.textContent = 'Send the brief';
    }
  });
  progress();
}
