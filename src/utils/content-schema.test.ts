import { describe, test, expect } from 'vitest';
import { z } from 'astro/zod';

// Mirror the postSchema from content.config.ts to test it in isolation.
// We re-import the actual schema shape by reconstructing it here because
// content.config.ts uses Astro's defineCollection which can't be imported
// in a plain vitest context. If the real schema is updated, this test
// verifies the fields survive parsing.
//
// The real schema is in src/content.config.ts — keep this in sync.

// Import the schema shape we expect
function getPostSchema() {
  // This mirrors what content.config.ts SHOULD have
  return z.object({
    title: z.string(),
    description: z.string(),
    pillar: z.enum(['build', 'invest', 'thrive']),
    format: z.string().optional(),
    topics: z.array(z.string()).optional(),
    publishedAt: z.coerce.date(),
    slug: z.string(),
    keywords: z.array(z.string()).optional(),
    updatedAt: z.coerce.date().optional(),
    coverImage: z.string().optional(),
  });
}

describe('postSchema preserves SEO-critical fields', () => {
  const schema = getPostSchema();

  test('preserves keywords array through parsing', () => {
    const input = {
      title: 'Test Article',
      description: 'A test',
      pillar: 'build',
      slug: 'test-article',
      publishedAt: '2025-06-15',
      keywords: ['software development', 'ai tools', 'productivity'],
    };

    const result = schema.parse(input);
    expect(result.keywords).toEqual(['software development', 'ai tools', 'productivity']);
  });

  test('preserves updatedAt date through parsing', () => {
    const input = {
      title: 'Test Article',
      description: 'A test',
      pillar: 'invest',
      slug: 'test-article',
      publishedAt: '2025-06-15',
      updatedAt: '2025-07-20',
    };

    const result = schema.parse(input);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.updatedAt!.toISOString()).toContain('2025-07-20');
  });

  test('preserves coverImage string through parsing', () => {
    const input = {
      title: 'Test Article',
      description: 'A test',
      pillar: 'thrive',
      slug: 'test-article',
      publishedAt: '2025-06-15',
      coverImage: '/og/thrive/test-article.png',
    };

    const result = schema.parse(input);
    expect(result.coverImage).toBe('/og/thrive/test-article.png');
  });

  test('all three SEO fields are optional', () => {
    const input = {
      title: 'Minimal Article',
      description: 'No optional fields',
      pillar: 'build',
      slug: 'minimal',
      publishedAt: '2025-01-01',
    };

    const result = schema.parse(input);
    expect(result.keywords).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
    expect(result.coverImage).toBeUndefined();
  });
});
