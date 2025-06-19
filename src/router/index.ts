import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { ref } from 'vue'; // Import ref for simulated auth state
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import I18nView from '@/views/I18nView.vue'; // Import the new view

// Simulated authentication status
// In a real app, this would come from a store (e.g., Pinia) or auth service.
export const isAuthenticated = ref(false); // Export for potential use in LoginView to simulate login

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }, // Add meta field to identify protected routes
  },
  {
    path: '/i18n', // New route for i18n demonstration
    name: 'I18nDemo',
    component: I18nView,
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global Before Guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in
    // If not, redirect to login page.
    if (!isAuthenticated.value) {
      next({ name: 'Login' }); // Redirect to login page
    } else {
      next(); // Proceed to route
    }
  } else {
    next(); // Does not require auth, make sure to always call next()!
  }
});

export default router;
