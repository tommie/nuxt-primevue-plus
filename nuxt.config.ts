// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["primevue"],
  },
  css: ["primeicons/primeicons.css", "primeflex/primeflex.css"],
  primevueTheme: {
    themes: {
      /*light: {
        label: "Light",
        icon: "pi pi-sun",
        path: "primevue/resources/themes/md-light-indigo/theme.css",
      },
      dark: {
        label: "Dark",
        icon: "pi pi-moon",
        path: "primevue/resources/themes/md-dark-indigo/theme.css",
      },*/
    },
    defaultTheme: "light",
  },
});
