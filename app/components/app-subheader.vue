<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { locale } = useI18n();
const colorMode = useColorMode();
const appConfig = useAppConfig();

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
</script>

<template>
  <div>
    <!-- Backdrop blur layer that extends from main header to end of subheader -->
    <div
      class="absolute top-20 left-0 right-0 h-50 z-39 transition-all duration-300 backdrop-blur-none"
    />

    <!-- Subheader content -->
    <UHeader
      class="absolute top-20 left-0 right-0 z-40 border-0 bg-transparent! h-50 backdrop-blur-none"
      :toggle="false"
      :ui="{ toggle: 'hidden', overlay: 'hidden', content: 'hidden' }"
    >
      <template #left>
        <div class="flex items-center gap-4 md:gap-14 bg-transparent">
          <img
            src="/logo.svg"
            alt="Logo"
            class="h-32 md:h-44 w-auto mt-6"
          >

          <nav
            class="flex items-center gap-4 md:gap-8"
            :dir="isRTL ? 'rtl' : 'ltr'"
          >
            <NuxtLink
              v-for="item in items"
              :key="String(item.to)"
              :to="item.to"
              class="text-sm md:text-base font-normal transition-colors hover:opacity-80 relative pb-1"
              :class="[
                item.active ? 'font-medium underline underline-offset-2' : '',
                isRTL ? 'font-[\'IBM_Plex_Sans_Arabic\']' : 'font-[\'Inter\']',
              ]"
              :style="{ color: textColor }"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </template>

      <template #right>
        <!-- Optional right content -->
      </template>
    </UHeader>
  </div>
</template>
