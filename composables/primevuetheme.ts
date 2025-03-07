export type ResolvedColorScheme = string;
export type ColorScheme = "system" | ResolvedColorScheme;

export interface PrimeVueThemeCookie {
  colorScheme: {
    preferred: ColorScheme;
    resolved: ResolvedColorScheme;
  };
}

export interface PrimeVueThemeState {
  colorScheme: {
    preferred: ColorScheme;
    resolved: ResolvedColorScheme;
    current: ResolvedColorScheme;
  };

  resolve(): void;
  resolveSystem(): ResolvedColorScheme;
}

// Returns an object with reactive PrimeVue theme settings.
//
// The preferred mode is what the user sets, and is writeable.
// The resolved mode has resolved "system" to something real.
// The current mode is what PrimeVue is actually showing.
export function usePrimeVueTheme(): PrimeVueThemeState {
  const appConfig = useAppConfig();
  const cookie = useCookie<PrimeVueThemeCookie | null>(appConfig.primevueTheme.cookieName, {
    httpOnly: false,
    secure: true,
    path: "/",
    sameSite: "lax",

    ...appConfig.primevueTheme.cookieOptions,

    readonly: false,
    watch: "shallow",
  });

  // Force writing the cookie, since the server needs it. cookie-es
  // returns an unparsed string if the JSON is invalid. That's not
  // something we can use.
  if (!cookie.value || typeof cookie.value === "string") {
    cookie.value = {
      colorScheme: {
        preferred: "system",
        resolved: resolveTheme("system", getCurrentColorScheme()),
      },
    };
  }

  // When there is no cookie, the server will return its default and
  // the client will initialize the cookie by resolving 'system'. This will cause a DOM mismatch. We
  // pass the resolved value to the client in a hydration state to solve that.
  const resolved = useState("primevue-theme", () => cookie.value!.colorScheme.resolved);

  function updatePreferred(theme: ColorScheme) {
    const newRes = resolveTheme(theme, getCurrentColorScheme());

    if (theme === cookie.value!.colorScheme.preferred && newRes === resolved.value) return;

    cookie.value = {
      colorScheme: {
        preferred: theme,
        // If the browser doesn't support 'system', we fall back to preserving what we had.
        resolved: newRes,
      },
    };
    resolved.value = cookie.value.colorScheme.resolved;
  }

  return {
    colorScheme: reactive({
      preferred: computed({
        get() {
          return cookie.value!.colorScheme.preferred;
        },
        set(theme: ColorScheme) {
          updatePreferred(theme);
        },
      }),

      resolved,

      get current() {
        return getCurrentColorScheme();
      },
    }),

    resolve() {
      updatePreferred(cookie.value!.colorScheme.preferred);
    },

    resolveSystem() {
      return resolveTheme("system", appConfig.primevueTheme.defaultColorScheme);
    },
  };
}

// Issues and watches media queries to update the resolved state if
// system preferences change.
//
// See https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
export function watchPreferredPrimeVueTheme(theme: PrimeVueThemeState) {
  if (!("matchMedia" in globalThis)) return;

  let query: MediaQueryList | undefined;

  const cb = () => {
    theme.resolve();
  };

  watch(
    () => theme.colorScheme.preferred,
    (preferred) => {
      if (preferred !== "system") {
        if (query) {
          query.removeEventListener("change", cb);
          query = undefined;
          return;
        }
      }

      const resolved = resolveTheme(preferred, getCurrentColorScheme());
      const q = globalThis.matchMedia(`(prefers-color-scheme: ${resolved})`);
      if (!q.matches) return;

      query = q;
      query.addEventListener("change", cb);
    },
    { immediate: true },
  );

  cb();

  return () => {
    if (query) {
      query.removeEventListener("change", cb);
      query = undefined;
    }
  };
}

// Resolves the theme.
//
// See https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme.
function resolveTheme(theme: ColorScheme, fallback: ResolvedColorScheme): ResolvedColorScheme {
  if (theme !== "system") return theme;

  if ("matchMedia" in globalThis) {
    if (globalThis.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }

  return fallback;
}

// Returns the current color scheme, based on the
// <html data-primevue-color-scheme> attribute set by the Nitro plugin.
function getCurrentColorScheme(): ResolvedColorScheme {
  const appConfig = useAppConfig();

  if (process.server) {
    if (!appConfig.primevueTheme.defaultColorScheme)
      throw createError({
        fatal: true,
        statusMessage: "appConfig is missing defaultColorScheme",
      });
    return appConfig.primevueTheme.defaultColorScheme;
  }

  const scheme = document.getElementsByTagName("html")[0].dataset.primevueColorScheme;

  if (!scheme)
    throw createError({
      fatal: true,
      statusMessage: "Missing data-primevue-color-scheme attribute",
    });

  if (!(scheme in appConfig.primevueTheme.colorSchemes)) {
    throw createError({
      fatal: true,
      statusMessage: `Invalid data-primevue-color-scheme attribute: ${scheme}`,
    });
  }

  return scheme;
}
