import { config, fields, collection } from '@keystatic/core';

const pillarOptions = [
  { label: 'Build', value: 'build' },
  { label: 'Invest', value: 'invest' },
  { label: 'Thrive', value: 'thrive' },
] as const;

function postCollection(pillar: string) {
  return collection({
    label: pillar.charAt(0).toUpperCase() + pillar.slice(1),
    slugField: 'title',
    path: `content/posts/${pillar}/*/`,
    format: { contentField: 'content' },
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Title' } }),
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
});
