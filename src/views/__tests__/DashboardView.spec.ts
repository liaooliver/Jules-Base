import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DashboardView from '../../views/DashboardView.vue';
import type { UserRole } from '@/stores/authStore'; // Assuming UserRole is exported or define it locally

// Mock Pinia store
import { useAuthStore } from '@/stores/authStore';
vi.mock('@/stores/authStore');
const mockUseAuthStore = useAuthStore as vi.MockedFunction<typeof useAuthStore>;

// Mock vue-router
const mockRouterPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('DashboardView.vue', () => {
  let wrapper: VueWrapper<any>;
  let mockAuthStoreState: {
    getRole: UserRole; // 'user' | 'admin' | 'super_admin' | null;
    getUserData: { name?: string; email?: string; id?: string } | null;
    logout: ReturnType<typeof vi.fn>; // Ensure logout is a vi.fn()
    // Add other getters/state if DashboardView uses them directly or via computed props
    getToken: string | null; // Example, if used directly, though computed makes this less likely
    getIsAuthenticated: boolean; // Example
  };

  const mountComponent = (role: UserRole, userData?: object | null) => {
    mockAuthStoreState.getRole = role;
    if (userData !== undefined) {
      mockAuthStoreState.getUserData = userData as any;
    } else {
      mockAuthStoreState.getUserData = role ? { name: `Test ${role}`, id: String(role) } : null;
    }
    // Re-assert the mock for each mount, as component setup runs then
    mockUseAuthStore.mockReturnValue(mockAuthStoreState as any);

    wrapper = shallowMount(DashboardView, {
      global: {
        plugins: [createPinia()], // Pinia plugin for the component instance
      },
    });
  };

  beforeEach(() => {
    setActivePinia(createPinia()); // Global Pinia for testing environment

    // Initialize mockAuthStoreState with default values and a new vi.fn() for logout
    mockAuthStoreState = {
      getRole: 'user', // Default role
      getUserData: { name: 'Test User', id: 'user1', email: 'user@example.com' },
      logout: vi.fn(), // Ensure logout is a Vitest mock function
      // Provide defaults for any other getters the component might derive from
      getToken: 'dummy-token',
      getIsAuthenticated: true,
    };
    // Initial mock setup before any mountComponent call
    mockUseAuthStore.mockReturnValue(mockAuthStoreState as any);
    mockRouterPush.mockClear();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks(); // Or vi.clearAllMocks() if restore causes issues with global mocks
  });

  describe('Role-based Rendering', () => {
    it('should render general user content and not admin/super_admin content for "user" role', () => {
      mountComponent('user');
      expect(wrapper.find('[data-testid="general-section"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, Test user!');
      expect(wrapper.find('[data-testid="admin-panel"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="super-admin-panel"]').exists()).toBe(false);
    });

    it('should render general and admin content but not super_admin content for "admin" role', () => {
      mountComponent('admin');
      expect(wrapper.find('[data-testid="general-section"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, Test admin!');
      expect(wrapper.find('[data-testid="admin-panel"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="super-admin-panel"]').exists()).toBe(false);
    });

    it('should render general, admin, and super_admin content for "super_admin" role', () => {
      mountComponent('super_admin');
      expect(wrapper.find('[data-testid="general-section"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, Test super_admin!');
      expect(wrapper.find('[data-testid="admin-panel"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="super-admin-panel"]').exists()).toBe(true);
    });
  });

  describe('User Information Display', () => {
    it('should display user name from store if available', () => {
      mountComponent('user', { name: 'Specific User Name', id: 'user2' });
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, Specific User Name!');
    });

    it('should display fallback "User" if user name is not in store data (empty object)', () => {
      mountComponent('user', { id: 'no-name-user3' }); // name property missing
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, User!');
    });

    it('should display fallback "User" if user name is undefined in store data', () => {
      mountComponent('user', { name: undefined, id: 'no-name-user4' });
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, User!');
    });

    it('should display fallback "User" if userData is null', () => {
      mountComponent('user', null);
      expect(wrapper.find('[data-testid="welcome-message"]').text()).toContain('Welcome, User!');
    });
  });

  describe('Logout Button Functionality', () => {
    it('should call authStore.logout and router.push on logout button click', async () => {
      mountComponent('user');
      const logoutButton = wrapper.find('[data-testid="logout-button"]');
      expect(logoutButton.exists()).toBe(true);

      await logoutButton.trigger('click');

      expect(mockAuthStoreState.logout).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Login' });
    });
  });
});
