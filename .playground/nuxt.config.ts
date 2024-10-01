export default defineNuxtConfig({
  extends: [".."],
  primevueTheme: {
    themes: {
      light: {
        label: "Light",
        icon: "pi pi-times",
        path: "primevue/resources/themes/md-light-indigo/theme.css",
      },
      dark: {
        label: "Dark",
        icon: "pi pi-moon",
        path: "primevue/resources/themes/md-dark-indigo/theme.css",
      },
    },
    defaultTheme: "light",
    cookieOptions: {
      secure: false,
      // sameSite=None is not allowed for secure=false.
      sameSite: "lax",
    },
  },
});
