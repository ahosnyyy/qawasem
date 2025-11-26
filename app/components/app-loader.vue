<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();

const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
);

const dotColor = computed(() =>
  isDark.value
    ? "rgba(217, 178, 122, 1)" // Gold for dark mode
    : "rgba(74, 46, 30, 0.9)", // Dark brown for light mode
);
</script>

<template>
  <div class="app-loader">
    <!-- Background Image -->
    <div
      class="app-loader__bg-image"
      style="background-image: url('/backgrounds/bg-splash.jpg');"
    />

    <!-- Gradient Overlay -->
    <div 
      class="app-loader__overlay app-loader__overlay--1"
      :class="{ 'app-loader__overlay--dark': isDark }"
    />
    <div 
      class="app-loader__overlay app-loader__overlay--2"
      :class="{ 'app-loader__overlay--dark': isDark }"
    />

    <img src="/logo.svg" alt="Qawasem" class="app-loader__logo" />

    <!-- Loading Text and Spinner -->
      <div class="app-loader__loading">
      <div class="app-loader__spinner">
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
        <span class="app-loader__dot-wrapper">
          <span class="app-loader__dot" :style="{ backgroundColor: dotColor }"></span>
        </span>
      </div>
      <p 
        class="app-loader__text" 
        :style="{ 
          color: textColor,
          textShadow: isDark 
            ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.3)'
        }"
      >
        جارِ التحميل...
      </p>
    </div>
  </div>
</template>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-loader__bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.app-loader__overlay {
  position: absolute;
  inset: 0;
}

.app-loader__overlay--1 {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.4));
}

.app-loader__overlay--1.app-loader__overlay--dark {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.85));
}

.app-loader__overlay--2 {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.5));
}

.app-loader__overlay--2.app-loader__overlay--dark {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.2));
}

.app-loader__logo {
  position: relative;
  z-index: 1;
  width: 240px;
  height: auto;
  filter: drop-shadow(0 5px 35px rgba(0, 0, 0, 0.5));
}

.app-loader__loading {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.app-loader__spinner {
  position: relative;
  width: 16px;
  height: 16px;
  animation: spinner-rotate 1.2s linear infinite;
}

.app-loader__dot-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform-origin: 0 9px;
}

.app-loader__dot-wrapper:nth-child(1) {
  transform: rotate(0deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(2) {
  transform: rotate(45deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(3) {
  transform: rotate(90deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(4) {
  transform: rotate(135deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(5) {
  transform: rotate(180deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(6) {
  transform: rotate(225deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(7) {
  transform: rotate(270deg) translateY(-9px);
}

.app-loader__dot-wrapper:nth-child(8) {
  transform: rotate(315deg) translateY(-9px);
}

.app-loader__dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.app-loader__dot-wrapper:nth-child(1) .app-loader__dot {
  animation-delay: 0s;
}

.app-loader__dot-wrapper:nth-child(2) .app-loader__dot {
  animation-delay: 0.15s;
}

.app-loader__dot-wrapper:nth-child(3) .app-loader__dot {
  animation-delay: 0.3s;
}

.app-loader__dot-wrapper:nth-child(4) .app-loader__dot {
  animation-delay: 0.45s;
}

.app-loader__dot-wrapper:nth-child(5) .app-loader__dot {
  animation-delay: 0.6s;
}

.app-loader__dot-wrapper:nth-child(6) .app-loader__dot {
  animation-delay: 0.75s;
}

.app-loader__dot-wrapper:nth-child(7) .app-loader__dot {
  animation-delay: 0.9s;
}

.app-loader__dot-wrapper:nth-child(8) .app-loader__dot {
  animation-delay: 1.05s;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.app-loader__text {
  font-size: 1.125rem;
  font-weight: 500;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}
</style>


