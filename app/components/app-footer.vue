<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? "white" : appConfig.theme.colors.text.light);
</script>

<template>
  <div class="w-full">
    <div class="container bottom-0 mx-auto px-4 lg:px-8 py-6 bg-transparent">
      <div class="flex justify-center lg:justify-start" dir="ltr">
        <p
          class="text-sm flex items-center gap-2"
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
