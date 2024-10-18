import type { NuxtPage } from "@nuxt/schema";
import type { PrimevueThemeConfig, PrimevueThemesConfig, PublicPrimevueThemesConfig } from "./modules/primevuetheme";

declare module "@nuxt/schema" {
  interface AppConfig {
    // This is injected by the module, from nuxt.config.ts.
    primevueTheme: PublicPrimevueThemesConfig;
  }

  interface NuxtConfig {
    primevueTheme?: PrimevueThemesConfig;
  }
}

export {};
