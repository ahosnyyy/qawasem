<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";

definePageMeta({
  ssr: false,
});

const VuePDF = defineAsyncComponent(() =>
  import("@tato30/vue-pdf").then(m => m.VuePDF),
);

const route = useRoute();
const router = useRouter();

// Get book ID from route
const bookId = route.params.book as string;

// Book data
const booksData: Record<string, { title: string; pdfUrl: string }> = {
  1: {
    title: "القول الحاسم في نسب القواسم",
    pdfUrl: "/books/1.pdf",
  },
  2: {
    title: "التذكرة بالأرحام",
    pdfUrl: "/books/2.pdf",
  },
};

// Check if book exists
const currentBook = booksData[bookId];
if (!currentBook) {
  router.push("/books");
}

const initialPageFromQuery = Number(route.query.page);
const page = ref(!Number.isNaN(initialPageFromQuery) && initialPageFromQuery > 0 ? initialPageFromQuery : 1);
const pdf = shallowRef<unknown>(null);
const pages = ref(0);

const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

const vuePDFRef = ref(null);
const pdfContainerWidth = ref(600);
const showShareModal = ref(false);
const shareUrl = ref("");
const includeCurrentPage = ref(false);
const copied = ref(false);
const encodedShareUrl = computed(() => encodeURIComponent(shareUrl.value || ""));

// Keyboard navigation handler (RTL: Right = Previous, Left = Next)
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "ArrowRight") {
    // Previous page (RTL)
    if (page.value > 1) {
      page.value--;
    }
  }
  else if (event.key === "ArrowLeft") {
    // Next page (RTL)
    if (page.value < pages.value) {
      page.value++;
    }
  }
}

onMounted(async () => {
  // Calculate available height for PDF (viewport - title - navigation - padding)
  pdfContainerWidth.value = window.innerWidth * 0.55;

  // Add keyboard event listener
  window.addEventListener("keydown", handleKeyPress);

  // Dynamically load PDF library client-side only
  const { usePDF } = await import("@tato30/vue-pdf");
  const pdfResult = usePDF(currentBook?.pdfUrl || "/books/1.pdf");

  watch(
    () => pdfResult.pdf.value,
    (newPdf) => {
      pdf.value = newPdf;
    },
    { immediate: true },
  );

  watch(
    () => pdfResult.pages.value,
    (newPages) => {
      pages.value = newPages;
    },
    { immediate: true },
  );
});

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener("keydown", handleKeyPress);
});

watch(pages, (totalPages) => {
  if (typeof totalPages === "number" && totalPages > 0 && page.value > totalPages) {
    page.value = totalPages;
  }
});

function buildShareUrl(withPage: boolean) {
  const basePath = route.path || `/books/${bookId}`;
  if (import.meta.client && typeof window !== "undefined") {
    const url = new URL(basePath, window.location.origin);
    if (withPage) {
      url.searchParams.set("page", String(page.value));
    }
    else {
      url.search = "";
    }
    return url.toString();
  }
  return withPage ? `${basePath}?page=${page.value}` : basePath;
}

function openShareModal() {
  includeCurrentPage.value = false;
  copied.value = false;
  shareUrl.value = buildShareUrl(false);
  showShareModal.value = true;
}

function closeShareModal() {
  showShareModal.value = false;
}

async function copyToClipboard() {
  if (!shareUrl.value) {
    return;
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl.value);
    }
    else {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl.value;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
  catch (error) {
    console.error("Clipboard copy failed", error);
  }
}

watch([includeCurrentPage, page], () => {
  if (showShareModal.value) {
    shareUrl.value = buildShareUrl(includeCurrentPage.value);
  }
});
</script>

<template>
  <div class="flex flex-col items-center px-4 sm:px-6 lg:px-10 py-2 -mt-10">
    <!-- Page Title -->
    <div class="text-center mb-6">
      <p
        class="text-lg lg:text-xl"
        :style="{ color: textColor }"
      >
        {{ currentBook?.title }}
      </p>
    </div>

    <!-- PDF Viewer - centered with fixed width -->
    <div
      class="mb-4"
      :style="{ width: `${pdfContainerWidth}px` }"
    >
      <ClientOnly>
        <VuePDF
          v-if="pdf"
          ref="vuePDFRef"
          :pdf="pdf"
          :page="page"
          fit-parent
        />
        <div v-else class="flex items-center justify-center h-96">
          <span :style="{ color: textColor }">جاري التحميل...</span>
        </div>
      </ClientOnly>
    </div>

    <!-- Navigation Controls -->
    <div class="flex justify-center items-center gap-24">
      <button
        class="flex items-center gap-2 disabled:opacity-30 hover:opacity-70 transition-all"
        :disabled="page <= 1"
        :style="{ color: textColor }"
        @click="page = page > 1 ? page - 1 : page"
      >
        <div class="flex items-center">
          <span
            class="w-3 h-3 -rotate-90"
            :style="{
              backgroundColor: textColor,
              WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
              mask: 'url(/icons/down.svg) center / contain no-repeat',
            }"
            aria-hidden="true"
          />
          <span
            class="w-3 h-3 -rotate-90"
            :style="{
              backgroundColor: textColor,
              WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
              mask: 'url(/icons/down.svg) center / contain no-repeat',
            }"
            aria-hidden="true"
          />
        </div>
        <span>الصفحة السابقة</span>
      </button>

      <div class="flex items-center gap-3">
        <span
          class="px-4 py-1 rounded-full"
          :style="{
            color: textColor,
            background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.2) 0%, rgba(139, 114, 78, 0.2) 100%)',
          }"
        >
          {{ page }} / {{ pages }}
        </span>
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          :style="{
            background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.2) 0%, rgba(139, 114, 78, 0.2) 100%)',
          }"
          title="مشاركة"
          @click="openShareModal"
        >
          <UIcon
            name="i-lucide-share-2"
            class="w-4 h-4"
            :style="{ color: textColor }"
          />
        </button>
      </div>

      <button
        class="flex items-center gap-2 disabled:opacity-30 hover:opacity-70 transition-all"
        :disabled="page >= pages"
        :style="{ color: textColor }"
        @click="page = page < pages ? page + 1 : page"
      >
        <span>الصفحة التالية</span>
        <div class="flex items-center">
          <span
            class="w-3 h-3 rotate-90"
            :style="{
              backgroundColor: textColor,
              WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
              mask: 'url(/icons/down.svg) center / contain no-repeat',
            }"
            aria-hidden="true"
          />
          <span
            class="w-3 h-3 rotate-90"
            :style="{
              backgroundColor: textColor,
              WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
              mask: 'url(/icons/down.svg) center / contain no-repeat',
            }"
            aria-hidden="true"
          />
        </div>
      </button>
    </div>

    <UModal v-model:open="showShareModal">
      <template #content>
        <div class="p-6 text-center relative">
          <button
            class="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            @click="closeShareModal"
          >
            <UIcon
              name="i-lucide-x"
              class="w-5 h-5"
              :style="{ color: textColor }"
            />
          </button>

          <h3 class="text-lg font-semibold mb-4" :style="{ color: textColor }">
            مشاركة الرابط
          </h3>

          <label class="flex items-center justify-start gap-2 mb-4 cursor-pointer select-none" :style="{ color: textColor }">
            <input
              v-model="includeCurrentPage"
              type="checkbox"
              class="w-4 h-4"
              :style="{ accentColor: primaryColor }"
            >
            <span>مشاركة مع الصفحة الحالية ({{ page }})</span>
          </label>

          <div class="flex items-center gap-2 p-3 rounded-xl mb-4" style="border: 1px solid rgba(217, 178, 122, 0.3);">
            <button
              class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              :style="{
                background: copied
                  ? 'linear-gradient(180deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.3) 100%)'
                  : 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
              }"
              @click="copyToClipboard"
            >
              <UIcon
                :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                class="w-5 h-5"
                :style="{ color: copied ? '#22c55e' : textColor }"
              />
            </button>
            <input
              type="text"
              readonly
              :value="shareUrl"
              class="flex-1 bg-transparent text-sm outline-none text-left"
              style="direction: ltr;"
              :style="{ color: textColor }"
            >
          </div>

          <div class="flex items-center justify-center gap-4 mt-6">
            <a
              :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style="background: linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%);"
            >
              <UIcon
                name="i-lucide-facebook"
                class="w-5 h-5"
                :style="{ color: textColor }"
              />
            </a>
            <a
              :href="`https://x.com/intent/tweet?url=${encodedShareUrl}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style="background: linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%);"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" :fill="textColor" />
              </svg>
            </a>
            <a
              :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style="background: linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%);"
            >
              <UIcon
                name="i-lucide-linkedin"
                class="w-5 h-5"
                :style="{ color: textColor }"
              />
            </a>
            <a
              :href="`mailto:?subject=شارك هذا الكتاب&body=${encodedShareUrl}`"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style="background: linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%);"
            >
              <UIcon
                name="i-lucide-mail"
                class="w-5 h-5"
                :style="{ color: textColor }"
              />
            </a>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
