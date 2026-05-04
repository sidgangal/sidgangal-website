import { describe, test, expect } from 'vitest';
import { findRelatedPosts } from './related-posts';

type PostEntry = Parameters<typeof findRelatedPosts>[3][number];

function makePost(
  slug: string,
  pillar: 'build' | 'invest' | 'thrive',
  topics: string[] = [],
  title = slug,
  description = `Description for ${slug}`,
): PostEntry {
  return {
    id: slug,
    data: { pillar, topics, title, description, publishedAt: new Date('2025-06-15') },
  };
}

describe('findRelatedPosts', () => {
  test('excludes the current article from results', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('other', 'build', ['ai']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    expect(result.every((p) => p.slug !== 'current')).toBe(true);
  });

  test('returns articles sorted by topic overlap score', () => {
    const posts = [
      makePost('current', 'build', ['ai', 'startups', 'engineering']),
      makePost('high-match', 'build', ['ai', 'startups', 'engineering']),
      makePost('medium-match', 'build', ['ai', 'startups']),
      makePost('low-match', 'build', ['ai']),
      makePost('no-match', 'build', ['finance']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai', 'startups', 'engineering'], posts);
    expect(result[0].slug).toBe('high-match');
    expect(result[1].slug).toBe('medium-match');
    expect(result[2].slug).toBe('low-match');
  });

  test('gives cross-pillar articles a bonus point', () => {
    const posts = [
      makePost('current', 'build', ['ai', 'startups']),
      makePost('same-pillar', 'build', ['ai']),
      makePost('cross-pillar', 'invest', ['ai']),
    ];

    // same-pillar: 2 points (1 topic match * 2)
    // cross-pillar: 2 points (1 topic * 2) + 1 bonus = 3 points
    const result = findRelatedPosts('current', 'build', ['ai', 'startups'], posts);
    expect(result[0].slug).toBe('cross-pillar');
    expect(result[1].slug).toBe('same-pillar');
  });

  test('returns max count results (default 3)', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('a', 'build', ['ai']),
      makePost('b', 'invest', ['ai']),
      makePost('c', 'thrive', ['ai']),
      makePost('d', 'build', ['ai']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    expect(result).toHaveLength(3);
  });

  test('respects custom count parameter', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('a', 'build', ['ai']),
      makePost('b', 'invest', ['ai']),
      makePost('c', 'thrive', ['ai']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts, 2);
    expect(result).toHaveLength(2);
  });

  test('falls back to recent articles from other pillars when no topic overlap', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('other-build', 'build', ['finance']),
      makePost('invest-article', 'invest', ['stocks']),
      makePost('thrive-article', 'thrive', ['health']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    // Should return articles from other pillars as fallback
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((p) => p.pillar !== 'build')).toBe(true);
  });

  test('returns empty array when no other articles exist', () => {
    const posts = [makePost('current', 'build', ['ai'])];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    expect(result).toEqual([]);
  });

  test('returns correct shape for each result', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('related', 'invest', ['ai'], 'Related Article', 'A related description'),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    expect(result[0]).toEqual({
      title: 'Related Article',
      slug: 'related',
      pillar: 'invest',
      description: 'A related description',
    });
  });

  test('handles articles with no topics gracefully', () => {
    const posts = [
      makePost('current', 'build', ['ai']),
      makePost('no-topics', 'invest', []),
      makePost('has-topics', 'invest', ['ai']),
    ];

    const result = findRelatedPosts('current', 'build', ['ai'], posts);
    expect(result[0].slug).toBe('has-topics');
  });
});
