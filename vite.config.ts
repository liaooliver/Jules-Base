/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: false, // Explicitly disable if not used or to speed up build
    // additional options can be added here if vite-ssg needs them later
  },
});
