# PrimeVue/PrimeFlex Layer for Nuxt 3

This Nuxt layer makes using the PrimeVue component library, and the PrimeFlex CSS library, easier in Nuxt.
It enables auto-imports of components and composables, and provides theme selection.

## Feature Highlights

* Manages light/dark theme selection, with handling of SSR without dark/light flashing.
* Provides a small theme selection button.
* Adds PrimeVue as an auto-import source for components (prefix "P", e.g. "PCard") and composables (e.g. "useToast".)
* Imports the CSS files for PrimeFlex and PrimeIcons.

## Getting Started

```console
yarn add nuxt-primevue-plus
```

Extend from the layer, and add your theme definitions to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["nuxt-primevue-plus"],

  primevueTheme: {
    themes: {
      light: {
        // Something displayed in the theme selector button.
        label: "Light",

        // The icon classes for the theme selector button and menu item.
        icon: "pi pi-sun",

        // The module/path to the theme CSS.
        path: "primevue/resources/themes/md-light-indigo/theme.css",
      },
      dark: {
        label: "Dark",
        icon: "pi pi-moon",
        path: "primevue/resources/themes/md-dark-indigo/theme.css",
      },
    },

    // The theme used in SSR when there is no indication of user preference.
    defaultTheme: "light",
  },
});
```

You should now have PrimeVue components available, and the light theme should show:

```console
yarn dev
```

If your browser is set to prefer a dark color scheme, the page will switch to dark, and the next time you reload, the server will use the dark theme from the onset.

You could also just run `yarn dev` in the layer working directory, which will start a demo playground.
Have a look in the `.playground` directory for examples.

## Components Auto-Import

All components are added as auto-imports with the `P` prefix.
This means you simply reference them like `PCard` or `p-card` in `<template>`.

## Composables Auto-Import

The common `useDialog`, `useToast` etc. are auto-importable.

## Multiple Designs

There are two dimensions to theme selection: design and color schemes.
PrimeVue does not separate between the two; they are simply themes.
In order to support automatic color scheme switching based on user preference, we need the distinction.

In the Getting started example, we had a simple relationship between themes and color schemes, but you could extend this to multiple themes:

```ts
themes: {
  md-light: {
    label: "Light",
    icon: "pi pi-sun",
    path: "primevue/resources/themes/md-light-indigo/theme.css",
  },
  md-dark: {
    label: "Dark",
    icon: "pi pi-moon",
    path: "primevue/resources/themes/md-dark-indigo/theme.css",
  },
  luna: {
    label: "Luna",
    icon: "pi pi-times",
    path: "primevue/resources/themes/luna-pink/theme.css",
  },
}
```

Note that the theme configuration keys (e.g. `md-light` above) are stored in a cookie, so don't change them after you have taken on users.

When the color scheme preference suggests the theme needs to change, we find a theme using:

1. Find the theme sharing the longest prefix with the current theme, and having the right `colorScheme`.
2. If ambiguous, use the first one, in configuration order.

A special configuration option `colorScheme: "light"` can be used to mark a theme as light (or dark.)
The layer has built-in defaults for existing PrimeVue themes, so you only need this if you make your own theme.

## Manual Theme Selection

The `<PrimeVueThemeSelector />` is a single-icon button that opens a dropdown menu for selecting the theme.
The special "System" choice uses the `defaultTheme` in combination with the browser's preferred color scheme, and the algorithm above to find a match.

The "System" choice is the default.

## Button Links

PrimeVue has no built-in support for making buttons into links.
For accessibility, it is important that links be links, so we define `ButtonLink` a component with the same API has `Button`, but creating a `NuxtLink`.

## noscript Static Messages

If you would like to output a message styled like PrimeVue's `InlineMessage` inside `useHead({ noscript })`, the `createStaticMessage` function can help.
It returns HTML directly usable in `useHead`:

```ts
useHead({
  noscript: [
    createStaticMessage({ message: 'This is a demo of static message in noscript', severity: 'success' }),
  ],
});
```

## In Depth

### Theme Selection

We use a cookie to transfer preferences from the browser to the SSR.
We store both the preferred choice, and the resolved choice, to support switching color scheme as the browser default changes.

If the server sees no cookie, it uses the configured default theme and adds a `<link>` to the theme CSS.
It writes a data attribute on `<html>` that identifies the current theme.

When the browser initializes the page, it will look up the preferred color scheme and compare it to what the server set.
If it's different, a normal PrimeVue theme switch is performed.

The browser writes the cookie, which the server picks up on in the next SSR.
This means the user will see a color flash on first access, but will then always see the expected theme.

### Cookies

There is no cookie choice implemented.
While the resolved color scheme could be interpreted as fingerprinting, we'd consider it a weak signal.

The default is to `secure: true` `sameSite: "none"`, which means the cookie will only be set on TLS connections and localhost.
You can override cookie options in `nuxt.config.ts`, taking the Nuxt [`useCookie` options](https://nuxt.com/docs/api/composables/use-cookie):

```ts
primevueTheme: {
  cookieName: "custom-theme",
  cookieOptions: {
    secure: false,
    // sameSite=none is not allowed for secure=false.
    sameSite: "lax",
  },
}
```

If you keep seeing flashing, check that the cookie is being set.
