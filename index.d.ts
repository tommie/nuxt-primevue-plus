import type { NuxtPage } from "@nuxt/schema";
import type { PrimevueThemeConfig, PrimevueThemesConfig } from "./modules/primevuetheme";

declare module "@nuxt/schema" {
  interface AppConfig {
    // This is injected by the module, from nuxt.config.ts.
    primevueTheme: Omit<PrimevueThemesConfig, "themes"> & {
      themes: Record<string, Omit<PrimevueThemeConfig, "path">>;
    };
  }

  interface NuxtConfig {
    primevueTheme?: PrimevueThemesConfig;
  }
}

export {};
