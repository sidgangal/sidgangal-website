import { describe, test, expect } from 'vitest';
import { detectFAQs, detectHowTo, generateFAQSchema, generateHowToSchema } from './schema-detection';

describe('detectFAQs', () => {
  // TDD Cycle 1: Empty content check
  test('returns null for empty content', () => {
    expect(detectFAQs('')).toBeNull();
  });

  // TDD Cycle 2: Detects FAQ with What question
  test('detects FAQ with What question', () => {
    const content = `
## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript.
`;
    const result = detectFAQs(content);
    expect(result).toBeNull(); // Needs at least 2 FAQs
  });

  // TDD Cycle 3: Detects FAQ with Why question
  test('detects FAQ with Why question', () => {
    const content = `
## What is TypeScript?

TypeScript is a strongly typed programming language.

## Why use TypeScript?

TypeScript adds optional types to JavaScript for better tooling.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0].question).toBe('What is TypeScript?');
    expect(result![1].question).toBe('Why use TypeScript?');
  });

  // TDD Cycle 4: Detects FAQ with How question
  test('detects FAQ with How question', () => {
    const content = `
## How does it work?

It compiles TypeScript to JavaScript.

## What are the benefits?

Better IDE support and fewer runtime errors.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
  });

  // TDD Cycle 5: Case insensitive question detection
  test('case insensitive question detection', () => {
    const content = `
## what is javascript?

JavaScript is a programming language.

## WHY use it?

It runs in browsers and servers.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
  });

  // TDD Cycle 6: Returns null with only 1 FAQ
  test('returns null with only 1 FAQ', () => {
    const content = `
## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 engine.
`;
    const result = detectFAQs(content);
    expect(result).toBeNull();
  });

  // TDD Cycle 7: Returns FAQs with exactly 2 questions (boundary)
  test('returns FAQs with exactly 2 questions (boundary)', () => {
    const content = `
## What is React?

React is a JavaScript library for building user interfaces.

## Why choose React?

React offers component-based architecture and virtual DOM.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
  });

  // TDD Cycle 8: Rejects answer shorter than 20 chars
  test('rejects answer shorter than 20 chars', () => {
    const content = `
## What is X?

Short answer.

## What is Y?

This is a much longer answer that should be accepted.

## What is Z?

Another good answer that is long enough to pass validation.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2); // Only Y and Z should be included
    expect(result![0].question).toBe('What is Y?');
    expect(result![1].question).toBe('What is Z?');
  });

  // TDD Cycle 9: Strips markdown bold from answer
  test('strips markdown bold from answer', () => {
    const content = `
## What is Markdown?

Markdown is a **lightweight markup language** for formatting.

## Why use Markdown?

It is **simple** and **readable** in plain text.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result![0].answer).not.toContain('**');
    expect(result![0].answer).toContain('lightweight markup language');
  });

  // TDD Cycle 10: Strips markdown links from answer
  test('strips markdown links from answer', () => {
    const content = `
## What is GitHub?

GitHub is a platform for [version control](https://github.com) and collaboration.

## Why use GitHub?

It provides [Git](https://git-scm.com) hosting with additional features.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result![0].answer).not.toContain('[');
    expect(result![0].answer).not.toContain(']');
    expect(result![0].answer).toContain('version control');
  });

  // TDD Cycle 11: Strips code blocks from answer
  test('strips code blocks from answer', () => {
    const content = `
## What is a function?

A function is a reusable block of code that can be called multiple times.

\`\`\`javascript
function hello() {
  console.log('Hello');
}
\`\`\`

## How to define functions?

Use the function keyword or arrow syntax to create reusable code blocks.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result![0].answer).not.toContain('```');
    expect(result![0].answer).not.toContain('console.log');
    expect(result![0].answer).toContain('reusable block of code');
  });

  // TDD Cycle 12: Truncates answer at 300 characters
  test('truncates answer at 300 characters', () => {
    const longAnswer = 'A'.repeat(400);
    const content = `
## What is this?

${longAnswer}

## What is that?

Another answer that is sufficiently long to be included.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result![0].answer.length).toBeLessThanOrEqual(300);
  });

  // TDD Cycle 13: Handles malformed markdown gracefully
  test('handles malformed markdown gracefully', () => {
    const content = `
## What is **malformed?

This has unclosed **bold and [link

## Why test edge cases?

Edge cases help ensure robustness and handle unexpected input.
`;
    const result = detectFAQs(content);
    // Should still detect questions even with malformed markdown
    expect(result).not.toBeNull();
  });

  // Additional coverage: Tests all question types
  test('detects all supported question types', () => {
    const content = `
## When should you use it?

Use it when you need strong typing.

## Where is it used?

TypeScript is used in web and mobile applications.

## Which framework supports it?

Many frameworks like Angular and React support TypeScript.

## Can it run in browsers?

No, it must be compiled to JavaScript first.

## Do I need to learn it?

It helps but JavaScript knowledge is sufficient to start.

## Is it worth learning?

Yes, it improves code quality and developer experience.

## Are there alternatives?

Yes, Flow and PropTypes are alternatives for type checking.

## Should I migrate my project?

Consider the team size and project complexity before migrating.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result!.length).toBeGreaterThanOrEqual(2);
  });

  // Additional coverage: Adds question mark if missing
  test('adds question mark if missing', () => {
    const content = `
## What is testing

Testing is the process of verifying code works correctly.

## Why write tests

Tests catch bugs early and document expected behavior.
`;
    const result = detectFAQs(content);
    expect(result).not.toBeNull();
    expect(result![0].question).toMatch(/\?$/);
    expect(result![1].question).toMatch(/\?$/);
  });
});

describe('detectHowTo', () => {
  // TDD Cycle 1: Empty content check
  test('returns null for empty content', () => {
    expect(detectHowTo('')).toBeNull();
  });

  // TDD Cycle 2: Detects Step 1: pattern
  test('detects Step 1: pattern', () => {
    const content = `
## Step 1: Install dependencies

Run npm install to install all required packages.

## Step 2: Configure settings

Update your config file with the necessary settings.

## Step 3: Run the application

Execute npm start to launch the application.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    expect(result![0].name).toBe('Install dependencies');
    expect(result![1].name).toBe('Configure settings');
    expect(result![2].name).toBe('Run the application');
  });

  // TDD Cycle 3: Detects Step 1- pattern (dash without space before)
  test('detects Step with dash separator', () => {
    const content = `
## Step 1– Setup environment

Install Node.js and npm on your system.

## Step 2– Clone repository

Clone the project from GitHub to your local machine.

## Step 3– Install packages

Run npm install to get all dependencies.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });

  // TDD Cycle 4: Detects Step 1. pattern (not in original, but testing anyway)
  test('handles Step followed by number and various separators', () => {
    const content = `
### Step 1: First task

Do the first thing here.

### Step 2: Second task

Do the second thing here.

### Step 3: Third task

Do the third thing here.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });

  // TDD Cycle 5: Returns null with only 2 steps
  test('returns null with only 2 steps', () => {
    const content = `
## Step 1: First step

Do this first.

## Step 2: Second step

Then do this.
`;
    const result = detectHowTo(content);
    expect(result).toBeNull();
  });

  // TDD Cycle 6: Returns steps with exactly 3 steps (boundary)
  test('returns steps with exactly 3 steps (boundary)', () => {
    const content = `
## Step 1: One

First step description here.

## Step 2: Two

Second step description here.

## Step 3: Three

Third step description here.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });

  // TDD Cycle 7: Handles non-sequential numbering
  test('handles non-sequential numbering', () => {
    const content = `
## Step 1: First

First step content.

## Step 5: Fifth

Fifth step content (non-sequential).

## Step 10: Tenth

Tenth step content.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });

  // TDD Cycle 8: Extracts text from first paragraph
  test('extracts text from first paragraph', () => {
    const content = `
## Step 1: Setup

This is the first paragraph that should be extracted.

This is a second paragraph that should be ignored.

## Step 2: Configure

Another first paragraph here.

More text that won't be used.

## Step 3: Deploy

Final step first paragraph.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result![0].text).toBe('This is the first paragraph that should be extracted.');
    expect(result![0].text).not.toContain('second paragraph');
  });

  // TDD Cycle 9: Strips markdown from step text
  test('strips markdown from step text', () => {
    const content = `
## Step 1: Install

Run **npm install** to get all dependencies.

## Step 2: Build

Use \`npm run build\` to compile the project.

## Step 3: Deploy

Push to [production](https://example.com) server.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result![0].text).not.toContain('**');
    expect(result![0].text).toContain('npm install');
  });

  // TDD Cycle 10: Truncates text at 200 characters
  test('truncates text at 200 characters', () => {
    const longText = 'A'.repeat(300);
    const content = `
## Step 1: Long step

${longText}

## Step 2: Another step

This is a normal length step description.

## Step 3: Final step

Last step with normal text.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result![0].text.length).toBeLessThanOrEqual(200);
  });

  // Additional coverage: Strips code blocks
  test('strips code blocks from step text', () => {
    const content = `
## Step 1: Write code

Create a new file and add this:

\`\`\`javascript
const x = 5;
\`\`\`

Save the file.

## Step 2: Run code

Execute the script to see results.

## Step 3: Debug

Check for any errors in the output.
`;
    const result = detectHowTo(content);
    expect(result).not.toBeNull();
    expect(result![0].text).not.toContain('```');
    expect(result![0].text).not.toContain('const x');
  });
});

describe('generateFAQSchema', () => {
  // TDD Cycle: Produces valid FAQPage schema
  test('produces valid FAQPage schema', () => {
    const faqs = [
      { question: 'What is testing?', answer: 'Testing verifies code correctness.' },
      { question: 'Why test?', answer: 'Tests catch bugs early.' },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('What is testing?');
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Testing verifies code correctness.');
  });

  test('handles empty FAQ array', () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toHaveLength(0);
  });

  test('preserves question and answer content', () => {
    const faqs = [
      {
        question: 'How does Schema.org work?',
        answer: 'Schema.org provides structured data vocabulary for search engines.'
      },
      {
        question: 'Can I use multiple schemas?',
        answer: 'Yes, you can combine multiple schema types on one page.'
      },
    ];

    const schema = generateFAQSchema(faqs);

    expect(schema.mainEntity[0].name).toBe('How does Schema.org work?');
    expect(schema.mainEntity[1].acceptedAnswer.text).toContain('multiple schema types');
  });
});

describe('generateHowToSchema', () => {
  // TDD Cycle: Produces valid HowTo schema
  test('produces valid HowTo schema', () => {
    const steps = [
      { name: 'Setup', text: 'Install dependencies' },
      { name: 'Configure', text: 'Update settings' },
      { name: 'Deploy', text: 'Push to production' },
    ];

    const schema = generateHowToSchema(steps, 'How to Deploy an App');

    expect(schema['@type']).toBe('HowTo');
    expect(schema.name).toBe('How to Deploy an App');
    expect(schema.step).toHaveLength(3);
    expect(schema.step[0]['@type']).toBe('HowToStep');
    expect(schema.step[0].name).toBe('Setup');
    expect(schema.step[0].text).toBe('Install dependencies');
  });

  // TDD Cycle: Steps have correct position ordering
  test('steps have correct position ordering', () => {
    const steps = [
      { name: 'First', text: 'Do this first' },
      { name: 'Second', text: 'Do this second' },
      { name: 'Third', text: 'Do this third' },
    ];

    const schema = generateHowToSchema(steps, 'Test Tutorial');

    expect(schema.step[0].position).toBe(1);
    expect(schema.step[1].position).toBe(2);
    expect(schema.step[2].position).toBe(3);
  });

  test('handles single step', () => {
    const steps = [{ name: 'Only step', text: 'Do this' }];
    const schema = generateHowToSchema(steps, 'Simple Guide');

    expect(schema.step).toHaveLength(1);
    expect(schema.step[0].position).toBe(1);
  });

  test('preserves step names and text', () => {
    const steps = [
      { name: 'Install Node.js', text: 'Download from nodejs.org' },
      { name: 'Setup project', text: 'Run npm init' },
      { name: 'Install packages', text: 'Run npm install' },
    ];

    const schema = generateHowToSchema(steps, 'Node.js Setup');

    expect(schema.step[0].name).toBe('Install Node.js');
    expect(schema.step[1].text).toBe('Run npm init');
  });
});
