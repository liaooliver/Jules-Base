module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Ensure ESLint uses the project's tsconfig
    extraFileExtensions: ['.vue']
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'], // Warn for now, can be error later
    'vue/multi-word-component-names': 'off', // Allow single-word component names like App.vue, HelloWorld.vue
  },
  ignorePatterns: ['dist', 'node_modules', '*.d.ts', 'vite.config.ts'], // Ignore vite.config.ts for now
};
