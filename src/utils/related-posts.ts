export interface RelatedPost {
  title: string;
  slug: string;
  pillar: 'build' | 'invest' | 'thrive';
  description: string;
}

interface PostEntry {
  data: {
    slug: string;
    pillar: string;
    topics?: string[];
    title: string;
    description: string;
    publishedAt: Date;
  };
}

export function findRelatedPosts(
  currentSlug: string,
  currentPillar: string,
  currentTopics: string[],
  allPosts: PostEntry[],
  count = 3,
): RelatedPost[] {
  const candidates = allPosts.filter((p) => p.data.slug !== currentSlug);

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
    slug: post.data.slug,
    pillar: post.data.pillar as RelatedPost['pillar'],
    description: post.data.description,
  }));
}
