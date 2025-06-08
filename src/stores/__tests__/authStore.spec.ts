import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore, type UserRole } from '../authStore'; // Assuming UserRole is exported

describe('Auth Pinia Store (authStore)', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  // Mocks for localStorage
  let mockLocalStorage: Record<string, string | null>;

  beforeEach(() => {
    // Create a fresh Pinia instance and set it as active
    setActivePinia(createPinia());
    // Create the store instance for each test
    authStore = useAuthStore();

    // Simplified localStorage mock for each test
    mockLocalStorage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => mockLocalStorage[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete mockLocalStorage[key];
    });
  });

  afterEach(() => {
    // Clear all mocks after each test
    vi.restoreAllMocks(); // Restores original implementations
  });

  describe('Initial State', () => {
    it('should have correct initial state when no token is in localStorage', () => {
      // Ensure localStorage is empty for this test (covered by beforeEach mock setup)
      // Re-initialize store to ensure it reads the (empty) localStorage
      authStore = useAuthStore();

      expect(authStore.jwtToken).toBeNull();
      expect(authStore.userRole).toBeNull();
      expect(authStore.userData).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);

      // Test getters
      expect(authStore.getToken).toBeNull();
      expect(authStore.getRole).toBeNull();
      expect(authStore.getUserData).toBeNull();
      expect(authStore.getIsAuthenticated).toBe(false);
    });

    it('should load state from localStorage if present', () => {
      const dummyToken = 'test-jwt-token';
      const dummyRole: UserRole = 'admin';
      const dummyUserData = { id: '123', name: 'Test User' };

      // Pre-populate mockLocalStorage before store initialization for this specific test
      mockLocalStorage['jwtToken'] = dummyToken;
      mockLocalStorage['userRole'] = dummyRole;
      mockLocalStorage['userData'] = JSON.stringify(dummyUserData);

      // Re-initialize store to ensure it loads from the mocked localStorage
      authStore = useAuthStore();

      expect(authStore.jwtToken).toBe(dummyToken);
      expect(authStore.userRole).toBe(dummyRole);
      expect(authStore.userData).toEqual(dummyUserData);
      expect(authStore.isAuthenticated).toBe(true);

      // Test getters
      expect(authStore.getToken).toBe(dummyToken);
      expect(authStore.getRole).toBe(dummyRole);
      expect(authStore.getUserData).toEqual(dummyUserData);
      expect(authStore.getIsAuthenticated).toBe(true);
    });

    it('should handle invalid JSON in userData from localStorage gracefully', () => {
      localStorage.setItem('userData', 'this is not json');
      // Re-initialize to pick up the new invalid item
      authStore = useAuthStore();

      expect(authStore.userData).toBeNull();
      // Optionally, check console.error was called if you add such logging
    });
  });

  describe('Login Action', () => {
    const sampleToken = 'sample-jwt-token';
    const sampleUserData = { id: 'user1', name: 'Sample User' };

    const rolesToTest: Array<'user' | 'admin' | 'super_admin'> = ['user', 'admin', 'super_admin'];

    rolesToTest.forEach(role => {
      it(`login action should correctly set state and localStorage for role: '${role}'`, () => {
        authStore.login(sampleToken, role, sampleUserData);

        expect(authStore.jwtToken).toBe(sampleToken);
        expect(authStore.userRole).toBe(role);
        expect(authStore.userData).toEqual(sampleUserData);
        expect(authStore.isAuthenticated).toBe(true);

        // Check localStorage calls
        expect(localStorage.setItem).toHaveBeenCalledWith('jwtToken', sampleToken);
        expect(localStorage.setItem).toHaveBeenCalledWith('userRole', role);
        expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(sampleUserData));
      });
    });
  });

  describe('Logout Action', () => {
    it('logout action should clear state and localStorage', () => {
      // First, login to set some state
      const initialToken = 'initial-token';
      const initialRole: UserRole = 'user';
      const initialUserData = { id: 'tempUser', name: 'Temporary User' };
      authStore.login(initialToken, initialRole, initialUserData);

      // Ensure state is set
      expect(authStore.isAuthenticated).toBe(true);

      // Now, logout
      authStore.logout();

      expect(authStore.jwtToken).toBeNull();
      expect(authStore.userRole).toBeNull();
      expect(authStore.userData).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);

      // Check localStorage calls for removal
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('Getters', () => {
    it('getters should return the correct current state values after login and logout', () => {
      const loginToken = 'getter-test-token';
      const loginRole: UserRole = 'super_admin';
      const loginUserData = { id: 'getterUser', name: 'Getter Test User' };

      // After login
      authStore.login(loginToken, loginRole, loginUserData);
      expect(authStore.getToken).toBe(loginToken);
      expect(authStore.getRole).toBe(loginRole);
      expect(authStore.getUserData).toEqual(loginUserData);
      expect(authStore.getIsAuthenticated).toBe(true);

      // After logout
      authStore.logout();
      expect(authStore.getToken).toBeNull();
      expect(authStore.getRole).toBeNull();
      expect(authStore.getUserData).toBeNull();
      expect(authStore.getIsAuthenticated).toBe(false);
    });
  });
});
