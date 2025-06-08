<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Computed properties for role checking and user data
const userRole = computed(() => authStore.getRole);
const userData = computed(() => authStore.getUserData); // Use the getter for userData

const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin');
const isSuperAdmin = computed(() => userRole.value === 'super_admin');

// Display name, safely handling potential null userData or missing name
const displayName = computed(() => {
  if (userData.value && typeof userData.value === 'object' && 'name' in userData.value) {
    return (userData.value as { name: string }).name;
  }
  return 'User'; // Default fallback name
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="dashboard-view-container p-6 bg-gray-50 min-h-screen flex flex-col items-center">
    <div class="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
      <!-- General Section (for all authenticated users) -->
      <div v-if="userRole" class="mb-6 pb-6 border-b" data-testid="general-section">
        <h1 class="text-3xl font-bold mb-3 text-gray-800">Dashboard</h1>
        <h2 class="text-2xl font-semibold mb-3 text-gray-700" data-testid="welcome-message">
          Welcome, {{ displayName }}!
        </h2>
        <p class="text-gray-600">
          Your current role: <span class="font-semibold">{{ userRole }}</span>
        </p>
        <p class="text-gray-600 mt-2">
          This is your personal learning dashboard. Review your progress and manage your account.
        </p>
      </div>

      <!-- Admin Section (for admin and super_admin) -->
      <div v-if="isAdmin" class="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm" data-testid="admin-panel">
        <h3 class="text-xl font-semibold mb-2 text-blue-800">Admin Panel</h3>
        <p class="text-blue-700">
          Here you can manage basic user data, content settings, and view site analytics.
        </p>
        <!-- Add admin-specific components or links here -->
        <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm">
          Manage Users
        </button>
      </div>

      <!-- Super Admin Section (for super_admin only) -->
      <div v-if="isSuperAdmin" class="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-lg shadow-sm" data-testid="super-admin-panel">
        <h3 class="text-xl font-semibold mb-2 text-purple-800">Super Admin Settings</h3>
        <p class="text-purple-700">
          Access critical system configurations, full user management, and advanced site controls.
        </p>
        <!-- Add super_admin-specific components or links here -->
        <button class="mt-3 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded text-sm">
          System Configuration
        </button>
      </div>

      <!-- Logout Button -->
      <div class="mt-8 text-center">
        <button
          data-testid="logout-button"
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow focus:outline-none focus:shadow-outline transform transition hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles for DashboardView */
.dashboard-view-container {
  /* Centralizing content if needed, Tailwind handles most of this */
}
</style>
