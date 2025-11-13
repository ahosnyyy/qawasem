import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: false,
  /*
  nitro: {
    preset: 'static'
  },
  hooks: {
    "prerender:routes" ({ routes }) {
      routes.clear()
    }
  },
  router: {
    options: {
      hashMode: true
    }
  }, */
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/i18n",
  ],
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "app-color-mode",
    storage: {
      type: "localStorage",
      key: "app-color-mode",
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        dir: "ltr",
        files: ["en.json"],
      },
      {
        code: "ar",
        name: "العربية",
        language: "ar-SA",
        dir: "rtl",
        files: ["ar.json"],
      },
    ],
    langDir: "locales",
    defaultLocale: "ar",
    strategy: "no_prefix",
    detectBrowserLanguage: false,
  },
});
