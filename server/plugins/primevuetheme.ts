import type { EventHandlerRequest, H3Event } from "h3";

// A plugin to inject a theme style for PrimeVue, based on
// https://primevue.org/theming/styled/#options.
//
// This looks at the theme cookie to avoid flashing.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html, { event }) => {
    const appConfig = useAppConfig();
    const colorScheme = getResolvedTheme(event, appConfig.primevueTheme.cookieName, appConfig.primevueTheme.defaultColorScheme);

    html.htmlAttrs ||= [];
    html.htmlAttrs.push(`data-primevue-color-scheme="${encodeURIComponent(colorScheme)}"`);
  });
});

function getResolvedTheme(event: H3Event<EventHandlerRequest>, cookieName: string, fallback: string) {
  const cookie = getCookie(event, cookieName);
  if (!cookie) return fallback;

  try {
    const data = JSON.parse(decodeURIComponent(cookie)) as PrimeVueThemeCookie;

    return data.colorScheme.resolved ?? fallback;
  } catch {
    deleteCookie(event, cookieName);
    return fallback;
  }
}
