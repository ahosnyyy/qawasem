<script setup lang="ts">
// Use useCookie-based theme composable for SSR compatibility
const { theme, isDark, toggleTheme } = useTheme();

function toggleColorMode() {
  toggleTheme();
}
</script>

<template>
  <!-- Custom Color Mode Toggle Switch -->
  <button
    class="relative inline-flex items-center w-[68px] h-[30px] rounded-full transition-colors duration-300"
    :style="isDark ? { backgroundColor: '#22244B' } : { backgroundColor: '#F0FBFF' }"
    aria-label="Toggle color mode"
    dir="ltr"
    @click="toggleColorMode"
  >
    <!-- Background with sun and moon -->
    <div class="absolute inset-0 flex items-center justify-between px-2 rounded-full">
      <!-- Sun icon (always on left) -->
      <img
        src="/icons/sun.svg"
        alt="Light mode"
        class="w-[20px] h-[20px] transition-opacity duration-300"
      >
      <!-- Moon icon (always on right) -->
      <img
        src="/icons/moon.svg"
        alt="Night mode"
        class="w-[20px] h-[20px] transition-opacity duration-300"
      >
    </div>

    <!-- Toggle circle -->
    <div
      class="relative w-[24px] h-[24px] rounded-full shadow-md transition-all duration-300 ease-in-out"
      :class="[
        isDark ? 'translate-x-[4px] bg-white' : 'translate-x-[40px] bg-black',
      ]"
    />
  </button>
</template>
