<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { locale } = useI18n();
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isOpen = ref(false);
const isRTL = computed(() => locale.value === "ar");
const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? appConfig.theme.colors.text.dark : appConfig.theme.colors.text.light);

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "الصفحة الرئـيسية",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "الشجرة",
    to: "/tree",
    active: route.path.startsWith("/tree"),
  },
  {
    label: "نسب القواسم",
    to: "/pedigree",
    active: route.path.startsWith("/pedigree"),
  },
  {
    label: "الكتب",
    to: "/books",
    active: route.path.startsWith("/books"),
  },
  {
    label: "البحث",
    to: "/search",
    active: route.path.startsWith("/search"),
  },
]);

// Close mobile menu when route changes
watch(() => route.path, () => {
  isOpen.value = false;
});
</script>

<template>
  <div>
    <!-- Backdrop Overlay - Only show on mobile when menu is open -->
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
        class="md:hidden fixed inset-0 bg-black/30 z-[110]"
        @click="isOpen = false"
      />
    </Transition>

    <div
      class="mt-20 z-[90] relative"
      :class="{ 
        'backdrop-blur': isOpen,
        'bg-neutral-900/95': isOpen && isDark,
        'bg-white/95': isOpen && !isDark,
        'bg-transparent': !isOpen 
      }"
    >
      <UContainer class="py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo and Desktop Navigation -->
          <div class="flex items-center gap-4 md:gap-20">
            <img
              src="/logo.svg"
              alt="Logo"
              class="h-18 md:h-46 w-auto"
            >

            <nav
              class="hidden md:flex items-center gap-4 md:gap-8"
              :dir="isRTL ? 'rtl' : 'ltr'"
            >
              <NuxtLink
                v-for="item in items"
                :key="String(item.to)"
                :to="item.to"
                class="text-sm md:text-base font-normal transition-colors hover:opacity-80 relative"
                :class="[
                  item.active ? 'font-medium underline underline-offset-2 decoration-2' : '',
                  isRTL ? 'font-[\'IBM_Plex_Sans_Arabic\']' : 'font-[\'Inter\']',
                ]"
                :style="{ color: textColor }"
              >
                {{ item.label }}
              </NuxtLink>
            </nav>
          </div>

        <!-- Mobile Menu Button -->
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-bars-2"
          class="md:hidden"
          aria-label="Toggle menu"
          :style="{ color: textColor }"
          @click="isOpen = !isOpen"
        />
        </div>

      </UContainer>
      
      <!-- Mobile Navigation Menu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav
          v-if="isOpen"
          class="md:hidden absolute left-0 right-0 top-full backdrop-blur border-t shadow-lg z-[120]"
          :class="[
            isDark ? 'bg-neutral-900/95 text-white border-gray-800' : 'bg-white/95 text-black border-gray-200'
          ]"
          :dir="isRTL ? 'rtl' : 'ltr'"
        >
            <div class="flex flex-col gap-2 px-4 sm:px-6 lg:px-8 py-4">
              <NuxtLink
                v-for="item in items"
                :key="String(item.to)"
                :to="item.to"
                class="text-base font-normal transition-colors hover:opacity-80 py-2 px-2 rounded"
                :class="[
                  item.active ? 'font-medium underline underline-offset-2 decoration-2' : '',
                  isRTL ? 'font-[\'IBM_Plex_Sans_Arabic\']' : 'font-[\'Inter\']',
                ]"
                :style="{ color: textColor }"
                @click="isOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
        </nav>
      </Transition>
    </div>
  </div>
</template>
