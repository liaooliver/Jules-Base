<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

// Imports for Pinia store or other components are no longer directly needed here
// if they are handled by the views themselves.
// We can keep HelloWorld if we want to display it on all pages, or remove it.
// For now, let's create a simple layout with navigation and a view area.
// import HelloWorld from './components/HelloWorld.vue'; // Optional
</script>

<template>
  <div id="app-layout" class="flex flex-col min-h-screen">
    <header class="bg-gray-800 text-white p-4 shadow-md">
      <nav class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-semibold">My App</div>
        <div class="space-x-4">
          <router-link to="/login" class="hover:text-gray-300">Login</router-link>
          <router-link :to="`/${locale}/dashboard`" class="hover:text-gray-300">Dashboard</router-link>
          <router-link :to="`/${locale}/i18n`" class="hover:text-gray-300">I18n Demo</router-link>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto p-4">
      <!-- HelloWorld can be placed here if it's a global component -->
      <!-- <HelloWorld msg="Welcome!" /> -->
      <router-view />
    </main>

    <footer class="bg-gray-700 text-white text-center p-3">
      <p>&copy; {{ new Date().getFullYear() }} My Application</p>
    </footer>
  </div>
</template>

<style scoped>
/* Using Tailwind classes primarily, but some global styles or layout specifics can go here */
/* For example, ensuring the app layout takes full height */
#app-layout {
  /* min-height: 100vh; */ /* Handled by flex flex-col min-h-screen */
}

/* Styling for router-link active class if needed, Vue Router adds 'router-link-active' and 'router-link-exact-active' */
.router-link-active {
  /* Example: Add a distinct style for the active link */
  font-weight: bold;
  /* color: #42b983; */ /* Vue green, or use a Tailwind color */
}
</style>
