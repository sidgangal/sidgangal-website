/**
 * SEO helper functions extracted from BaseLayout for testing
 */

interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

interface ArticleSchemaOptions {
  title: string;
  description?: string;
  canonicalURL: string;
  publishedAt: string;
  updatedAt?: string;
  siteURL: string;
  pillar?: string;
  keywords?: string[];
  wordCount?: number;
  readingTime?: string;
  ogImageURL: string;
}

/**
 * Resolves OG image URL with priority: custom > pillar/slug > default
 */
export function resolveOgImage(
  siteURL: string,
  ogImage?: string,
  pillar?: string,
  slug?: string
): string {
  const baseURL = siteURL.endsWith('/') ? siteURL : `${siteURL}/`;
  if (ogImage) return ogImage;
  if (pillar && slug) return `${baseURL}og/${pillar}/${slug}.png`;
  return `${baseURL}og-default.png`;
}

/**
 * Generates breadcrumb items from URL pathname
 */
export function generateBreadcrumbs(
  pathname: string,
  siteURL: string
): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteURL },
    ...pathSegments.map((segment, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      item: `${siteURL}${pathSegments.slice(0, i + 1).join('/')}/`,
    })),
  ];

  return breadcrumbItems;
}

/**
 * Generates Article schema for blog posts
 */
export function generateArticleSchema(options: ArticleSchemaOptions) {
  const {
    title,
    description,
    canonicalURL,
    publishedAt,
    updatedAt,
    siteURL,
    pillar,
    keywords,
    wordCount,
    readingTime,
    ogImageURL,
  } = options;

  return {
    '@type': 'Article',
    '@id': canonicalURL,
    headline: title,
    description,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    author: { '@id': `${siteURL}#author` },
    publisher: { '@id': `${siteURL}#author` },
    mainEntityOfPage: canonicalURL,
    ...(pillar && { articleSection: pillar }),
    ...(keywords?.length && { keywords }),
    ...(wordCount && { wordCount }),
    ...(readingTime && { timeRequired: readingTime }),
    inLanguage: 'en-US',
    image: {
      '@type': 'ImageObject',
      url: ogImageURL,
      width: 1200,
      height: 630,
    },
  };
}

/**
 * Generates breadcrumb schema (returns null if no path segments)
 */
export function generateBreadcrumbSchema(
  pathname: string,
  siteURL: string
): { '@type': 'BreadcrumbList'; itemListElement: BreadcrumbItem[] } | null {
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: generateBreadcrumbs(pathname, siteURL),
  };
}

/**
 * Formats keywords array for meta tag
 */
export function formatKeywords(keywords?: string[]): string | null {
  if (!keywords || keywords.length === 0) {
    return null;
  }
  return keywords.join(', ');
}

/**
 * Generates the complete JSON-LD schema graph
 */
export function generateSchemaGraph(
  siteURL: string,
  breadcrumbSchema: object | null,
  articleSchema: object | null,
  additionalSchemas: object[]
): object {
  const personSchema = {
    '@type': 'Person',
    '@id': `${siteURL}#author`,
    name: 'Sid Gangal',
    url: siteURL,
    jobTitle: 'Writer & Technologist',
    description: 'Building, investing, and sharing what works.',
    sameAs: [
      'https://twitter.com/theusefulstack',
      'https://linkedin.com/in/sidgangal',
    ],
  };

  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${siteURL}#website`,
    url: siteURL,
    name: 'The Useful Stack',
    description: 'Build, Invest, Thrive.',
    publisher: { '@id': `${siteURL}#author` },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      websiteSchema,
      breadcrumbSchema,
      articleSchema,
      ...additionalSchemas,
    ].filter(Boolean),
  };
}
