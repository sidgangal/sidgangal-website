import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pillar: z.enum(['build', 'invest', 'thrive']),
  format: z.string().optional(),
  topics: z.array(z.string()).optional(),
  publishedAt: z.coerce.date(),
  slug: z.string(),
});

const build = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/build' }),
  schema: postSchema,
});

const invest = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/invest' }),
  schema: postSchema,
});

const thrive = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/thrive' }),
  schema: postSchema,
});

export const collections = { build, invest, thrive };
