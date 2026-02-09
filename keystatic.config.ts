import { config, fields, collection, singleton } from '@keystatic/core';

const pillarOptions = [
  { label: 'Build', value: 'build' },
  { label: 'Invest', value: 'invest' },
  { label: 'Thrive', value: 'thrive' },
] as const;

function postCollection(pillar: string) {
  return collection({
    label: pillar.charAt(0).toUpperCase() + pillar.slice(1),
    slugField: 'title',
    path: `content/posts/${pillar}/*`,
    format: { contentField: 'content' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      slug: fields.text({ label: 'Slug' }),
      description: fields.text({
        label: 'Description',
        multiline: true,
      }),
      pillar: fields.select({
        label: 'Pillar',
        options: pillarOptions,
        defaultValue: pillar as 'build' | 'invest' | 'thrive',
      }),
      format: fields.text({ label: 'Format' }),
      topics: fields.array(fields.text({ label: 'Topic' }), {
        label: 'Topics',
        itemLabel: (props) => props.value,
      }),
      publishedAt: fields.date({ label: 'Published date' }),
      keywords: fields.array(fields.text({ label: 'Keyword' }), {
        label: 'SEO Keywords',
        itemLabel: (props) => props.value,
        description: 'Optional keywords for search engines',
      }),
      updatedAt: fields.date({
        label: 'Last Updated',
        description: 'Optional — set when content is significantly updated',
      }),
      coverImage: fields.text({
        label: 'Cover Image Path',
        description: 'Optional custom OG image path (e.g. /images/my-post.png)',
      }),
      content: fields.mdx({ label: 'Content' }),
    },
  });
}

export default config({
  storage: { kind: 'local' },
  collections: {
    build: postCollection('build'),
    invest: postCollection('invest'),
    thrive: postCollection('thrive'),
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'content/pages/homepage',
      format: { data: 'yaml' },
      schema: {
        heroHeadline: fields.text({
          label: 'Hero Headline',
          description: 'Short punchy headline (under 10 words)',
        }),
        heroText: fields.text({
          label: 'Hero Text',
          multiline: true,
        }),
        heroPrinciples: fields.array(
          fields.text({ label: 'Principle' }),
          {
            label: 'Hero Principles',
            itemLabel: (props) => props.value,
          }
        ),
        buildDescription: fields.text({ label: 'Build Pillar Description' }),
        investDescription: fields.text({ label: 'Invest Pillar Description' }),
        thriveDescription: fields.text({ label: 'Thrive Pillar Description' }),
      },
    }),
    about: singleton({
      label: 'About Page',
      path: 'content/pages/about',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Meta Description', multiline: true }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
