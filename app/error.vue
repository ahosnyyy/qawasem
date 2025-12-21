<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    message?: string;
  };
}>();
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
);
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"));
const primaryColor = computed(() => (isDark.value ? "#F1C687" : "#D9B27A"));

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) {
    return "الصفحة غير موجودة";
  }
  return "حدث خطأ";
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) {
    return "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.";
  }
  return props.error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
});

function handleGoHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div
    dir="rtl"
    class="min-h-screen flex flex-col items-center justify-center px-6 md:px-14 lg:px-24 relative"
    style="font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;"
  >
    <!-- Background Image -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-no-repeat opacity-20"
        style="background-image: url('/backgrounds/bg.jpg');"
      />
      <div class="absolute inset-0 bg-linear-to-b from-white to-white/10 dark:from-black/45 dark:to-black/70" />
      <div class="absolute inset-0 bg-linear-to-b from-white/10 to-black/20 dark:from-black/45 dark:to-black/10" />
    </div>

    <div class="text-center space-y-8 max-w-lg">
      <h1
        class="font-bold"
        :style="{ color: textColor, fontSize: 'clamp(3rem, 5vw, 10rem)' }"
      >
        {{ error.statusCode }}
      </h1>

      <h2
        class="text-2xl md:text-3xl"
        :style="{ color: textColor }"
      >
        {{ errorTitle }}
      </h2>

      <p
        class="text-base md:text-lg leading-relaxed"
        :style="{ color: mutedColor }"
      >
        {{ errorMessage }}
      </p>

      <button
        class="mt-8 px-8 py-3 rounded-full flex items-center justify-center mx-auto transition-smooth btn-hover-glow border hover:scale-105"
        :style="{
          background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
          borderColor: primaryColor,
          color: textColor,
        }"
        @click="handleGoHome"
      >
        العودة للرئيسية
      </button>
    </div>
  </div>
</template>
