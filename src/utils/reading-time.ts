const WORDS_PER_MINUTE = 200;

interface ReadingTimeResult {
  minutes: number;
  duration: string;
  wordCount: number;
}

function stripMarkdown(content: string): string {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove headings markup
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove MDX components/imports
    .replace(/^import\s+.*$/gm, '')
    .replace(/<\w+[\s\S]*?\/>/g, '')
    .trim();
}

export function getReadingTime(content: string): ReadingTimeResult {
  const text = stripMarkdown(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return {
    minutes,
    duration: `PT${minutes}M`,
    wordCount,
  };
}
