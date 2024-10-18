# PrimeVue Theme Layer for Nuxt 3

This Nuxt layer makes using the PrimeVue component library easier in Nuxt.

## Feature Highlights

* Manages light/dark color scheme selection, with handling of SSR without dark/light flashing.
* Provides a small color scheme selection button.
* The `createStaticMessage` outputs HTML that looks like `InlineMessage`, for use in noscript.
* Uses the `@primevue/nuxt-module` for auto-imports.
* Imports the CSS file for PrimeIcons.

## Getting Started

```console
yarn add nuxt-primevue-plus
```

Extend from the layer, and add your theme definitions to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["nuxt-primevue-plus"],

  primevueTheme: {
    // The color scheme used in SSR when there is no indication of user preference.
    defaultColorScheme: "light",
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

## Manual Color Scheme Selection

The `<PrimeVueColorSchemeSelector />` is a single-icon button that opens a dropdown menu for selecting the color scheme.
The special "System" choice uses the `defaultColorScheme` option in combination with the browser's preferred color scheme.

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

### Color Scheme Selection

We use a cookie to transfer preferences from the browser to the SSR.
We store both the preferred choice, and the resolved choice, to support switching color scheme as the browser default changes.

If the server sees no cookie, it uses the configured default color scheme based on configuration.
It writes a data attribute on `<html>` that identifies the current color scheme.

When the browser initializes the page, it will look up the preferred color scheme and compare it to what the server set.
If it's different, a normal PrimeVue color scheme switch is performed.

The browser writes the cookie, which the server picks up on in the next SSR.
This means the user will see a color flash on first access, but will then always see the expected color scheme.

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
