<template>
  <div class="fixed inset-0 -z-10">
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat opacity-20"
      style="background-image: url('/backgrounds/bg.jpg');"
    />

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-linear-to-b from-white to-white/10 dark:from-black/45 dark:to-black/70" />
    <div class="absolute inset-0 bg-linear-to-b from-white/10 to-black/20 dark:from-black/45 dark:to-black/10" />
  </div>
</template>
