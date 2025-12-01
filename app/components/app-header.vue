<script setup lang="ts">

// import { ar, en } from "@nuxt/ui/locale";

// const { locale, setLocale, t } = useI18n();
const { isDark: isDarkMode } = useTheme();

/*
const locales = [
  { ...en, code: "en" },
  { ...ar, code: "ar" },
]; */
</script>

<template>
  <div class="relative">
    <UHeader
      class="h-20 border-0 fixed top-0 left-0 right-0 z-[150]"
      :class="isDarkMode ? 'bg-white text-black' : 'bg-black text-white'"
      :toggle="false"
      :ui="{ toggle: 'hidden', overlay: 'hidden', content: 'hidden' }"
    >
      <template #left>
        <div class="flex items-center gap-3 md:gap-12">
          <!-- Search - hidden on mobile, visible on desktop -->
          <div class="hidden md:block">
            <SearchInput />
          </div>
          <!-- Settings button - visible on all screens -->
          <button
            class="flex items-center gap-2 lg:gap-3 text-sm font-normal hover:opacity-70 dark:hover:opacity-60 transition-opacity cursor-pointer"
            @click="navigateTo('/settings')"
          >
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
        <div class="flex items-center gap-3 md:gap-12">
          <!-- Color Mode Toggle - visible on all screens -->
          <div class="flex items-center gap-3 lg:gap-12">
            <!-- Phone and Email - show on large screens
            <div class="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-light">
              <div class="flex items-center gap-2 xl:gap-3">
                <span class="font-['Inter']" dir="ltr">+971 4 765 4321</span>
                <img
                  src="/icons/phone.svg"
                  alt="Phone"
                  class="w-3.5 xl:w-4 h-3.5 xl:h-4"
                  :class="isDarkMode ? '' : 'filter brightness-0 invert'"
                >
              </div>
              <div class="flex items-center gap-2 xl:gap-3">
                <span class="font-['Inter']">info@qawasem.com</span>
                <img
                  src="/icons/mail.svg"
                  alt="Email"
                  class="w-3.5 xl:w-4 h-3.5 xl:h-4"
                  :class="isDarkMode ? '' : 'filter brightness-0 invert'"
                >
              </div>
            </div>
            -->
            <ColorModeToggle />
          </div>
        </div>
      </template>
    </UHeader>
  </div>
</template>
