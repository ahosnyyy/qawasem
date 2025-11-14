<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';

const route = useRoute();
const router = useRouter();

// Get book ID from route
const bookId = route.params.book as string;

// Book data
const booksData: Record<string, { title: string; pdfUrl: string }> = {
  '1': {
    title: 'القول الحاسم في نسب القواسم',
    pdfUrl: '/books/1.pdf'
  },
  '2': {
    title: 'التذكرة بالأرحام',
    pdfUrl: '/books/2.pdf'
  }
};

// Check if book exists
const currentBook = booksData[bookId];
if (!currentBook) {
  router.push('/books');
}

const page = ref(1);
const { pdf, pages } = usePDF(currentBook?.pdfUrl || '/books/1.pdf');

const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

const vuePDFRef = ref(null);
const pdfContainerWidth = ref(600);

// Keyboard navigation handler (RTL: Right = Previous, Left = Next)
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    // Previous page (RTL)
    if (page.value > 1) {
      page.value--;
    }
  } else if (event.key === 'ArrowLeft') {
    // Next page (RTL)
    if (page.value < pages.value) {
      page.value++;
    }
  }
};

onMounted(() => {
  // Calculate available height for PDF (viewport - title - navigation - padding)
  pdfContainerWidth.value = window.innerWidth * 0.55;
  
  // Add keyboard event listener
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('keydown', handleKeyPress);
});

</script>

<template>
  <div class="flex flex-col items-center px-4 sm:px-6 lg:px-10 py-2 -mt-10">
    <!-- Page Title -->
    <div class="text-center mb-6">
      <p 
        class="text-lg lg:text-xl"
        :style="{ color: textColor}"
      >
        {{ currentBook?.title }}
      </p>
    </div>

    <!-- PDF Viewer - centered with fixed width -->
    <div 
      class="mb-4"
      :style="{ width: `${pdfContainerWidth}px` }"
    >
      <VuePDF ref="vuePDFRef" :pdf="pdf" :page="page" fit-parent />
    </div>

    <!-- Navigation Controls -->
    <div class="flex justify-center items-center gap-24">
        <button 
        @click="page = page > 1 ? page - 1 : page"
        class="flex items-center gap-2 disabled:opacity-30 hover:opacity-70 transition-all"
        :disabled="page <= 1"
        :style="{ color: textColor }"
      >
        <div class="flex items-center">
            <span
            class="w-3 h-3 -rotate-90"
            :style="{
                backgroundColor: textColor,
                WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
                mask: 'url(/icons/down.svg) center / contain no-repeat'
            }"
            aria-hidden="true"
            />
            <span
            class="w-3 h-3 -rotate-90"
            :style="{
                backgroundColor: textColor,
                WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
                mask: 'url(/icons/down.svg) center / contain no-repeat'
            }"
            aria-hidden="true"
            />
        </div>
        <span>الصفحة السابقة</span>
      </button>

      <span class="flex items-center px-4" :style="{ color: textColor }">
        {{ page }} / {{ pages }}
      </span>

      <button 
        @click="page = page < pages ? page + 1 : page"
        class="flex items-center gap-2 disabled:opacity-30 hover:opacity-70 transition-all"
        :disabled="page >= pages"
        :style="{ color: textColor }"
      >
      <span>الصفحة التالية</span>
      <div class="flex items-center">
        <span
        class="w-3 h-3 rotate-90"
        :style="{
            backgroundColor: textColor,
            WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
            mask: 'url(/icons/down.svg) center / contain no-repeat'
        }"
        aria-hidden="true"
        />
        <span
            class="w-3 h-3 rotate-90"
            :style="{
                backgroundColor: textColor,
                WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
                mask: 'url(/icons/down.svg) center / contain no-repeat'
            }"
            aria-hidden="true"
            />
        </div>
      </button>
    </div>
  </div>
</template>
