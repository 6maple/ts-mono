const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
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
  },
  overrides: [
    {
      files: ['./*.{ts,js}', 'vscode.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
});
