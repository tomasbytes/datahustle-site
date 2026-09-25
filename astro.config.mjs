// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://datahustle.ai',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  // /v2 is a design alternative under review: keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/v2') })],
});
