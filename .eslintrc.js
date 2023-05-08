module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  // parserOptions: { project: ['./tsconfig.json'] },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
  ],
  overrides: [
  ],
  rules: {
    eqeqeq: 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-multi-spaces': 'error',
    'comma-dangle': ['error','always-multiline'],
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
			'warn',
			{ 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' },
		],
  },
}

