const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: ['plugin:@zyi/recommended'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['vscode', '@types/vscode']],
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
