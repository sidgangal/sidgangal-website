import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const CONTENT_DIR = path.resolve('content/posts/build');
const OG_DIR = path.resolve('public/og/build');
const IMAGES_DIR = path.resolve('public/images');

const ARTICLES = [
  {
    slug: 'founders-guide-early-customer-discounts',
    title: "A Founder's Guide to Early Customer Discounts",
    date: '2026-01-30',
  },
  {
    slug: 'how-to-vibecode-without-destroying-your-codebase',
    title: 'How to Vibecode Without Destroying Your Codebase',
    date: '2026-01-05',
  },
  {
    slug: 'ai-beyond-dashboards-doing-the-work',
    title:
      '5 Surprising Ways AI Is Moving Beyond Dashboards to Actually Do the Work',
    date: '2025-12-09',
  },
  {
    slug: 'solar-itc-cliff-demand-surge-and-drop',
    title:
      'The Solar ITC Cliff: A 50-75% Surge Followed by a 30-40% Demand Drop',
    date: '2025-06-25',
  },
  {
    slug: 'guidelines-for-building-software-products',
    title: 'Guidelines for Building Software Products',
    date: '2023-02-21',
  },
  {
    slug: 'solar-potential-estimation-iit-mandi',
    title: 'Case Study: Solar Potential Estimation at IIT Mandi',
    date: '2020-07-04',
  },
];

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return yaml.parse(match[1]);
}

function getBody(content: string) {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1].trim() : '';
}

function extractImageRefs(content: string): string[] {
  const refs: string[] = [];
  const regex = /!\[.*?\]\((\/images\/[^)]+)\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    refs.push(m[1]);
  }
  return refs;
}

describe('Content Migration: MDX file existence', () => {
  for (const article of ARTICLES) {
    test(`${article.slug}.mdx exists`, () => {
      const filePath = path.join(CONTENT_DIR, `${article.slug}.mdx`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  }
});

describe('Content Migration: Frontmatter validation', () => {
  for (const article of ARTICLES) {
    describe(article.slug, () => {
      const filePath = path.join(CONTENT_DIR, `${article.slug}.mdx`);

      test('has valid YAML frontmatter', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm).not.toBeNull();
      });

      test('title is present and non-empty', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.title).toBeTruthy();
        expect(fm.title.length).toBeGreaterThan(0);
      });

      test('slug matches filename', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.slug).toBe(article.slug);
      });

      test('pillar is build', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.pillar).toBe('build');
      });

      test('publishedAt is a valid date string', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.publishedAt).toBeTruthy();
        const date = new Date(fm.publishedAt);
        expect(date.toString()).not.toBe('Invalid Date');
      });

      test('description is present and >20 chars', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.description).toBeTruthy();
        expect(fm.description.length).toBeGreaterThan(20);
      });

      test('format is present', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(fm.format).toBeTruthy();
      });

      test('topics is a non-empty array', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        expect(Array.isArray(fm.topics)).toBe(true);
        expect(fm.topics.length).toBeGreaterThan(0);
      });
    });
  }
});

describe('Content Migration: Content body', () => {
  for (const article of ARTICLES) {
    test(`${article.slug} has >100 chars of body text`, () => {
      const filePath = path.join(CONTENT_DIR, `${article.slug}.mdx`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const body = getBody(content);
      expect(body.length).toBeGreaterThan(100);
    });
  }
});

describe('Content Migration: OG image existence', () => {
  for (const article of ARTICLES) {
    test(`OG image exists for ${article.slug}`, () => {
      const pngPath = path.join(OG_DIR, `${article.slug}.png`);
      const jpgPath = path.join(OG_DIR, `${article.slug}.jpg`);
      const exists = fs.existsSync(pngPath) || fs.existsSync(jpgPath);
      expect(exists).toBe(true);
    });
  }
});

describe('Content Migration: Inline images for solar-potential-estimation-iit-mandi', () => {
  const slug = 'solar-potential-estimation-iit-mandi';
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  test('has inline image references', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const refs = extractImageRefs(content);
    expect(refs.length).toBeGreaterThan(0);
  });

  test('all inline image files exist', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const refs = extractImageRefs(content);
    for (const ref of refs) {
      const imgPath = path.join('public', ref);
      expect(fs.existsSync(imgPath), `Missing image: ${ref}`).toBe(true);
    }
  });
});

describe('Content Migration: No broken image references', () => {
  for (const article of ARTICLES) {
    test(`${article.slug} has no broken image refs`, () => {
      const filePath = path.join(CONTENT_DIR, `${article.slug}.mdx`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const refs = extractImageRefs(content);
      for (const ref of refs) {
        const imgPath = path.join('public', ref);
        expect(fs.existsSync(imgPath), `Broken image: ${ref}`).toBe(true);
      }
    });
  }
});
