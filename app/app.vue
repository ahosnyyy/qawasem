<script setup lang="ts">
const { locale, locales } = useI18n();

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value);
});

useHead({
  htmlAttrs: {
    lang: () => locale.value,
    dir: () => currentLocale.value?.dir || "ltr",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    },
  ],
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
