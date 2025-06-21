import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { ref } from 'vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import I18nView from '@/views/I18nView.vue';

// Simulated authentication status
export const isAuthenticated = ref(false);

// Define routes that will be prefixed with :lang
const prefixedRoutes: Array<RouteRecordRaw> = [
  {
    path: 'dashboard', // Path is relative to the :lang prefix
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: 'i18n', // Path is relative to the :lang prefix
    name: 'I18nDemo',
    component: I18nView,
    meta: { requiresAuth: false }, // Public page
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  // Group routes that require a language prefix
  {
    path: '/:lang(en|zh)',
    component: { template: '<router-view />' }, // Empty component for grouping
    children: [
      ...prefixedRoutes,
      // Redirect from /:lang to /:lang/dashboard
      { path: '', redirect: { name: 'Dashboard' } },
    ],
  },
  // Redirect root to default language dashboard
  {
    path: '/',
    redirect: '/zh/dashboard',
  },
  // Redirect old unprefixed paths to the default language version
  {
    path: '/dashboard',
    redirect: '/zh/dashboard',
  },
  {
    path: '/i18n',
    redirect: '/zh/i18n',
  },
  // Catch-all for unknown routes under a language prefix (e.g., /en/nonexistent)
  {
    path: '/:lang(en|zh)/:pathMatch(.*)*',
    name: 'LangNotFound',
    redirect: (to) => ({ path: `/${to.params.lang}/dashboard` }),
  },
  // Global catch-all for any other unknown routes
  {
    path: '/:pathMatch(.*)*',
    name: 'GlobalNotFound',
    redirect: '/zh/dashboard', // Or a global 404 page
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const targetLang = to.params.lang as string | undefined;

  if (targetLang && ['en', 'zh'].includes(targetLang)) {
    // Attempt to set i18n locale
    // @ts-ignore
    const i18nInstance = router.app?.config?.globalProperties?.$i18n;
    if (i18nInstance && typeof i18nInstance.global?.locale?.value === 'string') {
      i18nInstance.global.locale.value = targetLang;
    } else {
      console.warn(
        `vue-i18n instance not properly available on router.app or locale not a ref. Lang: '${targetLang}'. Locale not set from URL.`
      );
    }
  }

  // Authentication check
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      // Store the intended path to redirect after login, including lang
      // For simplicity, just redirecting to login.
      // If login itself were localized: next({ name: 'Login', params: { lang: targetLang || 'zh' } });
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
