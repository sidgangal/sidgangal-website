import { describe, test, expect } from 'vitest';
import { getReadingTime } from './reading-time';

describe('getReadingTime', () => {
  // TDD Cycle 1: Returns 1 minute for empty string
  test('returns 1 minute for empty string', () => {
    const result = getReadingTime('');
    expect(result.minutes).toBe(1);
    expect(result.duration).toBe('PT1M');
  });

  // TDD Cycle 2: Returns 1 minute for whitespace only
  test('returns 1 minute for whitespace only', () => {
    const result = getReadingTime('   \n\n   \t  ');
    expect(result.minutes).toBe(1);
  });

  // TDD Cycle 3: Counts words correctly for simple text
  test('counts words correctly for simple text', () => {
    const text = 'This is a simple test with ten words in total here';
    const result = getReadingTime(text);
    expect(result.wordCount).toBe(11);
    expect(result.minutes).toBe(1); // 11 words < 200
  });

  // TDD Cycle 4: Returns 1 minute for 199 words (boundary)
  test('returns 1 minute for 199 words (boundary)', () => {
    const words = Array(199).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(199);
    expect(result.minutes).toBe(1);
  });

  // TDD Cycle 5: Returns 1 minute for 200 words (boundary)
  test('returns 1 minute for 200 words (boundary)', () => {
    const words = Array(200).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(200);
    expect(result.minutes).toBe(1);
  });

  // TDD Cycle 6: Returns 2 minutes for 201 words (boundary)
  test('returns 2 minutes for 201 words (boundary)', () => {
    const words = Array(201).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(201);
    expect(result.minutes).toBe(2);
  });

  // TDD Cycle 7: Returns 5 minutes for 1000 words
  test('returns 5 minutes for 1000 words', () => {
    const words = Array(1000).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(1000);
    expect(result.minutes).toBe(5);
  });

  // TDD Cycle 8: Strips frontmatter from content
  test('strips frontmatter from content', () => {
    const content = `---
title: Test Post
date: 2024-01-01
tags: [test, demo]
---

This is the actual content with twenty words to make sure we count only content not frontmatter metadata at all.`;
    const result = getReadingTime(content);
    // Should not count frontmatter words
    expect(result.wordCount).toBeLessThan(30);
    expect(result.wordCount).toBeGreaterThan(15);
  });

  // TDD Cycle 9: Strips code blocks from content
  test('strips code blocks from content', () => {
    const content = `
Here is some text before the code block.

\`\`\`javascript
function example() {
  const x = 5;
  const y = 10;
  return x + y;
}
\`\`\`

Here is some text after the code block.
`;
    const result = getReadingTime(content);
    // Should not count code block words
    expect(result.wordCount).toBeLessThan(20);
  });

  // TDD Cycle 10: Strips markdown links from content
  test('strips markdown links from content but keeps link text', () => {
    const content = 'Check out [this article](https://example.com) for more information about the topic.';
    const result = getReadingTime(content);
    // "Check out this article for more information about the topic" = 10 words
    expect(result.wordCount).toBe(10);
  });

  // TDD Cycle 11: Strips images from content
  test('strips images from content', () => {
    const content = `
Here is an image: ![Alt text](https://example.com/image.png)

And here is more text after the image.
`;
    const result = getReadingTime(content);
    // Should not count image markdown
    expect(result.wordCount).toBe(12); // "Here is an image And here is more text after the image"
  });

  // TDD Cycle 12: Strips blockquotes from content
  test('strips blockquote markers but keeps text', () => {
    const content = `
Normal text here.

> This is a quoted section with important information.
> It spans multiple lines.

More normal text.
`;
    const result = getReadingTime(content);
    // Should count the quote text but not the > markers
    expect(result.wordCount).toBeGreaterThan(10);
  });

  // TDD Cycle 13: Strips MDX imports from content
  test('strips MDX imports from content', () => {
    const content = `
import Component from './Component';
import { helper } from '../utils';

This is the actual article content that should be counted for reading time.
`;
    const result = getReadingTime(content);
    // Should not count import statements
    expect(result.wordCount).toBe(13);
  });

  // TDD Cycle 14: Returns ISO 8601 duration PT1M
  test('returns ISO 8601 duration PT1M', () => {
    const result = getReadingTime('Short text');
    expect(result.duration).toBe('PT1M');
  });

  // TDD Cycle 15: Returns ISO 8601 duration PT10M
  test('returns ISO 8601 duration PT10M', () => {
    const words = Array(2000).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.minutes).toBe(10);
    expect(result.duration).toBe('PT10M');
  });

  // TDD Cycle 16: Handles very long content (10k words)
  test('handles very long content (10k words)', () => {
    const words = Array(10000).fill('word').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(10000);
    expect(result.minutes).toBe(50); // 10000 / 200 = 50
    expect(result.duration).toBe('PT50M');
  });

  // TDD Cycle 17: Returns wordCount field
  test('returns wordCount field', () => {
    const result = getReadingTime('Testing word count feature');
    expect(result).toHaveProperty('wordCount');
    expect(result.wordCount).toBe(4);
  });

  // Additional coverage: Strips inline code
  test('strips inline code from content', () => {
    const content = 'Use the `console.log()` function to debug your code effectively.';
    const result = getReadingTime(content);
    // Should count "Use the function to debug your code effectively" = 8 words
    expect(result.wordCount).toBe(8);
  });

  // Additional coverage: Strips HTML tags
  test('strips HTML tags from content', () => {
    const content = 'This is <strong>bold text</strong> and <em>italic text</em> in HTML.';
    const result = getReadingTime(content);
    // Should count "This is bold text and italic text in HTML" = 9 words
    expect(result.wordCount).toBe(9);
  });

  // Additional coverage: Strips heading markers
  test('strips heading markers from content', () => {
    const content = `
# Main Title

## Subtitle

### Subheading

Regular paragraph text here.
`;
    const result = getReadingTime(content);
    // Should count "Main Title Subtitle Subheading Regular paragraph text here" = 8 words
    expect(result.wordCount).toBe(8);
  });

  // Additional coverage: Strips bold/italic markers
  test('strips bold and italic markers from content', () => {
    const content = 'This is **bold** and *italic* and ***bold italic*** text.';
    const result = getReadingTime(content);
    // Should count "This is bold and italic and bold italic text" = 9 words
    expect(result.wordCount).toBe(9);
  });

  // Additional coverage: Strips horizontal rules
  test('strips horizontal rules from content', () => {
    const content = `
Section one text.

---

Section two text.

***

Section three text.
`;
    const result = getReadingTime(content);
    // Should count "Section one text Section two text Section three text"
    expect(result.wordCount).toBe(10);
  });

  // Additional coverage: Strips MDX components
  test('strips MDX self-closing components', () => {
    const content = `
Some text before component.

<CustomComponent prop="value" />

Some text after component.
`;
    const result = getReadingTime(content);
    // Should not count the component
    expect(result.wordCount).toBe(8); // "Some text before component Some text after component"
  });

  // Additional coverage: Complex real-world content
  test('handles complex real-world markdown content', () => {
    const content = `---
title: Complete Guide
author: John Doe
---

# Introduction

This is a **comprehensive guide** to [TypeScript](https://typescriptlang.org).

## Getting Started

First, install TypeScript:

\`\`\`bash
npm install -g typescript
\`\`\`

> Note: Make sure you have Node.js installed first.

### Key Features

- Static typing
- Better IDE support
- Compile-time errors

![TypeScript Logo](https://example.com/logo.png)

## Conclusion

TypeScript improves JavaScript development significantly.
`;
    const result = getReadingTime(content);

    // Should strip frontmatter, code blocks, images, and markdown syntax
    // Approximate word count: ~25-35 words (excluding all stripped content)
    expect(result.wordCount).toBeGreaterThan(20);
    expect(result.wordCount).toBeLessThan(40);
    expect(result.minutes).toBeGreaterThanOrEqual(1);
  });

  // Additional coverage: Multiple spaces between words
  test('handles multiple spaces between words', () => {
    const content = 'Word1    Word2     Word3      Word4';
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(4);
  });

  // Additional coverage: Newlines as word separators
  test('treats newlines as word separators', () => {
    const content = 'Word1\nWord2\n\nWord3\n\n\nWord4';
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(4);
  });

  // Additional coverage: Mixed whitespace
  test('handles mixed whitespace correctly', () => {
    const content = 'Word1\t\tWord2  \n  Word3\n\n\tWord4';
    const result = getReadingTime(content);
    expect(result.wordCount).toBe(4);
  });
});
