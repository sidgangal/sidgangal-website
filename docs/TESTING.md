# Testing Documentation

This document describes the testing infrastructure and practices for this project.

## Overview

The project uses [Vitest](https://vitest.dev/) as the testing framework. Tests are organized to cover:

- **Unit Tests**: Schema detection, reading time calculation, SEO helpers
- **Integration Tests**: Complex SEO schema generation and metadata handling
- **Coverage Goals**: >80% coverage for utility functions

## Running Tests

### Run All Tests

```bash
npm test
```

This runs all tests in watch mode. Press `q` to quit, or see other options in the terminal.

### Run Tests Once (CI Mode)

```bash
npm test -- --run
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

This generates a coverage report in the terminal and creates an HTML report in `coverage/index.html`.

### Run Tests with UI

```bash
npm run test:ui
```

This opens a browser-based UI for exploring and running tests interactively.

### Run Specific Test File

```bash
npm test -- src/utils/schema-detection.test.ts
```

### Run Tests Matching a Pattern

```bash
npm test -- -t "FAQ"
```

This runs only tests whose names match "FAQ".

## Test File Organization

Tests are co-located with the source files they test:

```
src/
  utils/
    schema-detection.ts
    schema-detection.test.ts    # Tests for schema-detection.ts
    reading-time.ts
    reading-time.test.ts         # Tests for reading-time.ts
    seo-helpers.ts
    seo-helpers.test.ts          # Tests for seo-helpers.ts
```

This organization makes it easy to find and maintain tests alongside the code they verify.

## Test Coverage Areas

### 1. Schema Detection (`src/utils/schema-detection.test.ts`)

Tests the detection and generation of structured data:

- **FAQ Detection**: Validates question patterns, answer extraction, markdown stripping, truncation
- **HowTo Detection**: Validates step patterns, sequential numbering, text extraction
- **Schema Generation**: Ensures valid Schema.org JSON-LD output

**Key Test Cases** (33 total):
- Edge cases: Empty content, single FAQ, boundary conditions (2 vs 3 items)
- Content processing: Markdown stripping, code block removal, truncation
- Schema compliance: Valid `@type`, required properties, proper structure

### 2. Reading Time Calculation (`src/utils/reading-time.test.ts`)

Tests the reading time estimation functionality:

- **Word Counting**: Accurate word counts with various content types
- **Markdown Stripping**: Removes frontmatter, code blocks, images, links
- **Duration Formatting**: ISO 8601 format (`PT5M`)
- **Boundary Testing**: 1 minute minimum, correct rounding at 200 words per minute

**Key Test Cases** (27 total):
- Boundary conditions: 199, 200, 201 words (minute thresholds)
- Content stripping: Frontmatter, code blocks, inline code, images, links, blockquotes
- Edge cases: Empty strings, whitespace, very long content (10k words)

### 3. SEO Helpers (`src/utils/seo-helpers.test.ts`)

Tests extracted SEO logic from BaseLayout:

- **OG Image Resolution**: Custom image, pillar/slug fallback, default fallback
- **Breadcrumb Generation**: Path parsing, capitalization, hyphen handling
- **Article Schema**: Required and optional fields, conditional inclusion
- **Schema Graph**: Merging multiple schemas, filtering nulls

**Key Test Cases** (47 total):
- OG image priority: Custom > pillar/slug > default
- Breadcrumb edge cases: Root path, multi-level paths, URL formatting
- Article schema: All optional fields, conditional properties
- Schema graph: Person, Website, Breadcrumb, Article, additional schemas

## Adding New Tests

### 1. Create Test File

Create a `.test.ts` file next to the source file:

```bash
touch src/utils/my-module.test.ts
```

### 2. Write Tests Using Vitest API

```typescript
import { describe, test, expect } from 'vitest';
import { myFunction } from './my-module';

describe('myFunction', () => {
  test('returns expected result for valid input', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  test('handles edge cases', () => {
    expect(myFunction('')).toBe('default');
    expect(myFunction(null)).toBeNull();
  });
});
```

### 3. Follow TDD Principles

When adding new features or fixing bugs:

1. **Write test first** - Define the expected behavior
2. **Run test to see it fail** - Verify the test catches the issue
3. **Implement minimal code** - Make the test pass
4. **Refactor** - Improve code quality while tests remain green

### 4. Test Naming Conventions

- Use descriptive test names that explain the behavior
- Start with the action: "returns", "handles", "validates", "generates"
- Include the condition: "when empty", "for invalid input", "with optional fields"

**Good Examples:**
- ✅ `returns null for empty content`
- ✅ `includes dateModified when updatedAt provided`
- ✅ `strips markdown bold from answer`

**Bad Examples:**
- ❌ `test 1`
- ❌ `it works`
- ❌ `edge case`

## Coverage Goals

The project aims for:

- **>80% coverage** for all utility functions (`src/utils/`)
- **100% coverage** for critical SEO functions (schema generation)
- **Edge case coverage** for all public APIs

View current coverage:

```bash
npm run test:coverage
```

Coverage reports include:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## CI/CD Integration

Tests run automatically in GitHub Actions on every push to `main`:

```yaml
- name: Run tests
  run: npm test -- --run
```

**Build Pipeline:**
1. Install dependencies
2. **Run tests** (blocks on failure)
3. Build application
4. Deploy to Cloudflare Pages

If tests fail, the build and deployment are **blocked** to prevent broken code from reaching production.

## Debugging Failed Tests

### Read the Error Message

Vitest provides clear error messages with:
- Expected vs actual values
- Line numbers where assertions failed
- Stack traces for debugging

### Run Single Test

Isolate the failing test:

```bash
npm test -- -t "specific test name"
```

### Use `test.only` for Focus

Temporarily focus on one test:

```typescript
test.only('this test runs alone', () => {
  // ...
});
```

Remember to remove `.only` before committing!

### Check Test Data

Verify your test input matches the expected format:

```typescript
test('example', () => {
  const input = '...';
  console.log('Input:', input); // Debug output
  const result = myFunction(input);
  expect(result).toBe('expected');
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

Focus on what the code does, not how it does it:

```typescript
// Good: Tests the result
test('capitalizes first letter', () => {
  expect(capitalize('hello')).toBe('Hello');
});

// Bad: Tests implementation details
test('uses toUpperCase and slice', () => {
  const spy = vi.spyOn(String.prototype, 'toUpperCase');
  capitalize('hello');
  expect(spy).toHaveBeenCalled();
});
```

### 2. Keep Tests Independent

Each test should run in isolation:

```typescript
// Good: Self-contained
test('generates schema', () => {
  const input = { title: 'Test' };
  const result = generateSchema(input);
  expect(result['@type']).toBe('Article');
});

// Bad: Depends on previous test
let sharedState;
test('sets up state', () => {
  sharedState = { title: 'Test' };
});
test('uses shared state', () => {
  expect(generateSchema(sharedState)).toBeDefined();
});
```

### 3. Test Edge Cases

Always test boundary conditions:

- Empty inputs (`''`, `[]`, `null`, `undefined`)
- Minimum/maximum values (1 vs 2 FAQs, 199 vs 200 words)
- Special characters and formatting
- Malformed or unexpected input

### 4. Use Descriptive Assertions

Make failures easy to understand:

```typescript
// Good: Clear assertion
expect(result.wordCount).toBe(42);

// Better: With descriptive message
expect(result.wordCount).toBe(42); // "The Answer to Life..."

// Even better: Multiple specific assertions
expect(result).toHaveProperty('wordCount');
expect(result.wordCount).toBe(42);
expect(result.wordCount).toBeGreaterThan(0);
```

### 5. Avoid Test Duplication

Use `describe` blocks and helper functions:

```typescript
describe('resolveOgImage', () => {
  const siteURL = 'https://example.com/';

  test('custom image has priority', () => {
    expect(resolveOgImage(siteURL, 'custom.png')).toBe('custom.png');
  });

  test('falls back to default', () => {
    expect(resolveOgImage(siteURL)).toBe('https://example.com/og-default.png');
  });
});
```

## Common Issues

### Tests Pass Locally But Fail in CI

**Cause**: Different Node.js versions or environment variables

**Solution**: Check `package.json` engines and ensure CI uses the same Node version

### Flaky Tests (Pass/Fail Intermittently)

**Cause**: Tests depend on timing, random data, or external state

**Solution**: Use deterministic inputs and mock time-dependent functions

### Coverage Not Generated

**Cause**: Missing `@vitest/coverage-v8` package

**Solution**: Install coverage dependency:

```bash
npm install -D @vitest/coverage-v8
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## Test Statistics

**Current Coverage** (as of last update):
- Test Files: 3
- Total Tests: 107
- Coverage: >95% for utility functions

**Test Breakdown:**
- Schema Detection: 33 tests
- Reading Time: 27 tests
- SEO Helpers: 47 tests
