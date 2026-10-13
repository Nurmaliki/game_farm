module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true, serviceworker: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'svelte'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [{ files: ['*.svelte'], parser: 'svelte-eslint-parser', parserOptions: { parser: '@typescript-eslint/parser' } }],
  rules: { 'no-inner-declarations': 'off', 'no-undef': 'off', '@typescript-eslint/no-this-alias': 'off' },
  ignorePatterns: ['.svelte-kit/', 'build/', 'graphify-out/', 'playwright-report/']
};
