<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const actions = [
  { label: "عن التطبيق", icon: "/icons/about.svg", to: "/settings/about" },
  { label: "الشروط والأحكام", icon: "/icons/terms.svg", to: "/settings/terms" },
  { label: "الدعم الفني", icon: "/icons/support.svg", to: "/settings/support" },
  { label: "الأسئلة الشائعة", icon: "/icons/faq.svg", to: "/settings/faqs" },
];
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center px-4 sm:px-12 lg:px-24">
    <!-- Title -->
    <h1
      class="text-2xl md:text-3xl text-center mt-8 mb-24"
      :style="{ color: textColor }"
    >
      الإعدادات
    </h1>

    <!-- Actions row -->
    <div class="w-full grid grid-cols-2 gap-10 lg:flex lg:items-center lg:justify-between">
      <div
        v-for="(action, idx) in actions"
        :key="idx"
        class="flex flex-col items-center justify-start gap-3"
      >
        <div class="flex items-center justify-center">
          <GradientRingButton
            v-bind="{
              icon: action.icon,
              ariaLabel: action.label,
              to: action.to,
            }"
          />
        </div>

        <span class="text-sm md:text-base text-center" :style="{ color: textColor }">
          {{ action.label }}
        </span>
      </div>
    </div>
  </div>
</template>
