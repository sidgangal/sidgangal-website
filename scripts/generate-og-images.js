#!/usr/bin/env node

/**
 * Generate OG images (default + per-post)
 * Requires: sharp (already in dependencies)
 * Usage: node scripts/generate-og-images.js
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const CONTENT_DIR = path.resolve(__dirname, '../content/posts');

const PILLAR_LABELS = {
  build: 'BUILD',
  invest: 'INVEST',
  thrive: 'THRIVE',
};

const PILLAR_COLORS = {
  build: '#4a90d9',
  invest: '#2ecc71',
  thrive: '#e74c3c',
};

// Generate 180x180 Apple Touch Icon
async function generateAppleTouchIcon() {
  const svg = `
    <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" fill="#1a1a1a"/>
      <text x="90" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="108" font-weight="700" fill="#f5f5dc" text-anchor="middle" dominant-baseline="central">S</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  console.log('Created apple-touch-icon.png');
}

// Generate 1200x630 default OG image
async function generateDefaultOGImage() {
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1a1a1a"/>
      <text x="600" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="#f5f5dc" text-anchor="middle">The Useful Stack</text>
      <text x="600" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="400" fill="#c0b896" text-anchor="middle">Build, Invest, Thrive.</text>
      <text x="600" y="460" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="500" fill="#8a8570" text-anchor="middle">by Sid Gangal</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'og-default.png'));

  console.log('Created og-default.png');
}

/**
 * Wrap title text into lines that fit within maxWidth (approximate).
 * Uses ~0.55 chars-per-em ratio for system sans-serif at given font size.
 */
function wrapText(text, fontSize, maxWidth) {
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.55));
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > charsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  return lines.slice(0, 3); // Max 3 lines
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate per-post OG image
async function generatePostOGImage(title, pillar, slug) {
  const fontSize = 52;
  const lines = wrapText(title, fontSize, 1000);
  const lineHeight = fontSize * 1.3;
  const totalTextHeight = lines.length * lineHeight;
  const startY = 250 - (totalTextHeight / 2) + fontSize;
  const pillarColor = PILLAR_COLORS[pillar] || '#c0b896';
  const pillarLabel = PILLAR_LABELS[pillar] || pillar.toUpperCase();

  const titleLines = lines
    .map((line, i) => {
      const y = startY + i * lineHeight;
      return `<text x="600" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="#1a1a1a" text-anchor="middle">${escapeXml(line)}</text>`;
    })
    .join('\n      ');

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f5f5dc"/>
      <rect x="0" y="0" width="1200" height="8" fill="${pillarColor}"/>
      <rect x="80" y="60" width="120" height="36" rx="4" fill="${pillarColor}"/>
      <text x="140" y="84" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${pillarLabel}</text>
      ${titleLines}
      <line x1="100" y1="460" x2="1100" y2="460" stroke="#d4d0c0" stroke-width="1"/>
      <text x="600" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#6b6555" text-anchor="middle">The Useful Stack</text>
      <text x="600" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#8a8570" text-anchor="middle">by Sid Gangal</text>
    </svg>
  `;

  const outputDir = path.join(PUBLIC_DIR, 'og', pillar);
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${slug}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);

  console.log(`Created og/${pillar}/${slug}.png`);
}

/**
 * Parse frontmatter from an MDX file to extract title, slug, and pillar.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = match[1];
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!m) return null;
    // Strip surrounding YAML quotes
    return m[1].trim().replace(/^["'](.*)["']$/, '$1');
  };

  return {
    title: get('title'),
    slug: get('slug'),
    pillar: get('pillar'),
  };
}

async function generatePostImages() {
  const pillars = ['build', 'invest', 'thrive'];
  let count = 0;

  for (const pillar of pillars) {
    const pillarDir = path.join(CONTENT_DIR, pillar);
    if (!fs.existsSync(pillarDir)) continue;

    const files = fs.readdirSync(pillarDir).filter((f) => f.endsWith('.mdx'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(pillarDir, file), 'utf-8');
      const meta = parseFrontmatter(content);

      if (!meta?.title || !meta?.slug) {
        console.warn(`Skipping ${pillar}/${file}: missing title or slug`);
        continue;
      }

      await generatePostOGImage(meta.title, pillar, meta.slug);
      count++;
    }
  }

  return count;
}

async function main() {
  try {
    await generateAppleTouchIcon();
    await generateDefaultOGImage();
    const postCount = await generatePostImages();
    console.log(`\nAll images generated successfully! (${postCount} post images)`);
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

main();
