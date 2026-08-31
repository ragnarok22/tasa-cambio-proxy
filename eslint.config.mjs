import nextPlugin from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'coverage/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...nextPlugin,
];

export default eslintConfig;
