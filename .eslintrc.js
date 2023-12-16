const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: ['plugin:@zyi/recommended'],
  // plugin:x/recommended -> eslint-plugin-x
  // @zyi/eslint-plugin 导出的 configs.recommended
  // x-y-z
  // @n/x-y-z
  settings: {
    'import/resolver': {
      alias: {
        extensions: [
          '.ts',
          '.tsx',
          '.d.ts',
          '.js',
          '.jsx',
          '.mjs',
          '.cjs',
          '.json',
          '.vue',
        ],
      },
    },
    'import/core-modules': [
      'vscode',
      'uno.css',
      'virtual:generated-layouts',
      'vue-router/auto/routes',
    ],
  },
  overrides: [
    {
      files: ['./*.{ts,js}', 'vscode.js', './packages/build/**/*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
});
