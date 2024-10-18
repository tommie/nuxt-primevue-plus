// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-01',

  css: ['primeicons/primeicons.css'],

  modules: ['@primevue/nuxt-module'],

  primevue: {
    components: {
      prefix: 'P',
    },
    options: {
      theme: {
        options: {
          // Allow the user to override the theme for this site.
          darkModeSelector: '[data-primevue-color-scheme="dark"]',
        },
      },
    },
  },
})
