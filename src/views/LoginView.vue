<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; // Import the auth store

const router = useRouter();
const authStore = useAuthStore(); // Instantiate the auth store

// For Google Login Simulation
const googleLoginMessage = ref<string>('');
let googleRoleCycle: Array<'user' | 'admin' | 'super_admin'> = ['user', 'admin', 'super_admin'];
let currentGoogleRoleIndex = 0;

// For Direct Login Form
const username = ref<string>('');
const password = ref<string>('');
const loginError = ref<string | null>(null);

// Simulated Google Firebase Auth Exchange
async function mockBackendGoogleLogin(): Promise<{ token: string; role: 'user' | 'admin' | 'super_admin'; userData: object }> {
  googleLoginMessage.value = 'Simulating Google login...';
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

  const roleToAssign = googleRoleCycle[currentGoogleRoleIndex];
  currentGoogleRoleIndex = (currentGoogleRoleIndex + 1) % googleRoleCycle.length; // Cycle through roles

  const dummyUserData = {
    id: `google${Date.now()}`,
    name: `Google User (${roleToAssign})`,
    email: `google.${roleToAssign}@example.com`,
  };
  const dummyToken = `dummy_google_jwt_${roleToAssign}_${Date.now()}`;
  googleLoginMessage.value = `Google login success! Role: ${roleToAssign}`;
  return { token: dummyToken, role: roleToAssign, userData: dummyUserData };
}

// Handler for the "Simulate Google Login" button
async function simulateGoogleLogin() {
  loginError.value = null; // Clear previous errors
  try {
    const { token, role, userData } = await mockBackendGoogleLogin();
    authStore.login(token, role, userData);
    router.push({ name: 'Dashboard' });
  } catch (error) {
    console.error('Google login simulation failed:', error);
    googleLoginMessage.value = 'Google login simulation failed.';
    loginError.value = 'Google login simulation failed. Please try again.';
  }
}

// Simulated Direct Backend Login
async function mockBackendDirectLogin(user: string, pass: string): Promise<{ token: string; role: 'user' | 'admin' | 'super_admin'; userData: object } | null> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  if (user === 'user' && pass === 'password') {
    return {
      token: 'dummy_user_jwt',
      role: 'user',
      userData: { id: 'user1', name: 'Test User', email: 'user@example.com', source: 'direct' },
    };
  } else if (user === 'admin' && pass === 'password') {
    return {
      token: 'dummy_admin_jwt',
      role: 'admin',
      userData: { id: 'admin1', name: 'Test Admin', email: 'admin@example.com', source: 'direct' },
    };
  } else if (user === 'superadmin' && pass === 'password') {
    return {
      token: 'dummy_superadmin_jwt',
      role: 'super_admin',
      userData: { id: 'superadmin1', name: 'Test Super Admin', email: 'superadmin@example.com', source: 'direct' },
    };
  }
  return null; // Login failed
}

// Handler for the direct login form submission
async function handleDirectLogin() {
  loginError.value = null;
  googleLoginMessage.value = ''; // Clear Google login message
  try {
    const result = await mockBackendDirectLogin(username.value, password.value);
    if (result) {
      authStore.login(result.token, result.role, result.userData);
      router.push({ name: 'Dashboard' });
    } else {
      loginError.value = 'Invalid username or password.';
    }
  } catch (error) {
    console.error('Direct login failed:', error);
    loginError.value = 'An error occurred during login. Please try again.';
  }
}
</script>

<template>
  <div class="login-view-container p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

      <!-- Direct Login Form -->
      <form @submit.prevent="handleDirectLogin" class="mb-6">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
        <p v-if="loginError" class="text-red-500 text-sm mt-2 text-center">{{ loginError }}</p>
      </form>

      <div class="text-center border-t pt-6">
         <p class="text-sm text-gray-700 mb-2">Or, simulate a Google login:</p>
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="simulateGoogleLogin"
        >
          Simulate Google Login & Go to Dashboard
        </button>
        <p v-if="googleLoginMessage" class="text-sm text-gray-600 mt-2">
          {{ googleLoginMessage }}
        </p>
         <p class="text-xs text-gray-500 mt-2">
          (Cycles roles: user, admin, super_admin)
        </p>
      </div>
    </div>
     <div class="mt-4 text-xs text-gray-600 max-w-md text-center">
        <p><strong>Test credentials for direct login:</strong></p>
        <p>user / password (Role: user)</p>
        <p>admin / password (Role: admin)</p>
        <p>superadmin / password (Role: super_admin)</p>
      </div>
  </div>
</template>

<style scoped>
/* Styles for LoginView can remain minimal as TailwindCSS is used */
.login-view-container {
  /* Add any specific overall container styles if needed */
}
</style>
