import { describe, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { pillars } from '../content/pillars';

const POSTS_DIR = path.resolve('content/posts');

function parseFrontmatter(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return yaml.parse(match[1]) ?? {};
}

function getPostFiles() {
  return pillars.flatMap((pillar) => {
    const pillarDir = path.join(POSTS_DIR, pillar);
    return fs
      .readdirSync(pillarDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => ({
        pillar,
        file,
        filePath: path.join(pillarDir, file),
        routeSlug: path.basename(file, path.extname(file)),
      }));
  });
}

describe('content route integrity', () => {
  test('uses filenames, not frontmatter slug fields, as post route slugs', () => {
    for (const post of getPostFiles()) {
      const frontmatter = parseFrontmatter(post.filePath);
      expect(frontmatter.slug, post.file).toBeUndefined();
      expect(post.routeSlug.length, post.file).toBeGreaterThan(0);
    }
  });

  test('has unique route paths', () => {
    const routePaths = getPostFiles().map(
      (post) => `/${post.pillar}/${post.routeSlug}`
    );
    expect(new Set(routePaths).size).toBe(routePaths.length);
  });

  test('keeps frontmatter pillar aligned with the containing collection', () => {
    for (const post of getPostFiles()) {
      const frontmatter = parseFrontmatter(post.filePath);
      expect(frontmatter.pillar, post.file).toBe(post.pillar);
    }
  });
});
