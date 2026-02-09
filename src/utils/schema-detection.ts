interface FAQ {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
}

/**
 * Detect FAQ-style content: headings starting with What/Why/How/When/Where/Which/Can/Do/Is/Are
 * followed by answer paragraphs.
 */
export function detectFAQs(content: string): FAQ[] | null {
  const faqPattern = /^#{2,3}\s+((?:What|Why|How|When|Where|Which|Can|Do|Is|Are|Should)\s[^\n]+\??)\s*\n+([\s\S]*?)(?=\n#{2,3}\s|\n*$)/gim;

  const faqs: FAQ[] = [];
  let match: RegExpExecArray | null;

  while ((match = faqPattern.exec(content)) !== null) {
    const question = match[1].trim().replace(/\?*$/, '?');
    const answer = match[2]
      .replace(/```[\s\S]*?```/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
      .replace(/^[-*]\s+/gm, '')
      .trim();

    if (answer.length > 20) {
      faqs.push({ question, answer: answer.slice(0, 300) });
    }
  }

  return faqs.length >= 2 ? faqs : null;
}

/**
 * Detect HowTo-style content: "Step N" patterns or sequential numbered instructions.
 */
export function detectHowTo(content: string): HowToStep[] | null {
  // Pattern 1: "## Step N: Title" or "### Step N - Title"
  const stepPattern = /^#{2,3}\s+Step\s+\d+[:\-–]\s*([^\n]+)\s*\n+([\s\S]*?)(?=\n#{2,3}\s|\n*$)/gim;
  const steps: HowToStep[] = [];
  let match: RegExpExecArray | null;

  while ((match = stepPattern.exec(content)) !== null) {
    const name = match[1].trim();
    const text = match[2]
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
      .trim()
      .split('\n')[0];

    if (name && text) {
      steps.push({ name, text: text.slice(0, 200) });
    }
  }

  return steps.length >= 3 ? steps : null;
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(steps: HowToStep[], title: string) {
  return {
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
