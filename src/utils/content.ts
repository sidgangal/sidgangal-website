import type { Pillar } from '../content/pillars';

interface ContentEntry {
  id: string;
}

interface PostEntry extends ContentEntry {
  data: {
    pillar: Pillar;
  };
}

export function getEntrySlug(entry: ContentEntry): string {
  return entry.id.replace(/\/index$/, '').replace(/\.(md|mdx)$/, '');
}

export function getPostHref(entry: PostEntry): string {
  return `/${entry.data.pillar}/${getEntrySlug(entry)}`;
}
