type DateAccessor<T> = (post: T) => string | Date;

const defaultAccessor: DateAccessor<any> = (p) => p.publishedAt;

export function sortByDate<T>(
  posts: T[],
  getDate: DateAccessor<T> = defaultAccessor
): T[] {
  return [...posts].sort(
    (a, b) =>
      new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()
  );
}

export function groupByYear<T>(
  posts: T[],
  getDate: DateAccessor<T> = defaultAccessor
): { year: string; posts: T[] }[] {
  const groups: Record<string, T[]> = {};

  for (const post of posts) {
    const year = new Date(getDate(post)).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
  }

  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, posts: groups[year] }));
}
