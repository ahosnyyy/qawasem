<script setup lang="ts">
const { locale, locales } = useI18n();
const isAppReady = ref(false);

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

// Minimum loading duration in milliseconds (simulates loading experience)
const MIN_LOADING_DURATION = 1000; // 1 second
const loadStartTime = ref<number | null>(null);

const hideLoader = () => {
  if (!loadStartTime.value) {
    loadStartTime.value = Date.now();
  }

  const elapsed = Date.now() - loadStartTime.value;
  const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsed);

  setTimeout(() => {
    isAppReady.value = true;
  }, remainingTime);
};

if (import.meta.client) {
  loadStartTime.value = Date.now();
  
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    const handleWindowLoad = () => {
      hideLoader();
      window.removeEventListener("load", handleWindowLoad);
    };
    window.addEventListener("load", handleWindowLoad);
    onBeforeUnmount(() => {
      window.removeEventListener("load", handleWindowLoad);
    });
  }
}
</script>

<template>
  <UApp>
    <Transition name="loader-fade">
      <AppLoader v-if="!isAppReady" />
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style scoped>
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.35s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
