<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const socialLinks = [
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    url: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: "/icons/twitter.svg",
    url: "https://twitter.com",
  },
  {
    name: "LinkedIn",
    icon: "/icons/linkedin.svg",
    url: "https://linkedin.com",
  },
  {
    name: "Snapchat",
    icon: "/icons/snapchat.svg",
    url: "https://snapchat.com",
  },
];
</script>

<template>
  <div class="fixed left-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 bg-transparent backdrop-blur-none py-6 px-3 rounded-l-lg">
    <a
      v-for="link in socialLinks"
      :key="link.name"
      :href="link.url"
      target="_blank"
      :aria-label="link.name"
      class="transition-transform hover:scale-110"
    >
      <img
        :src="link.icon"
        :alt="link.name"
        class="w-5 h-5"
        :class="isDark ? 'filter-dark' : 'filter-light'"
      >
    </a>
  </div>
</template>

<style scoped>
/* Light mode: #6F4C33 (brown) */
.filter-light {
  filter: brightness(0) saturate(100%) invert(27%) sepia(15%) saturate(1234%) hue-rotate(356deg) brightness(95%)
    contrast(88%);
}

/* Dark mode: #D9B27A (golden) */
.filter-dark {
  filter: brightness(0) saturate(100%) invert(75%) sepia(21%) saturate(738%) hue-rotate(352deg) brightness(91%)
    contrast(87%);
}
</style>
