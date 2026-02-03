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
        heroText: fields.text({
          label: 'Hero Text',
          multiline: true,
        }),
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
