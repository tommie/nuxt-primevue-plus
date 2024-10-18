import Lara from '@primevue/themes/lara';

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxtjs/tailwindcss'],
  primevue: {
    options: {
      theme: {
        preset: Lara,
      },
    },
  },
});
