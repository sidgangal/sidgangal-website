import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.argv.includes('build');

const integrations = [mdx(), sitemap(), react()];

if (!isProduction) {
  const keystatic = (await import('@keystatic/astro')).default;
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://sidgangal.com',
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
});
