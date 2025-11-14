<template>
  <div>User preference: {{ userTheme }}</div>
</template>

<script setup>
// This works on both server and client
// Based on: https://nuxt.com/docs/4.x/guide/best-practices/hydration
const userTheme = useCookie('theme', { default: () => 'light' })
</script>

