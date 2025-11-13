<script setup lang="ts">
// import { ar, en } from "@nuxt/ui/locale";
import { computed } from "vue";

// const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();

const isOpen = ref(false);

// Ensure colorMode is properly reactive
const isDarkMode = computed(() => colorMode?.value === "dark");

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
          <!-- Search - always visible -->
          <SearchInput />
          <!-- Settings button (placed after search) -->
          <button
            class="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-normal hover:opacity-70 dark:hover:opacity-60 transition-opacity cursor-pointer"
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
          <!-- Desktop: Show all items -->
          <div class="hidden md:flex items-center gap-3 lg:gap-12">
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

          <!-- Mobile: Toggle Menu Button -->
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bars-2"
            class="md:hidden !bg-transparent hover:!bg-transparent active:!bg-transparent focus:!bg-transparent"
            aria-label="Toggle menu"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            @click="isOpen = !isOpen"
          />
        </div>
      </template>
    </UHeader>

    <!-- Mobile Menu Overlay -->
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
        class="md:hidden fixed inset-0 z-[110]"
        @click="isOpen = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="md:hidden fixed top-20 left-0 right-0 z-[120] shadow-lg"
        :class="isDarkMode ? 'bg-white text-black' : 'bg-black text-white'"
      >
        <div class="px-4 py-6 space-y-4">
          <!-- Settings and Color Mode Toggle Row -->
          <div class="flex items-center justify-between gap-3">
            <button
              class="flex items-center gap-3 text-sm font-normal hover:opacity-70 transition-opacity"
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
            <ColorModeToggle />
          </div>

          <!-- 
          <div class="border-t border-current/20" />

          <div class="space-y-4 text-sm font-light pt-2">
            <div class="flex items-center justify-between gap-3">
              <span class="font-['Inter']" dir="ltr">+971 4 765 4321</span>
              <img
                src="/icons/phone.svg"
                alt="Phone"
                class="w-4 h-4"
                :class="isDarkMode ? '' : 'filter brightness-0 invert'"
              >
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="font-['Inter']">info@qawasem.com</span>
              <img
                src="/icons/mail.svg"
                alt="Email"
                class="w-4 h-4"
                :class="isDarkMode ? '' : 'filter brightness-0 invert'"
              >
            </div>
          </div>
          -->
        </div>
      </div>
    </Transition>
  </div>
</template>
