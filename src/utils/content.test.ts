import { describe, expect, test } from 'vitest';
import { getEntrySlug, getPostHref } from './content';

describe('getEntrySlug', () => {
  test('uses the collection entry id as the route slug', () => {
    expect(getEntrySlug({ id: 'how-to-talk-to-customers' })).toBe(
      'how-to-talk-to-customers'
    );
  });

  test('normalizes index-based content ids', () => {
    expect(getEntrySlug({ id: 'how-to-talk-to-customers/index' })).toBe(
      'how-to-talk-to-customers'
    );
  });

  test('normalizes ids that include MDX extensions', () => {
    expect(getEntrySlug({ id: 'how-to-talk-to-customers.mdx' })).toBe(
      'how-to-talk-to-customers'
    );
  });
});

describe('getPostHref', () => {
  test('builds pillar-prefixed post URLs', () => {
    expect(
      getPostHref({
        id: 'how-asset-prices-actually-work',
        data: { pillar: 'invest' },
      })
    ).toBe('/invest/how-asset-prices-actually-work');
  });
});
