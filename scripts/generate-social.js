#!/usr/bin/env node

/**
 * Social Content Generator
 *
 * Generates platform-optimized social media posts from blog content.
 *
 * Usage:
 *   npm run social:generate -- --post "invest/nebius-ai-infrastructure"
 *   npm run social:generate -- --recent
 *   npm run social:generate -- --pillar invest
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'content/posts');
const SOCIAL_DIR = path.join(ROOT_DIR, 'content/social');
const QUEUE_DIR = path.join(SOCIAL_DIR, 'queue');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--post' && args[i + 1]) {
      options.post = args[i + 1];
      i++;
    } else if (args[i] === '--recent') {
      options.recent = true;
    } else if (args[i] === '--pillar' && args[i + 1]) {
      options.pillar = args[i + 1];
      i++;
    } else if (args[i] === '--all') {
      options.all = true;
    }
  }

  return options;
}

// Parse frontmatter from MDX file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();

  const frontmatter = {};
  let currentKey = null;
  let currentValue = '';
  let inMultiline = false;
  let inArray = false;
  let arrayItems = [];

  for (const line of frontmatterStr.split('\n')) {
    // Handle array items
    if (inArray && line.match(/^\s+-\s+/)) {
      arrayItems.push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    } else if (inArray && !line.match(/^\s+-\s+/) && line.trim()) {
      frontmatter[currentKey] = arrayItems;
      inArray = false;
      arrayItems = [];
    }

    // Handle multiline strings
    if (inMultiline && (line.startsWith('  ') || line.trim() === '')) {
      currentValue += ' ' + line.trim();
      continue;
    } else if (inMultiline) {
      frontmatter[currentKey] = currentValue.trim();
      inMultiline = false;
    }

    // Parse key: value
    const keyMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();

      if (value === '>-' || value === '|') {
        inMultiline = true;
        currentValue = '';
      } else if (value === '') {
        // Check if next line starts array
        inArray = true;
        arrayItems = [];
      } else {
        frontmatter[currentKey] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  // Handle trailing multiline/array
  if (inMultiline) frontmatter[currentKey] = currentValue.trim();
  if (inArray && arrayItems.length) frontmatter[currentKey] = arrayItems;

  return { frontmatter, body };
}

// Extract key insights from post body
function extractInsights(body, count = 3) {
  // Remove markdown formatting for analysis
  const cleanBody = body
    .replace(/^##?\s+.*$/gm, '') // Remove headers
    .replace(/\|.*\|/g, '') // Remove tables
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .trim();

  // Split into paragraphs
  const paragraphs = cleanBody
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 100 && p.length < 500); // Substantial paragraphs

  // Return first N substantive paragraphs as insights
  return paragraphs.slice(0, count);
}

// Extract a compelling hook from the content
function extractHook(body, title) {
  const firstParagraph = body.split(/\n\n/)[0]?.trim() || '';

  // If first paragraph is compelling, use it
  if (firstParagraph.length > 50 && firstParagraph.length < 300) {
    return firstParagraph;
  }

  // Otherwise, create hook from title
  return `I wrote a deep dive on ${title}. Here's what I found.`;
}

// Generate LinkedIn post
function generateLinkedIn(post) {
  const { title, description, pillar, topics } = post.frontmatter;
  const insights = extractInsights(post.body, 3);
  const hook = extractHook(post.body, title);

  const pillarHashtags = {
    build: '#startups #founders #AI #tech #building',
    invest: '#investing #stocks #markets #wealth #AI',
    thrive: '#health #longevity #performance #wellness'
  };

  const topicHashtags = (topics || []).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

  const content = `${hook}

${insights.map((insight, i) => insight.split('. ').slice(0, 2).join('. ') + '.').join('\n\n')}

Full article on my site (link in comments).

What are your thoughts?

${pillarHashtags[pillar] || ''} ${topicHashtags}`.trim();

  return {
    platform: 'linkedin',
    content,
    notes: [
      'Post link in FIRST COMMENT, not in post body',
      'Best posting times: Tue-Thu, 8-10am or 12pm',
      'Consider adding a relevant image or chart'
    ]
  };
}

// Generate Twitter thread
function generateTwitter(post) {
  const { title, description, pillar, topics } = post.frontmatter;
  const insights = extractInsights(post.body, 4);
  const hook = extractHook(post.body, title);

  // Create thread
  const tweets = [];

  // Tweet 1: Hook
  const hookTweet = hook.length > 250
    ? hook.slice(0, 247) + '...'
    : hook;
  tweets.push(`${hookTweet}\n\nA thread:`);

  // Tweets 2-5: Insights (trimmed to 280 chars)
  insights.forEach((insight, i) => {
    const trimmed = insight.length > 270
      ? insight.slice(0, 267) + '...'
      : insight;
    tweets.push(trimmed);
  });

  // Final tweet: CTA
  tweets.push(`Full breakdown:\n[LINK]\n\nBookmark this thread and share if you found it useful.`);

  return {
    platform: 'twitter',
    content: tweets.map((t, i) => `TWEET ${i + 1}:\n${t}`).join('\n\n---\n\n'),
    notes: [
      'Post as thread (not individual tweets)',
      'Best times: Weekdays 12-3pm, 5-6pm',
      'Add [LINK] in final tweet'
    ]
  };
}

// Generate Instagram post
function generateInstagram(post) {
  const { title, description, pillar, topics } = post.frontmatter;
  const insights = extractInsights(post.body, 2);
  const hook = extractHook(post.body, title);

  const pillarHashtags = {
    build: '#startups #entrepreneur #founder #building #tech #startup #business #entrepreneurship #innovation #product #saas #techfounder #startuplife #businesstips #founderlife',
    invest: '#investing #stocks #stockmarket #finance #wealth #money #personalfinance #financialfreedom #investor #trading #wallstreet #investment #growthstocks #stockpicks #financialliteracy',
    thrive: '#health #wellness #longevity #biohacking #healthylifestyle #fitness #nutrition #mindset #performance #energy #selfimprovement #healthtips #wellbeing #lifestyle #optimization'
  };

  const content = `${hook.split('. ')[0]}.

${description || insights[0]?.split('. ').slice(0, 2).join('. ') + '.'}

${insights[1] ? insights[1].split('. ').slice(0, 2).join('. ') + '.' : ''}

Link in bio for the full breakdown.

.
.
.

${pillarHashtags[pillar] || ''}`.trim();

  return {
    platform: 'instagram',
    content,
    notes: [
      'Create carousel with key insights (5-7 slides)',
      'First slide: Hook/title',
      'Last slide: CTA to link in bio',
      'Best times: Tue 11am, Thu 2pm, Sat 9am',
      'Post hashtags as first comment OR at end of caption'
    ],
    carouselIdeas: [
      `Slide 1: "${title}" with eye-catching visual`,
      'Slide 2: The problem or opportunity',
      'Slide 3: Key insight #1',
      'Slide 4: Key insight #2',
      'Slide 5: Key numbers or stats',
      'Slide 6: "Link in bio for full breakdown"'
    ]
  };
}

// Generate Facebook post
function generateFacebook(post) {
  const { title, description, pillar } = post.frontmatter;
  const insights = extractInsights(post.body, 3);
  const hook = extractHook(post.body, title);

  const content = `${hook}

${insights.map(insight => insight).join('\n\n')}

I wrote up the full deep-dive on my site:
[LINK]

What do you think?`.trim();

  return {
    platform: 'facebook',
    content,
    notes: [
      'Replace [LINK] with actual URL',
      'Facebook allows links in post body',
      'Best times: Wed 11am-1pm, Fri 10-11am',
      'Consider boosting if engagement is good'
    ]
  };
}

// Format date as YYYY-MM-DD
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Write social content to queue
async function writeToQueue(post, socialContent, date) {
  const dateStr = formatDate(date);
  const queuePath = path.join(QUEUE_DIR, dateStr);

  // Create queue directory
  await fs.mkdir(queuePath, { recursive: true });

  const { frontmatter } = post;
  const slug = frontmatter.slug || path.basename(post.path, '.mdx');

  for (const social of socialContent) {
    const filename = `${social.platform}.md`;
    const filepath = path.join(queuePath, filename);

    const fileContent = `---
source: ${post.path}
sourceTitle: "${frontmatter.title}"
platform: ${social.platform}
pillar: ${frontmatter.pillar}
generated: ${new Date().toISOString()}
status: ready
---

# ${frontmatter.title}

## Content

${social.content}

## Notes

${social.notes.map(n => `- ${n}`).join('\n')}
${social.carouselIdeas ? `\n## Carousel Ideas\n\n${social.carouselIdeas.map(c => `- ${c}`).join('\n')}` : ''}

---
Generated from: ${frontmatter.pillar}/${slug}
Article URL: https://theusefulstack.com/${frontmatter.pillar}/${slug}
`;

    await fs.writeFile(filepath, fileContent);
  }

  return queuePath;
}

// Read and process a single post
async function processPost(postPath) {
  const fullPath = path.join(POSTS_DIR, postPath.endsWith('.mdx') ? postPath : `${postPath}.mdx`);

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      path: postPath,
      frontmatter,
      body
    };
  } catch (err) {
    console.error(`Error reading post: ${fullPath}`);
    throw err;
  }
}

// Get all posts
async function getAllPosts() {
  const posts = [];
  const pillars = ['build', 'invest', 'thrive'];

  for (const pillar of pillars) {
    const pillarDir = path.join(POSTS_DIR, pillar);
    try {
      const files = await fs.readdir(pillarDir);
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          posts.push(`${pillar}/${file}`);
        }
      }
    } catch (err) {
      // Pillar directory might not exist
    }
  }

  return posts;
}

// Get recent posts (last 7 days based on publishedAt)
async function getRecentPosts(days = 7) {
  const allPosts = await getAllPosts();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentPosts = [];

  for (const postPath of allPosts) {
    const post = await processPost(postPath);
    const publishedAt = post.frontmatter.publishedAt;

    if (publishedAt) {
      const postDate = new Date(publishedAt);
      if (postDate >= cutoff) {
        recentPosts.push(postPath);
      }
    }
  }

  return recentPosts;
}

// Get posts by pillar
async function getPostsByPillar(pillar) {
  const pillarDir = path.join(POSTS_DIR, pillar);
  const files = await fs.readdir(pillarDir);
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(f => `${pillar}/${f}`);
}

// Main function
async function main() {
  const options = parseArgs();

  // Ensure queue directory exists
  await fs.mkdir(QUEUE_DIR, { recursive: true });

  let postsToProcess = [];

  if (options.post) {
    postsToProcess = [options.post];
  } else if (options.recent) {
    postsToProcess = await getRecentPosts();
  } else if (options.pillar) {
    postsToProcess = await getPostsByPillar(options.pillar);
  } else if (options.all) {
    postsToProcess = await getAllPosts();
  } else {
    console.log(`
Social Content Generator

Usage:
  npm run social:generate -- --post "invest/nebius-ai-infrastructure"
  npm run social:generate -- --recent    # Posts from last 7 days
  npm run social:generate -- --pillar invest
  npm run social:generate -- --all

Output:
  Generated posts go to content/social/queue/YYYY-MM-DD/
`);
    return;
  }

  if (postsToProcess.length === 0) {
    console.log('No posts to process.');
    return;
  }

  console.log(`\nGenerating social content for ${postsToProcess.length} post(s)...\n`);

  for (const postPath of postsToProcess) {
    try {
      const post = await processPost(postPath);

      // Generate content for each platform
      const socialContent = [
        generateLinkedIn(post),
        generateTwitter(post),
        generateInstagram(post),
        generateFacebook(post)
      ];

      // Write to queue
      const queuePath = await writeToQueue(post, socialContent, new Date());

      console.log(`[OK] ${post.frontmatter.title}`);
      console.log(`    Queue: ${path.relative(ROOT_DIR, queuePath)}/`);
      console.log('');
      console.log('    [ ] LinkedIn  - linkedin.md');
      console.log('    [ ] Twitter   - twitter.md');
      console.log('    [ ] Instagram - instagram.md');
      console.log('    [ ] Facebook  - facebook.md');
      console.log('');

    } catch (err) {
      console.error(`[ERROR] ${postPath}: ${err.message}`);
    }
  }

  console.log(`\nDone! Open queue folder: code ${path.relative(process.cwd(), QUEUE_DIR)}`);
}

main().catch(console.error);
