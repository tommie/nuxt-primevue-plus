export type ResolvedTheme = string;
export type Theme = "system" | ResolvedTheme;

export interface PrimeVueThemeCookie {
  preferred: Theme;
  resolved: ResolvedTheme;
}

export interface PrimeVueThemeOptions {
}

export interface PrimeVueThemeState {
  preferred: Ref<Theme>;
  resolved: Ref<ResolvedTheme>;
  current: ResolvedTheme;

  resolve(): void;
}

export type Themed<T> = T | Record<ResolvedTheme, T>;

export function pickThemed<T extends string | number | boolean | any[]>(
  v: Themed<T> | Ref<Themed<T> | undefined> | undefined,
  theme: PrimeVueThemeState,
) {
  const vv = unref(v);
  const tt = unref(theme.resolved);
  if (!vv) return vv;
  if (typeof vv === "object" && !Array.isArray(vv)) {
    return (tt in vv ? vv[tt] : vv["default"]) as T;
  }
  return vv;
}

// Returns an object with reactive PrimeVue theme settings.
//
// The preferred mode is what the user sets, and is writeable.
// The resolved mode has resolved "system" to something real.
// The current mode is what PrimeVue is actually showing.
export function usePrimeVueTheme(options?: PrimeVueThemeOptions): PrimeVueThemeState {
  const appConfig = useAppConfig();
  const cookie = useCookie<PrimeVueThemeCookie | null>(appConfig.primevueTheme?.cookieName ?? "primevue-theme", {
    httpOnly: false,
    secure: true,
    path: "/",
    sameSite: "none",

    ...appConfig.primevueTheme?.cookieOptions,

    watch: "shallow",
  });

  // Force writing the cookie, since the server needs it. cookie-es
  // returns an unparsed string if the JSON is invalid. That's not
  // something we can use.
  if (!cookie.value || typeof cookie.value === "string") {
    cookie.value = {
      preferred: "system",
      resolved: resolveTheme("system", getCurrentTheme()),
    };
  }

  // When there is no cookie, the server will return its default and
  // the client will initialize the cookie by resolving 'system'. This will cause a DOM mismatch. We
  // pass the resolved value to the client in a hydration state to solve that.
  const resolved = useState("primevue-theme", () => cookie.value!.resolved);

  function updatePreferred(theme: Theme) {
    const newRes = resolveTheme(theme, getCurrentTheme());

    if (theme === cookie.value!.preferred && newRes === resolved.value) return;

    cookie.value = {
      preferred: theme,
      // If the browser doesn't support 'system', we fall back to preserving what we had.
      resolved: newRes,
    };
    resolved.value = cookie.value.resolved;
  }

  return {
    preferred: computed({
      get() {
        return cookie.value!.preferred;
      },
      set(theme: Theme) {
        updatePreferred(theme);
      },
    }),

    resolved,

    get current() {
      return getCurrentTheme();
    },

    resolve() {
      updatePreferred(cookie.value!.preferred);
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
    theme.preferred,
    (preferred) => {
      if (preferred !== "system") {
        if (query) {
          query.removeEventListener("change", cb);
          query = undefined;
          return;
        }
      }

      const resolved = resolveTheme(preferred, getCurrentTheme());
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
function resolveTheme(theme: Theme, fallback: ResolvedTheme): ResolvedTheme {
  if (theme !== "system") return theme;

  if ("matchMedia" in globalThis) {
    if (globalThis.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }

  return fallback;
}

// Returns the current theme, based on the <html data-primevue-theme>
// attribute set by the Nitro plugin.
function getCurrentTheme(): ResolvedTheme {
  const appConfig = useAppConfig();

  if (process.server) {
    if (!appConfig.primevueTheme.defaultTheme)
      throw createError({
        fatal: true,
        statusMessage: "appConfig is missing defaultTheme",
      });
    return appConfig.primevueTheme.defaultTheme;
  }

  const theme = document.getElementsByTagName("html")[0].dataset.primevueTheme;

  if (!theme)
    throw createError({
      fatal: true,
      statusMessage: "Missing primevue-theme attribute",
    });

  if (!(theme in appConfig.primevueTheme.themes)) {
    throw createError({
      fatal: true,
      statusMessage: `Invalid primevue-theme attribute: ${theme}`,
    });
  }

  return theme;
}
