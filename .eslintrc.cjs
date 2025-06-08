module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    'vue/setup-compiler-macros': true, // Enables things like defineProps, defineEmits
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Use vue3-recommended for stricter rules
    '@vue/eslint-config-typescript', // Corrected path for TypeScript specific rules for Vue
    'eslint-config-prettier', // Turns off ESLint rules that might conflict with Prettier
  ],
  parser: 'vue-eslint-parser', // The parser that allows ESLint to lint <template> and <script>
  parserOptions: {
    parser: '@typescript-eslint/parser', // Parser for <script> tags (TypeScript)
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint', // Not strictly necessary to list here if using @vue/eslint-config-typescript but doesn't hurt
    'prettier', // Runs Prettier as an ESLint rule
  ],
  rules: {
    'prettier/prettier': 'warn', // Show Prettier differences as warnings
    // Add any project-specific ESLint rules here
    // Example:
    // 'vue/no-unused-vars': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Specific rules for .vue files if needed
      },
    },
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true, // or mocha, etc.
      },
    },
  ],
};
