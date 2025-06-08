import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
  type NavigationGuard
} from 'vue-router';

// Mock the auth store
import { useAuthStore } from '@/stores/authStore';
vi.mock('@/stores/authStore'); // Automatically mocks all exports

// Typed mock for easier usage
const mockUseAuthStore = useAuthStore as vi.MockedFunction<typeof useAuthStore>;

// Define a type for our mock store instance for clarity
interface MockAuthStoreInstance {
  getIsAuthenticated: boolean;
  getRole: 'user' | 'admin' | 'super_admin' | null;
  // Add other methods/properties if your guard uses them
}
let mockAuthStoreInstance: MockAuthStoreInstance;


// Temporary components for routes
const tempDashboardComponent = { template: '<div>Dashboard</div>' };
const tempLoginComponent = { template: '<div>Login</div>' };
const tempUnauthorizedComponent = { template: '<div>Unauthorized</div>' };
const tempAdminComponent = { template: '<div>Admin Page</div>' };
const tempSuperAdminComponent = { template: '<div>Super Admin Page</div>' };
const tempHomeComponent = { template: '<div>Home Page (Public)</div>'}; // A public page

const testAllRoutes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: tempLoginComponent },
  { path: '/dashboard', name: 'Dashboard', component: tempDashboardComponent, meta: { requiresAuth: true, roles: ['user', 'admin', 'super_admin'] } },
  { path: '/unauthorized', name: 'Unauthorized', component: tempUnauthorizedComponent },
  { path: '/admin-area', name: 'AdminArea', component: tempAdminComponent, meta: { requiresAuth: true, roles: ['admin', 'super_admin'] } },
  { path: '/super-admin-only', name: 'SuperAdminOnly', component: tempSuperAdminComponent, meta: { requiresAuth: true, roles: ['super_admin'] } },
  { path: '/public-page', name: 'PublicPage', component: tempHomeComponent }, // A route that doesn't require auth
  { path: '/', name: 'HomeRedirect', redirect: '/public-page' } // Default redirect to a public page
];

describe('Vue Router Guards (Role-based)', () => {
  let router: Router;

  // This is the exact guard logic copied from src/router/index.ts
  const guardLogic: NavigationGuard = (to, from, next) => {
    // const authStore = useAuthStore(); // In real code
    // const isAuthenticated = authStore.getIsAuthenticated;
    // const currentUserRole = authStore.getRole;

    // Use our mocked instance values instead
    const isAuthenticated = mockAuthStoreInstance.getIsAuthenticated;
    const currentUserRole = mockAuthStoreInstance.getRole;

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
  };

  beforeEach(() => {
    // Initialize mock auth store instance for each test context (describe block)
    // Default to unauthenticated
    mockAuthStoreInstance = {
      getIsAuthenticated: false,
      getRole: null,
    };
    mockUseAuthStore.mockReturnValue(mockAuthStoreInstance as any);

    router = createRouter({
      history: createWebHistory(),
      routes: testAllRoutes
    });
    router.beforeEach(guardLogic);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    // Reset router to a known state if necessary, e.g., navigate to a neutral page
    // await router.push('/public-page');
    // await router.isReady();
  });

  describe('Unauthenticated Access', () => {
    beforeEach(() => {
      // Already set by top-level beforeEach, but explicit for clarity
      mockAuthStoreInstance.getIsAuthenticated = false;
      mockAuthStoreInstance.getRole = null;
    });

    it('accesses /login page', async () => {
      await router.push({ name: 'Login' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Login');
    });

    it('accesses /public-page', async () => {
      await router.push({ name: 'PublicPage' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('PublicPage');
    });

    it('redirects to /login for /dashboard', async () => {
      await router.push({ name: 'Dashboard' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Login');
    });

    it('redirects to /login for /admin-area', async () => {
      await router.push({ name: 'AdminArea' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Login');
    });

    it('redirects to /login for /super-admin-only', async () => {
      await router.push({ name: 'SuperAdminOnly' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Login');
    });
  });

  describe('Authenticated User (role: user)', () => {
    beforeEach(() => {
      mockAuthStoreInstance.getIsAuthenticated = true;
      mockAuthStoreInstance.getRole = 'user';
    });

    it('accesses /dashboard', async () => {
      await router.push({ name: 'Dashboard' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Dashboard');
    });

    it('is redirected from /login to /dashboard', async () => {
      await router.push({ name: 'Login' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Dashboard');
    });

    it('is redirected to /unauthorized for /admin-area', async () => {
      await router.push({ name: 'AdminArea' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Unauthorized');
    });

    it('is redirected to /unauthorized for /super-admin-only', async () => {
      await router.push({ name: 'SuperAdminOnly' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Unauthorized');
    });
  });

  describe('Authenticated Admin (role: admin)', () => {
    beforeEach(() => {
      mockAuthStoreInstance.getIsAuthenticated = true;
      mockAuthStoreInstance.getRole = 'admin';
    });

    it('accesses /dashboard', async () => {
      await router.push({ name: 'Dashboard' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Dashboard');
    });

    it('accesses /admin-area', async () => {
      await router.push({ name: 'AdminArea' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('AdminArea');
    });

    it('is redirected to /unauthorized for /super-admin-only', async () => {
      await router.push({ name: 'SuperAdminOnly' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Unauthorized');
    });
  });

  describe('Authenticated Super Admin (role: super_admin)', () => {
    beforeEach(() => {
      mockAuthStoreInstance.getIsAuthenticated = true;
      mockAuthStoreInstance.getRole = 'super_admin';
    });

    it('accesses /dashboard', async () => {
      await router.push({ name: 'Dashboard' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('Dashboard');
    });

    it('accesses /admin-area', async () => {
      await router.push({ name: 'AdminArea' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('AdminArea');
    });

    it('accesses /super-admin-only', async () => {
      await router.push({ name: 'SuperAdminOnly' });
      await router.isReady();
      expect(router.currentRoute.value.name).toBe('SuperAdminOnly');
    });
  });
});
