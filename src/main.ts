import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import router from './router';
import apiClient from './utils/http';

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

createApp(App).use(pinia).use(VueQueryPlugin, vueQueryPluginOptions).use(router).mount('#app');
