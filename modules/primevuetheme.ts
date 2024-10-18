import { type CookieOptions } from "#app/composables/cookie";
import { defineNuxtModule } from "@nuxt/kit";

export interface PrimevueColorSchemeConfig {
  label: string;
  icon: string;
}

export interface PrimevueThemesConfig {
  colorSchemes: Record<string, PrimevueColorSchemeConfig>;
  defaultColorScheme?: string;

  // The name of the theme cookie; defaults to "primevue-theme".
  cookieName?: string;

  // Overrides of the default cookie options.
  cookieOptions?: CookieOptions<PrimeVueThemeCookie | null>;
}

export type PublicPrimevueThemesConfig = PrimevueThemesConfig & Required<Pick<PrimevueThemesConfig, "defaultColorScheme" | "cookieName">>;

// A module that publishes the theming configuration to the client.
//
// See https://primevue.org/theming/styled/#usepreset.
export default defineNuxtModule<PrimevueThemesConfig>({
  meta: {
    configKey: "primevueTheme",
  },
  defaults() {
    return {
      colorSchemes: {
        system: {
          label: "System",
          icon: "pi pi-file",
        },
        light: {
          label: "Light",
          icon: "pi pi-sun",
        },
        dark: {
          label: "Dark",
          icon: "pi pi-moon",
        },
      },
      defaultColorScheme: "light",
      cookieName: "primevue-theme",
    };
  },
  setup(options, nuxt) {
    nuxt.options.appConfig.primevueTheme = options as PublicPrimevueThemesConfig;
  },
});
