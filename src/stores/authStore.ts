import { defineStore } from 'pinia';

// Define the type for user roles
export type UserRole = 'user' | 'admin' | 'super_admin' | null;

// Define the interface for the store's state
export interface AuthStoreState {
  isAuthenticated: boolean;
  userRole: UserRole;
  jwtToken: string | null;
  userData: object | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole') as UserRole;
    let data: object | null = null;
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Failed to parse userData from localStorage:", error);
      // Optionally remove the invalid item
      // localStorage.removeItem('userData');
    }

    return {
      jwtToken: token,
      userRole: role,
      userData: data,
      isAuthenticated: !!token,
    };
  },
  getters: {
    getRole(state): UserRole {
      return state.userRole;
    },
    getToken(state): string | null {
      return state.jwtToken;
    },
    getUserData(state): object | null {
      return state.userData;
    },
    getIsAuthenticated(state): boolean {
      return state.isAuthenticated;
    },
  },
  actions: {
    login(token: string, role: 'user' | 'admin' | 'super_admin', userData: object) {
      this.jwtToken = token;
      this.userRole = role;
      this.userData = userData;
      this.isAuthenticated = true;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userData', JSON.stringify(userData));
    },
    logout() {
      this.jwtToken = null;
      this.userRole = null;
      this.userData = null;
      this.isAuthenticated = false;

      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
    },
  },
});
