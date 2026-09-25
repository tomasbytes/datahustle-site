import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Pulse articles: add a Markdown file to src/content/pulse/ to publish.
const pulse = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pulse' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pulse };
