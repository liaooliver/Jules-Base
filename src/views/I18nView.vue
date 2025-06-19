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
import { computed } from 'vue';

const { t, locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};

const currentLocale = computed(() => locale.value);
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>
