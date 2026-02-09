# SEO Implementation Guide

This document explains the SEO features implemented in this website and how to use them.

## Overview

The website has comprehensive SEO optimization including:
- Complete meta tags (title, description, author)
- Open Graph tags for rich social previews
- Twitter Card tags for enhanced Twitter/X sharing
- JSON-LD structured data (Person, WebSite, BreadcrumbList, Article)
- Sitemap generation
- robots.txt
- Favicon and Apple Touch Icon
- Non-blocking font loading for performance

## Meta Tags

### Automatic Tags (Every Page)

These tags are generated automatically by `BaseLayout.astro`:

- `<title>` - Page title with site name
- `<meta name="description">` - Page description
- `<meta name="author">` - Author attribution
- `<link rel="canonical">` - Canonical URL for SEO
- `<link rel="sitemap">` - Reference to sitemap

### Open Graph Tags

Full Open Graph implementation for rich social previews:

```html
<meta property="og:title" content="Page Title — Sid Gangal" />
<meta property="og:description" content="Page description" />
<meta property="og:type" content="website" or "article" />
<meta property="og:url" content="https://theusefulstack.com/path" />
<meta property="og:site_name" content="The Useful Stack" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://theusefulstack.com/og-default.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Page Title — The Useful Stack" />
```

For articles, additional tags are included:
- `article:published_time` - Publication date (ISO 8601)
- `article:modified_time` - Last modified date (ISO 8601)
- `article:section` - Pillar category (build/invest/thrive)
- `article:author` - Author name

### Twitter Card Tags

Enhanced Twitter Cards with large image previews:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@theusefulstack" />
<meta name="twitter:creator" content="@theusefulstack" />
<meta name="twitter:title" content="Page Title — Sid Gangal" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://theusefulstack.com/og-default.png" />
<meta name="twitter:image:alt" content="Page Title — The Useful Stack" />
```

## Structured Data (JSON-LD)

All pages include JSON-LD structured data for enhanced search engine understanding:

### Person Schema
```json
{
  "@type": "Person",
  "@id": "https://theusefulstack.com#author",
  "name": "Sid Gangal",
  "url": "https://theusefulstack.com",
  "sameAs": [
    "https://twitter.com/theusefulstack",
    "https://linkedin.com/in/sidgangal"
  ]
}
```

### WebSite Schema
```json
{
  "@type": "WebSite",
  "@id": "https://theusefulstack.com#website",
  "url": "https://theusefulstack.com",
  "name": "The Useful Stack",
  "description": "Build, Invest, Thrive.",
  "publisher": { "@id": "https://theusefulstack.com#author" }
}
```

### BreadcrumbList Schema
Automatically generated from URL path.

### Article Schema (Blog Posts Only)
```json
{
  "@type": "Article",
  "@id": "https://theusefulstack.com/invest/nebius-ai-infrastructure",
  "headline": "Article Title",
  "description": "Article description",
  "datePublished": "2025-02-01T00:00:00.000Z",
  "dateModified": "2025-02-09T00:00:00.000Z",
  "author": { "@id": "https://theusefulstack.com#author" },
  "publisher": { "@id": "https://theusefulstack.com#author" },
  "mainEntityOfPage": "https://theusefulstack.com/invest/nebius-ai-infrastructure",
  "articleSection": "invest"
}
```

## Custom OG Images

### Default Image

By default, all pages use `/public/og-default.png` (1200x630px) which displays:
- "The Useful Stack" heading
- "Build, Invest, Thrive." tagline
- "by Sid Gangal" attribution

### Custom Images Per Post

To use a custom OG image for a specific post:

1. **Create the image** (1200x630px recommended):
   - PNG or JPG format
   - 1200x630px for optimal display across platforms
   - Save to `/public/og/` directory

2. **Reference in frontmatter** or pass as prop to BaseLayout:

```astro
---
// In PostLayout.astro or individual page
<BaseLayout
  title="Article Title"
  description="Article description"
  ogImage="/og/my-custom-image.png"  // Relative to /public
/>
---
```

### Generating Images

A script is included to regenerate the default images:

```bash
npm run images:generate
```

This regenerates:
- `/public/favicon.svg` - Site favicon
- `/public/apple-touch-icon.png` - Apple Touch icon (180x180)
- `/public/og-default.png` - Default OG image (1200x630)

To create custom OG images for blog posts, consider:
- Using a design tool (Figma, Canva)
- Automating with a service (Vercel OG, imgix)
- Building a custom script with sharp/canvas

## Performance Optimizations

### Non-Blocking Font Loading

Google Fonts are loaded with the `media="print"` trick to prevent render-blocking:

```html
<link
  href="https://fonts.googleapis.com/css2?family=..."
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" />
</noscript>
```

This prevents fonts from blocking page render while still loading them asynchronously.

### Font Preconnect

DNS preconnect to Google Fonts reduces latency:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Sitemap

Sitemap is automatically generated by `@astrojs/sitemap`:

- Location: `/sitemap-index.xml`
- Referenced in: `<head>` and `robots.txt`
- Includes all static pages and blog posts
- Automatically updated on build

## robots.txt

Located at `/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://theusefulstack.com/sitemap-index.xml
```

All pages are crawlable by search engines.

## Testing Your SEO

### Tools

1. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Google Rich Results Test**: https://search.google.com/test/rich-results
5. **Schema Markup Validator**: https://validator.schema.org/

### What to Test

- [ ] OG image displays correctly on social platforms
- [ ] Title and description are accurate
- [ ] Structured data validates with no errors
- [ ] Sitemap is accessible and valid
- [ ] Favicon appears in browser tabs
- [ ] Canonical URLs are correct
- [ ] Twitter Card shows large image preview

## Best Practices

1. **Title Tags**: Keep under 60 characters
2. **Meta Descriptions**: Keep under 155 characters
3. **OG Images**: Use 1200x630px for optimal display
4. **Alt Text**: Always include for accessibility and SEO
5. **Structured Data**: Validate with Schema.org validator
6. **URLs**: Use descriptive slugs with hyphens
7. **Content**: Include H1 on every page, use semantic headings

## Future Enhancements

Consider adding:
- RSS feed (`@astrojs/rss`)
- Image optimization with Astro Image
- Per-post OG image generation automation
- Additional schema types (FAQ, HowTo, etc.)
- Breadcrumb navigation UI component
- hreflang tags for internationalization
