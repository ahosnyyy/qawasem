<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? "white" : appConfig.theme.colors.text.light);
</script>

<template>
  <UFooter>
    <template #right>
      <p
        class="text-sm flex items-center"
        :style="{ color: textColor }"
      >
        جميع الحقوق محفوظة
        <img
          :src="isDark ? '/karezma-dark.svg' : '/karezma-light.svg'"
          alt="Karezma Logo"
          class="mx-2 w-16"
        >
        {{ new Date().getFullYear() }} ©
      </p>
    </template>
  </UFooter>
</template>
