import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { type Pillar } from './content/pillars';

const optionalPublicPath = z
  .union([z.string().regex(/^\/.+/), z.literal('')])
  .optional();

const postSchema = (pillar: Pillar) => z.object({
  title: z.string(),
  description: z.string(),
  pillar: z.literal(pillar),
  format: z.string(),
  topics: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
  keywords: z.array(z.string()).optional(),
  updatedAt: z.coerce.date().optional(),
  coverImage: optionalPublicPath,
});

const build = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/build' }),
  schema: postSchema('build'),
});

const invest = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/invest' }),
  schema: postSchema('invest'),
});

const thrive = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/posts/thrive' }),
  schema: postSchema('thrive'),
});

export const collections = { build, invest, thrive };
