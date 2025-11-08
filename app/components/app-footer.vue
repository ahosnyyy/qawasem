<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? "white" : appConfig.theme.colors.text.light);
</script>

<template>
  <div class="fixed bottom-0 left-0 z-[80] pointer-events-none">
    <div class="container mx-auto px-4 lg:px-8 py-6">
      <div class="flex justify-start pointer-events-auto" dir="ltr">
        <p
          class="text-sm flex items-center gap-2 bg-transparent"
          :style="{ color: textColor, fontFamily: '\'IBM Plex Sans Arabic\', sans-serif' }"
        >
        © {{ new Date().getFullYear() }} 
          <img
            :src="isDark ? '/karezma-dark.svg' : '/karezma-light.svg'"
            alt="Karezma Logo"
            class="h-6"
          >
          جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  </div>
</template>
