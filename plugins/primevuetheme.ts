// Initializes the theme cookie, and re-resolves it (if "system") to
// ensure a consistent state. Watches the cookie, and updates PrimeVue
// state. It also monitors the system color scheme using listeners on
// a media query.
//
// See https://primevue.org/theming/#switchthemes.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:suspense:resolve", () => {
    nuxtApp.vueApp.runWithContext(() => {
      const theme = usePrimeVueTheme();
      let currentTheme = theme.current;

      // If this runs on app:mounted, a hydration error occurs if the
      // preferred color scheme is not the same as the server's. Not
      // even a nextTick is enough. Hence running this in
      // app:suspense:resolve.
      watchPreferredPrimeVueTheme(theme);

      const primeVue = usePrimeVue();
      watch(
        theme.resolved,
        (theme) => {
          if (theme === currentTheme) return;

          primeVue.changeTheme(currentTheme, theme, "primevue-theme-link");
          document.getElementsByTagName("html")[0].dataset.primevueTheme = theme;
          currentTheme = theme;
        },
        { immediate: true },
      );
    });
  });
});
