import { describe, test, expect } from 'vitest';
import { sortByDate, groupByYear } from './posts';

const makePost = (date: string, title = '') => ({ publishedAt: date, title });

// Mimics Astro content collection entries: { data: { publishedAt } }
const makeEntry = (date: string, title = '') => ({
  data: { publishedAt: new Date(date), title },
});
const entryAccessor = (p: ReturnType<typeof makeEntry>) => p.data.publishedAt;

describe('sortByDate', () => {
  test('sorts posts newest first', () => {
    const posts = [
      makePost('2025-02-04'),
      makePost('2025-12-29'),
      makePost('2025-02-14'),
    ];
    const sorted = sortByDate(posts);
    expect(sorted.map((p) => p.publishedAt)).toEqual([
      '2025-12-29',
      '2025-02-14',
      '2025-02-04',
    ]);
  });

  test('sorts across multiple years', () => {
    const posts = [
      makePost('2024-11-03'),
      makePost('2026-02-05'),
      makePost('2025-12-15'),
    ];
    const sorted = sortByDate(posts);
    expect(sorted.map((p) => p.publishedAt)).toEqual([
      '2026-02-05',
      '2025-12-15',
      '2024-11-03',
    ]);
  });

  test('does not mutate the original array', () => {
    const posts = [makePost('2025-12-29'), makePost('2025-02-04')];
    const original = [...posts];
    sortByDate(posts);
    expect(posts).toEqual(original);
  });

  test('returns empty array for empty input', () => {
    expect(sortByDate([])).toEqual([]);
  });

  test('handles single post', () => {
    const posts = [makePost('2025-06-15')];
    expect(sortByDate(posts)).toEqual(posts);
  });

  test('handles Date objects as publishedAt', () => {
    const posts = [
      { publishedAt: new Date('2025-01-01'), title: 'old' },
      { publishedAt: new Date('2025-12-01'), title: 'new' },
    ];
    const sorted = sortByDate(posts);
    expect(sorted[0].title).toBe('new');
    expect(sorted[1].title).toBe('old');
  });

  test('handles ISO string dates with time', () => {
    const posts = [
      makePost('2025-06-15T08:00:00Z'),
      makePost('2025-06-15T20:00:00Z'),
    ];
    const sorted = sortByDate(posts);
    expect(sorted[0].publishedAt).toBe('2025-06-15T20:00:00Z');
  });

  test('sorts with custom accessor for nested dates', () => {
    const entries = [
      makeEntry('2025-02-04', 'old'),
      makeEntry('2025-12-29', 'new'),
      makeEntry('2025-02-14', 'mid'),
    ];
    const sorted = sortByDate(entries, entryAccessor);
    expect(sorted.map((p) => p.data.title)).toEqual(['new', 'mid', 'old']);
  });
});

describe('groupByYear', () => {
  test('groups posts by year in descending order', () => {
    const posts = [
      makePost('2026-02-05', 'a'),
      makePost('2025-12-29', 'b'),
      makePost('2025-02-14', 'c'),
      makePost('2024-11-03', 'd'),
    ];
    const groups = groupByYear(posts);

    expect(groups).toHaveLength(3);
    expect(groups[0].year).toBe('2026');
    expect(groups[1].year).toBe('2025');
    expect(groups[2].year).toBe('2024');
  });

  test('preserves post order within each year group', () => {
    const posts = [
      makePost('2025-12-29', 'dec'),
      makePost('2025-02-14', 'feb-14'),
      makePost('2025-02-04', 'feb-04'),
    ];
    const groups = groupByYear(posts);

    expect(groups).toHaveLength(1);
    expect(groups[0].year).toBe('2025');
    expect(groups[0].posts.map((p) => p.title)).toEqual([
      'dec',
      'feb-14',
      'feb-04',
    ]);
  });

  test('returns correct post counts per year', () => {
    const posts = [
      makePost('2026-02-05'),
      makePost('2026-01-30'),
      makePost('2026-01-28'),
      makePost('2025-12-15'),
      makePost('2024-11-03'),
    ];
    const groups = groupByYear(posts);

    expect(groups[0].posts).toHaveLength(3); // 2026
    expect(groups[1].posts).toHaveLength(1); // 2025
    expect(groups[2].posts).toHaveLength(1); // 2024
  });

  test('returns empty array for empty input', () => {
    expect(groupByYear([])).toEqual([]);
  });

  test('handles single post', () => {
    const posts = [makePost('2025-06-15', 'only')];
    const groups = groupByYear(posts);

    expect(groups).toHaveLength(1);
    expect(groups[0].year).toBe('2025');
    expect(groups[0].posts).toHaveLength(1);
  });

  test('handles Date objects as publishedAt', () => {
    const posts = [
      { publishedAt: new Date('2026-01-01'), title: 'new-year' },
      { publishedAt: new Date('2025-06-15'), title: 'mid-year' },
    ];
    const groups = groupByYear(posts);

    expect(groups).toHaveLength(2);
    expect(groups[0].year).toBe('2026');
    expect(groups[1].year).toBe('2025');
  });

  test('years are always descending regardless of input order', () => {
    const posts = [
      makePost('2024-01-01'),
      makePost('2026-01-01'),
      makePost('2025-01-01'),
    ];
    const groups = groupByYear(posts);

    expect(groups.map((g) => g.year)).toEqual(['2026', '2025', '2024']);
  });

  test('groups with custom accessor for nested dates', () => {
    const entries = [
      makeEntry('2026-02-05', 'a'),
      makeEntry('2025-12-29', 'b'),
      makeEntry('2024-11-03', 'c'),
    ];
    const groups = groupByYear(entries, entryAccessor);

    expect(groups).toHaveLength(3);
    expect(groups[0].year).toBe('2026');
    expect(groups[0].posts[0].data.title).toBe('a');
    expect(groups[1].year).toBe('2025');
    expect(groups[2].year).toBe('2024');
  });

  test('sortByDate + groupByYear compose correctly', () => {
    const posts = [
      makePost('2025-02-04', 'feb-04'),
      makePost('2026-01-15', 'jan-26'),
      makePost('2025-12-29', 'dec-25'),
      makePost('2026-03-01', 'mar-26'),
    ];
    const sorted = sortByDate(posts);
    const groups = groupByYear(sorted);

    expect(groups.map((g) => g.year)).toEqual(['2026', '2025']);
    expect(groups[0].posts.map((p) => p.title)).toEqual(['mar-26', 'jan-26']);
    expect(groups[1].posts.map((p) => p.title)).toEqual(['dec-25', 'feb-04']);
  });
});
