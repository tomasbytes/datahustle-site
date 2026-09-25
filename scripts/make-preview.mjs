// Build a self-contained preview of the site for sharing as a hosted page:
// fonts and images are inlined as data URIs, and root-relative links become
// relative so the pages work from any folder.
// Usage: PUBLIC_DISABLE_GTM=1 npx astro build --outDir preview-build && node scripts/make-preview.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';

const SRC = 'preview-build';
const OUT = process.argv[2] || 'preview';
const MIME = { '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const dataUri = (p) => `data:${MIME[extname(p)]};base64,${readFileSync(join(SRC, p)).toString('base64')}`;

const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (p.endsWith('.html')) pages.push(relative(SRC, p));
});
walk(SRC);

const pageFor = (href) => {
  const clean = href.replace(/[#?].*$/, '');
  const hash = href.slice(clean.length);
  if (clean === '/' || clean === '') return 'index.html' + hash;
  return clean.replace(/^\//, '') + '.html' + hash;
};

for (const page of pages) {
  let html = readFileSync(join(SRC, page), 'utf8');
  html = html.replace(/url\((['"]?)\/(fonts\/[^)'"]+)\1\)/g, (_, q, p) => `url(${dataUri(p)})`);
  html = html.replace(/src="\/(clients\/[^"]+)"/g, (_, p) => `src="${dataUri(p)}"`);
  html = html.replace(/<link rel="preload"[^>]*>/g, '');
  // Bundled module scripts become inline modules.
  html = html.replace(/<script type="module" src="\/(_astro\/[^"]+)"><\/script>/g, (_, p) => `<script type="module">${readFileSync(join(SRC, p), 'utf8')}</script>`);
  html = html.replace(/href="\/(favicon\.svg|favicon-32\.png|apple-touch-icon\.png)"/g, (_, p) => `href="${dataUri(p)}"`);
  // Internal page links → relative .html files.
  html = html.replace(/href="(\/[^"]*)"/g, (m, href) => {
    if (/\.(xml|png|svg|txt)$/.test(href)) return m;
    const target = pageFor(href);
    return `href="${relative(dirname(page), target) || target}"`;
  });
  html = html.replace('action="/contact?sent=1"', 'action="contact.html?sent=1"');
  const out = join(OUT, page);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
console.log(pages.join('\n'));
