import { createSSRApp } from 'vue'; // Import createSSRApp for SSG
import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { createI18n } from 'vue-i18n';
import App from './App.vue'; // Keep App as is
import router from './router'; // Router setup will be handled by vite-ssg
import apiClient from './utils/http'; // Assuming this is fine as is

// Import locale messages
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';

// Vue Query Client (can remain similar)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
    },
  },
});
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};

// Exported function for vite-ssg
export function createApp() {
  const app = createSSRApp(App); // Use createSSRApp
  const pinia = createPinia();

  // Create i18n instance
  const i18n = createI18n({
    legacy: false,
    locale: 'zh', // Default to 'zh' as per user feedback
    fallbackLocale: 'en',
    messages: {
      en: enMessages,
      zh: zhMessages,
    },
  });

  app.use(pinia);
  app.use(VueQueryPlugin, vueQueryPluginOptions);
  app.use(router); // Router will be used by vite-ssg
  app.use(i18n);

  // apiClient might not need to be directly related to app creation for SSG
  // console.log('Axios client initialized:', apiClient.defaults.baseURL); // This might log during build

  return { app, router, i18n }; // Return i18n as well if needed by vite-ssg callbacks
}
