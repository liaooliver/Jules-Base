<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import { isAuthenticated } from '@/router/index'; // Import the ref
import { useRouter } from 'vue-router';

const router = useRouter();

const simulateLogin = () => {
  isAuthenticated.value = true;
  // Redirect to dashboard after 'login'
  router.push({ name: 'Dashboard' });
};
</script>

<template>
  <div
    class="login-view-container p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
      <LoginForm @submit.prevent="simulateLogin" />
      <div class="mt-6 text-center">
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="simulateLogin"
        >
          Simulate Successful Login & Go to Dashboard
        </button>
        <p class="text-sm text-gray-600 mt-2">
          (This button bypasses form validation and sets auth status)
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles for LoginView */
</style>
