export default defineAppConfig({
  ui: {
    main: {
      base: "min-h-[calc(100vh-var(--ui-header-height))]",
    },
    container: {
      base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8",
    },
    colors: {
      neutral: "zinc",
    },
    icons: {
      light: "i-lucide-sun",
      dark: "/icons/night.svg",
    },
  },
  theme: {
    colors: {
      text: {
        light: "#4A2E1E",
        dark: "#D9B27A",
      },
    },
  },
});
