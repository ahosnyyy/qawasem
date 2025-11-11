<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

interface Props {
  modelValue?: SelectMenuItem | undefined
  items?: SelectMenuItem[]
  loading?: boolean
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'ادخل اسم الشخص',
  class: 'w-full max-w-md',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectMenuItem | undefined]
}>()

const colorMode = useColorMode()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedAvatar = computed(() => {
  if (value.value && typeof value.value === 'object' && 'avatar' in value.value) {
    return value.value.avatar
  }
  return undefined
})

const baseBackground = computed(() => {
  return colorMode.value === 'dark' 
    ? '!bg-gradient-to-r !from-[rgba(139,114,78,0.23)] !to-[rgba(241,198,135,0.23)]'
    : '!bg-white'
})

const contentBackground = computed(() => {
  return colorMode.value === 'dark'
    ? '!bg-gradient-to-r !from-[rgba(139,114,78,0.23)] !to-[rgba(241,198,135,0.23)]'
    : '!bg-white'
})
</script>

<template>
  <USelectMenu
    v-model="value"
    :avatar="selectedAvatar"
    :items="items || []"
    :loading="loading"
    :placeholder="placeholder"
    style="font-family: 'IBM Plex Sans Arabic'; direction: rtl;"
    :class="class"
    size="xl"
    :ui="{
      base: `!rounded-2xl ${baseBackground} !border !border-[rgba(241,198,135,0.17)] !ring-0 focus-visible:!ring-0 focus-visible:!outline-none !text-[#BE9E77]`,
      trailingIcon: '!text-[#F1C687]',
      placeholder: '!text-[#BE9E77] opacity-70',
      content: `!rounded-2xl ${contentBackground} !border !border-[rgba(241,198,135,0.17)] min-w-fit`,
      separator: '!bg-[rgba(241,198,135,0.17)]',
      item: '!text-[#BE9E77] data-highlighted:not-data-disabled:before:bg-[rgba(241,198,135,0.1)]',
      input: '!border-[rgba(241,198,135,0.17)] !text-[#BE9E77] placeholder:!text-[#F1C687]'
    }"
    :search-input="{
      placeholder: 'ابحث',
      class: '!text-[#BE9E77] placeholder:!text-[#F1C687]'
    }"
  >
    <template #trailing>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
        <path d="M10 15L3 8H17L10 15Z" fill="#F1C687"/>
      </svg>
    </template>
    <template #empty>
      <div class="text-center text-[#BE9E77] py-2">
        لا توجد نتائج
      </div>
    </template>
  </USelectMenu>
</template>

