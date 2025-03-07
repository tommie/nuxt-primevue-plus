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
      const canTransition = Boolean(document.startViewTransition);

      let current = theme.colorScheme.current;
      let nextUseTransition = canTransition;

      // If this runs on app:mounted, a hydration error occurs if the
      // preferred color scheme is not the same as the server's. Not
      // even a nextTick is enough. Hence running this in
      // app:suspense:resolve.
      watchPreferredPrimeVueTheme(theme);

      watch(
        () => theme.colorScheme.resolved,
        (colorScheme) => {
          if (colorScheme === current) return;

          // When starting a print, the browser may change the preferred color
          // scheme. We don't want transitions when that happens. In fact, by
          // disabling transitions, we can mostly avoid flickering on the page.
          const isPrintMedia = window.matchMedia("print").matches;
          const useTransition = canTransition && !isPrintMedia && nextUseTransition;
          nextUseTransition = canTransition;

          if (!useTransition) {
            document.getElementsByTagName("html")[0].dataset.primevueColorScheme = colorScheme;
            current = colorScheme;
            nextUseTransition = !isPrintMedia;
          } else {
            document.startViewTransition(() => {
              document.getElementsByTagName("html")[0].dataset.primevueColorScheme = colorScheme;
              current = colorScheme;
              nextUseTransition = canTransition;
            });
          }
        },
        { immediate: true },
      );
    });
  });
});
