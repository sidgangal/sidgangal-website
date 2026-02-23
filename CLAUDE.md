# Personal Website (theusefulstack.com)

## Roughwork subdirectory

`public/roughwork/` contains a **separate React app** (Aerem Demo) that is served at `/roughwork/`. It is completely isolated from the main Astro site.

### Rules

- **Never modify files inside `public/roughwork/` directly.** They are build output copied from the Aerem Demo project (`/Users/sidgangal/Code/4. Aerem Demo`).
- **Never include `/roughwork/` in the sitemap, SEO, or any main site navigation.**
- Preserve the `_headers` rule that adds `X-Robots-Tag: noindex` for `/roughwork/*`.
- Preserve the `Disallow: /roughwork/` rule in `robots.txt`.
- Preserve the `_redirects` SPA fallback for `/roughwork/*`.
