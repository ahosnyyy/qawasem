<script setup lang="ts">
// import { ar, en } from "@nuxt/ui/locale";
import { computed } from "vue";

// const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();

// Ensure colorMode is properly reactive
const isDarkMode = computed(() => colorMode?.value === "dark");

/*
const locales = [
  { ...en, code: "en" },
  { ...ar, code: "ar" },
]; */
</script>

<template>
  <UHeader
    class="h-20 border-0 fixed top-0 left-0 right-0 z-50"
    :class="isDarkMode ? 'bg-white text-black' : 'bg-black text-white'"
    :toggle="false"
    :ui="{ toggle: 'hidden', overlay: 'hidden', content: 'hidden' }"
  >
    <template #left>
      <div class="flex items-center gap-12">
        <SearchInput />
        <!-- Settings button -->
        <button class="flex items-center gap-3 text-sm font-normal hover:opacity-70 dark:hover:opacity-60 transition-opacity cursor-pointer">
          <span>الإعدادات</span>
          <img
            src="/icons/settings.svg"
            alt="Settings"
            class="w-4 h-4"
            :class="isDarkMode ? '' : 'filter brightness-0 invert'"
          >
        </button>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-12">
        <!-- Phone and Email -->
        <div class="flex items-center gap-6 text-sm font-light mr-4">
          <div class="flex items-center gap-3">
            <span class="font-['Inter']" dir="ltr">+971 4 765 4321</span>
            <img
              src="/icons/phone.svg"
              alt="Phone"
              class="w-4 h-4"
              :class="isDarkMode ? '' : 'filter brightness-0 invert'"
            >
          </div>
          <div class="flex items-center gap-3">
            <span class="font-['Inter']">info@qawasem.com</span>
            <img
              src="/icons/mail.svg"
              alt="Email"
              class="w-4 h-4"
              :class="isDarkMode ? '' : 'filter brightness-0 invert'"
            >
          </div>
        </div>

        <ColorModeToggle />

        <!--
        <ULocaleSelect
          v-model="locale"
          :locales="locales"
          @update:model-value="(value) => setLocale(value as 'en' | 'ar')"
        />
        -->
      </div>
    </template>
  </UHeader>
</template>
