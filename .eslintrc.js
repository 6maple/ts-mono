const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: ['plugin:@zyi/recommended'],
  overrides: [
    {
      files: ['./*.{ts,js}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
});
