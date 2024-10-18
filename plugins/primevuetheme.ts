// Initializes the theme cookie, and re-resolves it (if "system") to
// ensure a consistent state. Watches the cookie, and updates PrimeVue
// state. It also monitors the system color scheme using listeners on
// a media query.
//
// See https://primevue.org/theming/styled/#options.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:suspense:resolve", () => {
    nuxtApp.vueApp.runWithContext(() => {
      const theme = usePrimeVueTheme();
      let current = theme.colorScheme.current;

      // If this runs on app:mounted, a hydration error occurs if the
      // preferred color scheme is not the same as the server's. Not
      // even a nextTick is enough. Hence running this in
      // app:suspense:resolve.
      watchPreferredPrimeVueTheme(theme);

      watch(
        () => theme.colorScheme.resolved,
        (colorScheme) => {
          if (colorScheme === current) return;

          if (!document.startViewTransition) {
            document.getElementsByTagName("html")[0].dataset.primevueColorScheme = colorScheme;
            current = colorScheme;
          } else {
            document.startViewTransition(() => {
              document.getElementsByTagName("html")[0].dataset.primevueColorScheme = colorScheme;
              current = colorScheme;
            });
          }
        },
        { immediate: true },
      );
    });
  });
});
