<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

interface SearchResult {
  label: string;
  path: string;
  category: string;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'close': [];
}>();

const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

// Define searchable pages in Arabic
const searchablePages: SearchResult[] = [
  {
    label: "الصفحة الرئيسية",
    path: "/",
    category: "صفحة"
  },
  {
    label: "الشجرة",
    path: "/tree",
    category: "صفحة"
  },
  {
    label: "نسب القواسم",
    path: "/pedigree",
    category: "صفحة"
  },
  {
    label: "الكتب",
    path: "/books",
    category: "صفحة"
  },
  {
    label: "البحث",
    path: "/search",
    category: "صفحة"
  },
  {
    label: "البحث بين شخصين",
    path: "/search/ancestor",
    category: "صفحة"
  }
];

// Filter results based on search query (Arabic search)
const filteredResults = computed<SearchResult[]>(() => {
  if (!searchQuery.value || searchQuery.value.trim().length === 0) {
    return [];
  }

  const query = searchQuery.value.trim().toLowerCase();
  
  return searchablePages.filter(page => {
    // Search in Arabic label
    const labelMatch = page.label.toLowerCase().includes(query);
    
    // Also check if query matches any part of the label
    const words = page.label.split(/\s+/);
    const wordMatch = words.some(word => word.toLowerCase().includes(query));
    
    return labelMatch || wordMatch;
  });
});

const closeModal = () => {
  searchQuery.value = '';
  emit('update:isOpen', false);
  emit('close');
};

// Focus input when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});

const handleResultClick = (result: SearchResult) => {
  navigateTo(result.path);
  closeModal();
};

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] bg-black/30"
      @click="closeModal"
    />
  </Transition>

  <!-- Modal -->
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[210] flex items-start justify-center pt-20 md:pt-32 px-4"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-xl rounded-lg max-h-[80vh] overflow-hidden flex flex-col"
        :class="isDark ? 'bg-white' : 'bg-white'"
        dir="rtl"
      >
        <!-- Search Input -->
        <div class="p-4">
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="أبحث.."
                class="w-full h-12 px-6 py-3 rounded-full border font-normal text-lg placeholder-gray-400 bg-gray-50 text-black border-gray-200 focus:outline-none focus:border-gray-300"
                dir="rtl"
              >
              <img
                src="/icons/search.svg"
                alt="Search"
                class="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40"
              >
            </div>
            <button
              @click="closeModal"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="إغلاق"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="flex-1 overflow-y-auto px-4 pb-4">
          <div v-if="filteredResults.length === 0 && searchQuery.trim().length > 0" class="text-center py-8">
            <p class="text-gray-500 text-sm">
              لا توجد نتائج
            </p>
          </div>
          
          <div v-else-if="filteredResults.length === 0" class="text-center py-8">
            <p class="text-gray-400 text-sm">
              ابدأ بالكتابة...
            </p>
          </div>

          <div v-else class="space-y-0">
            <button
              v-for="(result, index) in filteredResults"
              :key="result.path"
              @click="handleResultClick(result)"
              class="w-full text-right p-3 transition-colors hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              :style="{ color: textColor }"
            >
              {{ result.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

