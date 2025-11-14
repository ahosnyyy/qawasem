<script setup lang="ts">
const { isDark } = useTheme()
const appConfig = useAppConfig()
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || '#D9B27A') : (appConfig.theme?.colors?.text?.light || '#4A2E1E'))
const gold = '#F1C687'

const actions = [
  { label: 'عن التطبيق', icon: '/icons/about.svg', to: '/settings/about' },
  { label: 'الشروط والأحكام', icon: '/icons/terms.svg', to: '/settings/terms' },
  { label: 'الدعم الفني', icon: '/icons/support.svg', to: '/settings/support' },
  { label: 'الاسئلة الشائعة', icon: '/icons/faq.svg', to: '/settings/faqs' },
]

const borderColorLight = computed(() => textColor.value || gold)

const ringStyle = computed(() => ({
  background: isDark.value
    ? 'linear-gradient(to bottom, rgba(139,114,78,0.7), rgba(241,198,135,0.7))'
    : borderColorLight.value,
  padding: '2px',
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
  backgroundClip: 'border-box',
}))

const buttonStyle = computed(() => ({
  color: isDark.value ? gold : borderColorLight.value,
}))

</script>

<template>
  <div class="w-full flex flex-col items-center justify-center px-4 sm:px-12 lg:px-24">
    <!-- Title -->
    <h1
      class="text-2xl md:text-3xl text-center mt-8 mb-24"
      :style="{ color: textColor }"
    >
      الاعدادات
    </h1>

    <!-- Actions row -->
    <div class="w-full grid grid-cols-2 gap-10 lg:flex lg:items-center lg:justify-between">
      <div
        v-for="(action, idx) in actions"
        :key="idx"
        class="flex flex-col items-center justify-start gap-3"
      >
        <div class="flex items-center justify-center">
          <GradientRingButton :icon="action.icon" :aria-label="action.label" :ariaLabel="action.label" :to="action.to" />
        </div>

        <span class="text-sm md:text-base text-center" :style="{ color: textColor }">
          {{ action.label }}
        </span>
      </div>
    </div>
  </div>
  </template>


