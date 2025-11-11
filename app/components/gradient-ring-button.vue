<script setup lang="ts">
interface Props {
  icon: string
  ariaLabel: string
  to?: string
}

const props = defineProps<Props>()

const colorMode = useColorMode()
const appConfig = useAppConfig()

const isDark = computed(() => colorMode.value === 'dark')
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || '#D9B27A') : (appConfig.theme?.colors?.text?.light || '#4A2E1E'))
const gold = '#F1C687'

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
const routerNavigate = (e: MouseEvent) => {
  if (!props.to) return
  navigateTo(props.to)
}
</script>

<template>
  <button
    type="button"
    class="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full transition-transform duration-300 hover:scale-105 bg-transparent"
    :aria-label="props.ariaLabel"
    :style="buttonStyle"
  @click="routerNavigate">
    <span
      class="absolute inset-0 rounded-full"
      :style="ringStyle"
    ></span>
    <span
      class="relative z-10 w-10 h-10 md:w-12 md:h-12"
      :style="{
        backgroundColor: isDark ? gold : borderColorLight,
        WebkitMask: `url(${props.icon}) center / contain no-repeat`,
        mask: `url(${props.icon}) center / contain no-repeat`
      }"
    ></span>
  </button>
</template>


