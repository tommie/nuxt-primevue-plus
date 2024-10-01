import { type CookieOptions } from "#app/composables/cookie";
import { dirname } from "pathe";
import { defineNuxtModule, createResolver } from "@nuxt/kit";

export interface PrimevueThemeConfig {
  label: string;
  icon: string;
  path: string;
}

export interface PrimevueThemesConfig {
  themes: Record<string, PrimevueThemeConfig>;
  defaultTheme?: string;

  // The name of the theme cookie; defaults to "primevue-theme".
  cookieName?: string;

  // Overrides of the default cookie options.
  cookieOptions?: CookieOptions<PrimeVueThemeCookie | null>;
}

// A module that serves the theme stylesheets as public assets.
//
// See https://primevue.org/theming/#switchthemes.
export default defineNuxtModule<PrimevueThemesConfig>({
  meta: {
    configKey: "primevueTheme",
  },
  defaults() {
    return { themes: {}, defaultTheme: undefined };
  },
  setup(options, nuxt) {
    const { resolvePath } = createResolver(import.meta.url);

    nuxt.options.appConfig.primevueTheme = {
      ...options,
      themes: Object.fromEntries(
        Object.entries(options.themes).map(([name, { label, icon }]) => [name, { label, icon }]),
      ),
    };

    // Expose the provided theme files as `themes/$name`.
    nuxt.hook("nitro:config", async (nitroConfig) => {
      nitroConfig.publicAssets ||= [];
      for (const [name, { path }] of Object.entries(options.themes)) {
        nitroConfig.publicAssets.push({
          baseURL: "themes/" + name,
          dir: dirname(await resolvePath(path)),
          maxAge: 7 * 24 * 3600,
        });
      }
    });
  },
});
