import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { createI18n } from 'vue-i18n'; // Import createI18n
import './style.css';
import App from './App.vue';
import router from './router';
import apiClient from './utils/http';

// Import locale messages
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';

const pinia = createPinia();

console.log('Axios client initialized:', apiClient.defaults.baseURL);

// Initialize Vue Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2, // Retry failed requests 2 times
    },
  },
});

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Set default locale
  fallbackLocale: 'en', // Fallback locale
  messages: {
    en: enMessages,
    zh: zhMessages,
  },
});

createApp(App)
  .use(pinia)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .use(router)
  .use(i18n) // Use i18n instance
  .mount('#app');
