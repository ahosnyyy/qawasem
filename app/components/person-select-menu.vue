<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

interface Props {
  modelValue?: SelectMenuItem | undefined
  items?: SelectMenuItem[]
  loading?: boolean
  placeholder?: string
  class?: string
  showLoadingIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'ادخل اسم الشخص',
  class: 'w-full max-w-md',
  loading: false,
  showLoadingIndicator: true
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectMenuItem | undefined]
  'search': [query: string]
}>()

const { isDark } = useTheme()

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
  return isDark.value 
    ? '!bg-gradient-to-r !from-[rgba(139,114,78,0.23)] !to-[rgba(241,198,135,0.23)]'
    : '!bg-white'
})

const contentBackground = computed(() => {
  return isDark.value
    ? '!bg-gradient-to-r !from-[rgba(139,114,78,0.23)] !to-[rgba(241,198,135,0.23)]'
    : '!bg-white'
})

const selectMenuRef = ref<any>(null)
let observer: MutationObserver | null = null
const attachedInputs = new WeakSet<HTMLInputElement>()

// Function to attach search listener to an input
function attachSearchListener(input: HTMLInputElement) {
  if (attachedInputs.has(input)) return
  
  attachedInputs.add(input)
  const handleInput = (e: Event) => {
    const query = (e.target as HTMLInputElement)?.value || ''
    emit('search', query)
  }
  input.addEventListener('input', handleInput)
  
  // Store cleanup function on the element
  ;(input as any).__searchCleanup = () => {
    input.removeEventListener('input', handleInput)
    attachedInputs.delete(input)
    delete (input as any).__searchCleanup
  }
}

// Set up MutationObserver to watch for search input appearing
onMounted(() => {
  observer = new MutationObserver(() => {
    // Find all inputs with the search placeholder
    const searchInputs = Array.from(
      document.querySelectorAll('input[type="text"]')
    ).filter((input) => 
      input.getAttribute('placeholder')?.includes('ابحث')
    ) as HTMLInputElement[]
    
    searchInputs.forEach(attachSearchListener)
  })
  
  // Observe the entire document for added nodes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  
  // Clean up all attached listeners
  const allInputs = document.querySelectorAll('input[type="text"]')
  allInputs.forEach((input) => {
    if ((input as any).__searchCleanup) {
      ;(input as any).__searchCleanup()
    }
  })
})
</script>

<template>
  <USelectMenu
    ref="selectMenuRef"
    v-model="value"
    :avatar="selectedAvatar"
    :items="items || []"
    :loading="showLoadingIndicator ? loading : false"
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

