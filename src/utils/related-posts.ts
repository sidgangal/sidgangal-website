import type { Pillar } from '../content/pillars';
import { getEntrySlug } from './content';

export interface RelatedPost {
  title: string;
  slug: string;
  pillar: Pillar;
  description: string;
}

interface PostEntry {
  id: string;
  data: {
    pillar: Pillar;
    topics?: string[];
    title: string;
    description: string;
    publishedAt: Date;
  };
}

export function findRelatedPosts(
  currentSlug: string,
  currentPillar: Pillar,
  currentTopics: string[],
  allPosts: PostEntry[],
  count = 3,
): RelatedPost[] {
  const candidates = allPosts.filter(
    (post) => !(getEntrySlug(post) === currentSlug && post.data.pillar === currentPillar),
  );

  if (candidates.length === 0) return [];

  const scored = candidates.map((post) => {
    const postTopics = post.data.topics ?? [];
    const topicOverlap = currentTopics.filter((t) => postTopics.includes(t)).length;
    const score = topicOverlap * 2 + (post.data.pillar !== currentPillar ? 1 : 0);
    return { post, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.data.publishedAt.getTime() - a.post.data.publishedAt.getTime();
  });

  // If top results have no topic overlap, fill with cross-pillar articles
  const hasTopicMatches = scored.some((s) => s.score >= 2);
  const pool = hasTopicMatches
    ? scored
    : scored.filter((s) => s.post.data.pillar !== currentPillar).concat(
        scored.filter((s) => s.post.data.pillar === currentPillar),
      );

  return pool.slice(0, count).map(({ post }) => ({
    title: post.data.title,
    slug: getEntrySlug(post),
    pillar: post.data.pillar,
    description: post.data.description,
  }));
}
