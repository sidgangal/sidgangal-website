import { describe, test, expect } from 'vitest';
import {
  resolveOgImage,
  generateBreadcrumbs,
  generateArticleSchema,
  generateBreadcrumbSchema,
  formatKeywords,
  generateSchemaGraph,
} from './seo-helpers';

describe('resolveOgImage', () => {
  const siteURL = 'https://example.com/';

  test('returns custom ogImage when provided', () => {
    const result = resolveOgImage(
      siteURL,
      'https://custom.com/image.png',
      'tech',
      'my-post'
    );
    expect(result).toBe('https://custom.com/image.png');
  });

  test('returns pillar/slug path when no custom ogImage', () => {
    const result = resolveOgImage(siteURL, undefined, 'tech', 'my-post');
    expect(result).toBe('https://example.com/og/tech/my-post.png');
  });

  test('returns default image when no ogImage or pillar/slug', () => {
    const result = resolveOgImage(siteURL, undefined, undefined, undefined);
    expect(result).toBe('https://example.com/og-default.png');
  });

  test('returns default image when only pillar provided', () => {
    const result = resolveOgImage(siteURL, undefined, 'tech', undefined);
    expect(result).toBe('https://example.com/og-default.png');
  });

  test('returns default image when only slug provided', () => {
    const result = resolveOgImage(siteURL, undefined, undefined, 'my-post');
    expect(result).toBe('https://example.com/og-default.png');
  });

  test('custom ogImage takes priority over pillar/slug', () => {
    const result = resolveOgImage(
      siteURL,
      'https://custom.com/priority.png',
      'tech',
      'my-post'
    );
    expect(result).toBe('https://custom.com/priority.png');
  });

  test('handles trailing slash in siteURL', () => {
    const result = resolveOgImage(
      'https://example.com/',
      undefined,
      'tech',
      'my-post'
    );
    expect(result).toBe('https://example.com/og/tech/my-post.png');
  });

  test('handles missing trailing slash in siteURL', () => {
    const result = resolveOgImage(
      'https://example.com',
      undefined,
      'tech',
      'my-post'
    );
    expect(result).toBe('https://example.com/og/tech/my-post.png');
  });
});

describe('generateBreadcrumbs', () => {
  const siteURL = 'https://example.com/';

  test('generates breadcrumbs for single-level path', () => {
    const breadcrumbs = generateBreadcrumbs('/blog/', siteURL);

    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com/',
    });
    expect(breadcrumbs[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://example.com/blog/',
    });
  });

  test('generates breadcrumbs for multi-level path', () => {
    const breadcrumbs = generateBreadcrumbs('/blog/tech/my-post/', siteURL);

    expect(breadcrumbs).toHaveLength(4);
    expect(breadcrumbs[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'Tech',
      item: 'https://example.com/blog/tech/',
    });
    expect(breadcrumbs[3]).toEqual({
      '@type': 'ListItem',
      position: 4,
      name: 'My post',
      item: 'https://example.com/blog/tech/my-post/',
    });
  });

  test('capitalizes first letter of segments', () => {
    const breadcrumbs = generateBreadcrumbs('/about/', siteURL);
    expect(breadcrumbs[1].name).toBe('About');
  });

  test('converts hyphens to spaces in segment names', () => {
    const breadcrumbs = generateBreadcrumbs('/my-blog-post/', siteURL);
    expect(breadcrumbs[1].name).toBe('My blog post');
  });

  test('handles root path (returns only Home)', () => {
    const breadcrumbs = generateBreadcrumbs('/', siteURL);
    expect(breadcrumbs).toHaveLength(1);
    expect(breadcrumbs[0].name).toBe('Home');
  });

  test('handles path without trailing slash', () => {
    const breadcrumbs = generateBreadcrumbs('/blog/tech', siteURL);
    expect(breadcrumbs).toHaveLength(3);
  });

  test('increments position correctly', () => {
    const breadcrumbs = generateBreadcrumbs('/a/b/c/d/', siteURL);
    expect(breadcrumbs[0].position).toBe(1);
    expect(breadcrumbs[1].position).toBe(2);
    expect(breadcrumbs[2].position).toBe(3);
    expect(breadcrumbs[3].position).toBe(4);
    expect(breadcrumbs[4].position).toBe(5);
  });

  test('builds correct item URLs for nested paths', () => {
    const breadcrumbs = generateBreadcrumbs('/blog/tech/post/', siteURL);
    expect(breadcrumbs[1].item).toBe('https://example.com/blog/');
    expect(breadcrumbs[2].item).toBe('https://example.com/blog/tech/');
    expect(breadcrumbs[3].item).toBe('https://example.com/blog/tech/post/');
  });
});

describe('generateArticleSchema', () => {
  const baseOptions = {
    title: 'Test Article',
    description: 'Test description',
    canonicalURL: 'https://example.com/blog/test/',
    publishedAt: '2024-01-01T00:00:00Z',
    siteURL: 'https://example.com/',
    ogImageURL: 'https://example.com/og/test.png',
  };

  test('generates basic article schema with required fields', () => {
    const schema = generateArticleSchema(baseOptions);

    expect(schema['@type']).toBe('Article');
    expect(schema['@id']).toBe('https://example.com/blog/test/');
    expect(schema.headline).toBe('Test Article');
    expect(schema.description).toBe('Test description');
    expect(schema.datePublished).toBe('2024-01-01T00:00:00Z');
    expect(schema.inLanguage).toBe('en-US');
  });

  test('includes dateModified when updatedAt provided', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      updatedAt: '2024-01-15T00:00:00Z',
    });

    expect(schema.dateModified).toBe('2024-01-15T00:00:00Z');
  });

  test('excludes dateModified when updatedAt not provided', () => {
    const schema = generateArticleSchema(baseOptions);
    expect(schema).not.toHaveProperty('dateModified');
  });

  test('includes articleSection when pillar provided', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      pillar: 'Technology',
    });

    expect(schema.articleSection).toBe('Technology');
  });

  test('includes keywords when provided', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      keywords: ['javascript', 'testing', 'vitest'],
    });

    expect(schema.keywords).toEqual(['javascript', 'testing', 'vitest']);
  });

  test('excludes keywords when empty array', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      keywords: [],
    });

    expect(schema).not.toHaveProperty('keywords');
  });

  test('includes wordCount when provided', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      wordCount: 1500,
    });

    expect(schema.wordCount).toBe(1500);
  });

  test('includes timeRequired when readingTime provided', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      readingTime: 'PT5M',
    });

    expect(schema.timeRequired).toBe('PT5M');
  });

  test('includes author reference', () => {
    const schema = generateArticleSchema(baseOptions);

    expect(schema.author).toEqual({ '@id': 'https://example.com/#author' });
    expect(schema.publisher).toEqual({ '@id': 'https://example.com/#author' });
  });

  test('includes mainEntityOfPage', () => {
    const schema = generateArticleSchema(baseOptions);
    expect(schema.mainEntityOfPage).toBe('https://example.com/blog/test/');
  });

  test('includes image object with correct dimensions', () => {
    const schema = generateArticleSchema(baseOptions);

    expect(schema.image).toEqual({
      '@type': 'ImageObject',
      url: 'https://example.com/og/test.png',
      width: 1200,
      height: 630,
    });
  });

  test('generates complete schema with all optional fields', () => {
    const schema = generateArticleSchema({
      ...baseOptions,
      updatedAt: '2024-01-15T00:00:00Z',
      pillar: 'Technology',
      keywords: ['test', 'schema'],
      wordCount: 2000,
      readingTime: 'PT10M',
    });

    expect(schema).toHaveProperty('dateModified');
    expect(schema).toHaveProperty('articleSection');
    expect(schema).toHaveProperty('keywords');
    expect(schema).toHaveProperty('wordCount');
    expect(schema).toHaveProperty('timeRequired');
  });
});

describe('generateBreadcrumbSchema', () => {
  const siteURL = 'https://example.com/';

  test('returns null for root path', () => {
    const schema = generateBreadcrumbSchema('/', siteURL);
    expect(schema).toBeNull();
  });

  test('returns null for empty path', () => {
    const schema = generateBreadcrumbSchema('', siteURL);
    expect(schema).toBeNull();
  });

  test('generates schema for single-level path', () => {
    const schema = generateBreadcrumbSchema('/blog/', siteURL);

    expect(schema).not.toBeNull();
    expect(schema!['@type']).toBe('BreadcrumbList');
    expect(schema!.itemListElement).toHaveLength(2);
  });

  test('generates schema for multi-level path', () => {
    const schema = generateBreadcrumbSchema('/blog/tech/post/', siteURL);

    expect(schema).not.toBeNull();
    expect(schema!.itemListElement).toHaveLength(4);
  });

  test('includes correct breadcrumb items', () => {
    const schema = generateBreadcrumbSchema('/blog/', siteURL);

    expect(schema!.itemListElement[0].name).toBe('Home');
    expect(schema!.itemListElement[1].name).toBe('Blog');
  });
});

describe('formatKeywords', () => {
  test('returns null for undefined keywords', () => {
    expect(formatKeywords(undefined)).toBeNull();
  });

  test('returns null for empty array', () => {
    expect(formatKeywords([])).toBeNull();
  });

  test('formats single keyword', () => {
    expect(formatKeywords(['javascript'])).toBe('javascript');
  });

  test('formats multiple keywords with comma separator', () => {
    expect(formatKeywords(['javascript', 'testing', 'vitest'])).toBe(
      'javascript, testing, vitest'
    );
  });

  test('preserves keyword spacing and case', () => {
    expect(formatKeywords(['React Hooks', 'TypeScript', 'Web Development'])).toBe(
      'React Hooks, TypeScript, Web Development'
    );
  });
});

describe('generateSchemaGraph', () => {
  const siteURL = 'https://example.com/';

  test('includes required schemas (person, website)', () => {
    const graph = generateSchemaGraph(siteURL, null, null, []);

    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@graph']).toHaveLength(2);
    expect(graph['@graph'][0]['@type']).toBe('Person');
    expect(graph['@graph'][1]['@type']).toBe('WebSite');
  });

  test('includes breadcrumb schema when provided', () => {
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };

    const graph = generateSchemaGraph(siteURL, breadcrumb, null, []);

    expect(graph['@graph']).toHaveLength(3);
    expect(graph['@graph'][2]['@type']).toBe('BreadcrumbList');
  });

  test('includes article schema when provided', () => {
    const article = {
      '@type': 'Article',
      headline: 'Test',
    };

    const graph = generateSchemaGraph(siteURL, null, article, []);

    expect(graph['@graph']).toHaveLength(3);
    expect(graph['@graph'][2]['@type']).toBe('Article');
  });

  test('includes additional schemas', () => {
    const faqSchema = {
      '@type': 'FAQPage',
      mainEntity: [],
    };

    const graph = generateSchemaGraph(siteURL, null, null, [faqSchema]);

    expect(graph['@graph']).toHaveLength(3);
    expect(graph['@graph'][2]['@type']).toBe('FAQPage');
  });

  test('filters out null schemas', () => {
    const graph = generateSchemaGraph(siteURL, null, null, []);

    expect(graph['@graph']).toHaveLength(2);
    expect(graph['@graph'].every((item) => item !== null)).toBe(true);
  });

  test('includes all schemas when all provided', () => {
    const breadcrumb = { '@type': 'BreadcrumbList', itemListElement: [] };
    const article = { '@type': 'Article', headline: 'Test' };
    const faq = { '@type': 'FAQPage', mainEntity: [] };

    const graph = generateSchemaGraph(siteURL, breadcrumb, article, [faq]);

    expect(graph['@graph']).toHaveLength(5); // person, website, breadcrumb, article, faq
  });

  test('person schema has correct properties', () => {
    const graph = generateSchemaGraph(siteURL, null, null, []);
    const personSchema = graph['@graph'][0];

    expect(personSchema['@type']).toBe('Person');
    expect(personSchema['@id']).toBe('https://example.com/#author');
    expect(personSchema.name).toBe('Sid Gangal');
    expect(personSchema.jobTitle).toBe('Writer & Technologist');
    expect(personSchema.sameAs).toHaveLength(2);
  });

  test('website schema has correct properties', () => {
    const graph = generateSchemaGraph(siteURL, null, null, []);
    const websiteSchema = graph['@graph'][1];

    expect(websiteSchema['@type']).toBe('WebSite');
    expect(websiteSchema['@id']).toBe('https://example.com/#website');
    expect(websiteSchema.name).toBe('The Useful Stack');
    expect(websiteSchema.publisher).toEqual({ '@id': 'https://example.com/#author' });
  });

  test('handles multiple additional schemas', () => {
    const schemas = [
      { '@type': 'FAQPage' },
      { '@type': 'HowTo' },
      { '@type': 'Review' },
    ];

    const graph = generateSchemaGraph(siteURL, null, null, schemas);

    expect(graph['@graph']).toHaveLength(5); // person, website, + 3 additional
  });
});
