<script setup lang="ts">
import NuxtErrorPage from "#app/components/nuxt-error-page.vue";

defineProps<{
  error: object;
}>();
</script>

<template>
  <NuxtErrorPage :error="error" />
</template>

<style>
/* PrimeVue sets margins while the error template does not. This
 * causes scrollbars to appear.
 */
.grid {
  margin: 0;
}

/* NuxtErrorPage uses WindiCSS, we use PrimeVue. PrimeVue sets
 * !important on all styles, so the Windi-specific dark styles are
 * partially overridden. This does what Windi does, except adds !important.
 *
 * Windi uses a prefers-color-scheme query.
 */
@media (prefers-color-scheme: dark) {
  .dark\:bg-black {
    background-color: rgb(0, 0, 0, var(--tw-bg-opacity)) !important;
  }
  .dark\:bg-white\/10 {
    background-color: rgb(255, 255, 255, 0.1) !important;
  }
}
</style>
