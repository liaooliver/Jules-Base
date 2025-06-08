import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import UnauthorizedView from '../views/UnauthorizedView.vue'; // Import UnauthorizedView
import { useAuthStore } from '../stores/authStore'; // Import the auth store

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
    meta: { requiresAuth: true, roles: ['user', 'admin', 'super_admin'] }, // Updated meta
  },
  {
    path: '/unauthorized', // Added unauthorized route
    name: 'Unauthorized',
    component: UnauthorizedView,
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
  const authStore = useAuthStore();
  const isAuthenticated = authStore.getIsAuthenticated;
  const currentUserRole = authStore.getRole;

  const requiresAuth = to.meta.requiresAuth as boolean | undefined;
  const requiredRoles = to.meta.roles as string[] | undefined;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      // User is authenticated, check roles if required
      if (requiredRoles && requiredRoles.length > 0) {
        if (!currentUserRole) {
          // Should not happen if authenticated, but as a safeguard
          next({ name: 'Unauthorized' });
          return;
        }

        // Role hierarchy logic
        if (requiredRoles.includes(currentUserRole)) {
          next(); // User's role is directly permitted
        } else if (currentUserRole === 'super_admin' && (requiredRoles.includes('admin') || requiredRoles.includes('user'))) {
          next(); // Super_admin can access admin and user roles
        } else if (currentUserRole === 'admin' && requiredRoles.includes('user')) {
          next(); // Admin can access user roles
        } else {
          next({ name: 'Unauthorized' }); // Role not sufficient
        }
      } else {
        next(); // Route requires auth but no specific roles, so allow
      }
    }
  } else {
    // Route does not require auth
    // If user is logged in and tries to access login page, redirect to dashboard
    if (to.name === 'Login' && isAuthenticated) {
      next({ name: 'Dashboard'});
    } else {
      next();
    }
  }
});

export default router;
