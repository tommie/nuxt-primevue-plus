import type { EventHandlerRequest, H3Event } from "h3";

// A plugin to inject a theme style for PrimeVue, based on
// https://primevue.org/theming/#switchthemes.
//
// This looks at the theme cookie to avoid flashing.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html, { event }) => {
    const appConfig = useAppConfig();
    if (!appConfig.primevueTheme.defaultTheme) return;
    const theme = getResolvedTheme(event, appConfig.primevueTheme.cookieName ?? "primevue-theme", appConfig.primevueTheme.defaultTheme);

    html.htmlAttrs ||= [];
    html.htmlAttrs.push(`data-primevue-theme="${encodeURIComponent(theme)}"`);
    html.head ||= [];
    html.head.push(
      `<link id="primevue-theme-link" rel="stylesheet" href="/themes/${encodeURIComponent(
        theme,
      )}/theme.css">`,
    );
  });
});

function getResolvedTheme(event: H3Event<EventHandlerRequest>, cookieName: string, fallback: string) {
  const cookie = getCookie(event, cookieName);
  if (!cookie) return fallback;

  try {
    return JSON.parse(decodeURIComponent(cookie)).resolved ?? fallback;
  } catch {
    deleteCookie(event, cookieName);
    return fallback;
  }
}
