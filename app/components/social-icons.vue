<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? appConfig.theme.colors.text.dark : appConfig.theme.colors.text.light);
const isOpen = ref(false);

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
  <div>
    <!-- Desktop: Always visible on left -->
    <div class="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-50 flex-col gap-6 bg-transparent backdrop-blur-none py-6 px-3 rounded-l-lg">
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

    <!-- Mobile: Toggle Button -->
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-heroicons-megaphone"
      class="md:hidden fixed left-3 top-1/2 -translate-y-1/2 z-[60]"
      aria-label="Toggle social links"
      :style="{ color: textColor }"
      @click="isOpen = !isOpen"
    />

    <!-- Mobile: Backdrop -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="md:hidden fixed inset-0 bg-black/30 z-[55]"
        @click="isOpen = false"
      />
    </Transition>

    <!-- Mobile: Social Icons Overlay -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
    >
      <div
        v-if="isOpen"
        class="md:hidden fixed left-3 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4 bg-transparent backdrop-blur py-4 px-3 rounded-lg shadow-lg"
      >
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          :aria-label="link.name"
          class="transition-transform hover:scale-110"
          @click="isOpen = false"
        >
          <img
            :src="link.icon"
            :alt="link.name"
            class="w-5 h-5"
            :class="isDark ? 'filter-dark' : 'filter-light'"
          >
        </a>
      </div>
    </Transition>
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
