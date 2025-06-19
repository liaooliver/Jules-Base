<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ $t('greeting') }}</h1>
    <p class="mb-4">{{ $t('welcome') }}</p>

    <div class="space-x-2">
      <button
        @click="changeLanguage('en')"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        :class="{ 'ring-2 ring-blue-300': currentLocale === 'en' }"
      >
        English
      </button>
      <button
        @click="changeLanguage('zh')"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        :class="{ 'ring-2 ring-green-300': currentLocale === 'zh' }"
      >
        中文 (Chinese)
      </button>
    </div>
    <p class="mt-4">Current language: {{ currentLocale }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router'; // Import useRouter and useRoute
import { computed } from 'vue';

const { t, locale } = useI18n(); // locale from useI18n will reflect current lang from URL via router guard
const router = useRouter();
const route = useRoute(); // To get current route name or params if needed

const changeLanguage = (lang: string) => {
  // We need to navigate to the same page but with a different language code.
  // The current route name can be used if all relevant routes are named.
  // The route for this page is 'I18nDemo'.
  if (route.name) {
    router.push({ name: route.name, params: { ...route.params, lang: lang } });
  } else {
    // Fallback for safety, though route.name should be available for 'I18nDemo'
    // This fallback assumes the current path is like /currentlang/i18n
    // and attempts to replace the language part.
    const currentPathParts = route.path.split('/');
    if (currentPathParts.length > 2 && (currentPathParts[1] === 'en' || currentPathParts[1] === 'zh')) {
      currentPathParts[1] = lang;
      // Ensure the base path is correct, e.g., /i18n
      if (currentPathParts[2] === 'i18n') {
         router.push(currentPathParts.join('/'));
      } else {
        // If the path structure is not /:lang/i18n, redirect to the known i18n page for the new language
        router.push({ name: 'I18nDemo', params: { lang: lang } });
        console.warn('Path structure not /:lang/i18n, redirecting to I18nDemo with new lang.');
      }
    } else {
      // Absolute fallback: if path doesn't match expected structure at all
      router.push({ name: 'I18nDemo', params: { lang: lang } });
      console.warn('Could not determine current page structure for language switch, redirecting to I18nDemo with new lang.');
    }
  }
};

const currentLocale = computed(() => locale.value); // This should still work, reflecting URL-driven locale
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>
