export const pillars = ['build', 'invest', 'thrive'] as const;

export type Pillar = (typeof pillars)[number];

export const pillarOptions = [
  { label: 'Build', value: 'build' },
  { label: 'Invest', value: 'invest' },
  { label: 'Thrive', value: 'thrive' },
] as const;
