<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

type Book = {
  id: number;
  title: string;
  author?: string;
  image: string;
  downloadUrl: string;
  readUrl: string;
};

const books: Book[] = [
  {
    id: 1,
    title: "القول الحاسم في نسب القواسم",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-1.png",
    downloadUrl: "/books/1.pdf",
    readUrl: "/books/1",
  },
  {
    id: 2,
    title: "التذكرة بالأرحام",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-2.png",
    downloadUrl: "/books/2.pdf",
    readUrl: "/books/2",
  },
  /*
  {
    id: 3,
    title: "تاريخ القواسم",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-3.svg",
    downloadUrl: "/books/book-3.pdf",
    readUrl: "/books/3"
  },
  {
    id: 4,
    title: "القواسم في عمان",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-4.svg",
    downloadUrl: "/books/book-4.pdf",
    readUrl: "/books/4"
  }
  */
];

function handleRead(book: Book) {
  navigateTo(book.readUrl);
}

const showShareModal = ref(false);
const shareUrl = ref("");
const copied = ref(false);
const encodedShareUrl = computed(() => encodeURIComponent(shareUrl.value || ""));

function buildShareUrl(book: Book) {
  if (import.meta.client && typeof window !== "undefined") {
    return new URL(book.readUrl, window.location.origin).toString();
  }
  return book.readUrl;
}

function handleShare(book: Book) {
  shareUrl.value = buildShareUrl(book);
  copied.value = false;
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
</script>

<template>
  <div class="relative w-full overflow-visible px-4 sm:px-6 lg:px-10 pb-16 animate-fade-in">
    <!-- Page Title -->
    <div class="text-center mb-12 animate-fade-in-down">
      <p
        class="text-lg lg:text-xl"
        :style="{ color: textColor, opacity: 0.8 }"
      >
        مؤلفات صاحب السمو
      </p>
      <p
        class="text-lg lg:text-xl font-bold py-1"
        :style="{ color: textColor, opacity: 0.8 }"
      >
        الشيخ الدكتور /  سلطان بن محمد القاسمي
      </p>
      <p
        class="text-base lg:text-lg"
        :style="{ color: textColor, opacity: 0.8 }"
      >
        الخاصة  بنسب وتاريخ القواسم
      </p>
    </div>

    <!-- Books Grid -->
    <div class="w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-8 xl:gap-10">
      <div
        v-for="(book, index) in books"
        :key="book.id"
        class="flex flex-col items-center animate-fade-in-scale"
        :style="{ animationDelay: `${index * 0.15}s` }"
      >
        <!-- Book Title and Author -->
        <div class="text-center mb-2">
          <h3
            class="text-lg lg:text-xl mb-1"
            :style="{ color: textColor }"
          >
            {{ book.title }}
          </h3>
          <p
            v-if="book.author"
            class="text-sm lg:text-base"
            :style="{ color: textColor, opacity: 0.7 }"
          >
            {{ book.author }}
          </p>
        </div>

        <!-- Book Image -->
        <div
          class="w-[50%] aspect-[3/4] mb-4 flex items-center justify-center overflow-hidden transition-smooth img-hover-lift cursor-pointer"
          @click="handleRead(book)"
        >
          <img
            :src="book.image"
            :alt="book.title"
            class="w-full h-full object-cover"
            loading="lazy"
          >
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 lg:gap-10 w-full">
          <!-- Share Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              class="w-14 h-14 rounded-full flex items-center justify-center transition-smooth btn-hover-glow border-1 hover:scale-105"
              :style="{
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor,
              }"
              aria-label="مشاركة الرابط"
              @click="handleShare(book)"
            >
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.19071C7.54305 8.46738 6.6582 8 5.66667 8C4.00001 8 2.66667 9.33333 2.66667 11C2.66667 12.6667 4.00001 14 5.66667 14C6.6582 14 7.54305 13.5326 8.08261 12.8093L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0085 14 16.1236 14.4674 15.5841 15.1907L8.64398 11.3706C8.65895 11.2492 8.66667 11.1255 8.66667 11C8.66667 10.8745 8.65895 10.7508 8.64398 10.6294L15.5841 6.80929C16.1236 7.53262 17.0085 8 18 8Z"
                  :fill="textColor"
                />
              </svg>
            </button>
            <span
              class="text-sm"
              :style="{ color: textColor }"
            >
              مشاركة الرابط
            </span>
          </div>

          <!-- Read Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              class="w-14 h-14 rounded-full flex items-center justify-center transition-smooth btn-hover-glow border-1 hover:scale-105"
              :style="{
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor,
              }"
              aria-label=" قراءة الكتاب"
              @click="handleRead(book)"
            >
              <svg
                class="w-7 h-7"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.9609 12.9556C22.9292 10.9872 22.9292 7.79597 20.9609 5.82765C18.9926 3.85933 15.8013 3.85933 13.833 5.82765C11.8647 7.79596 11.8647 10.9872 13.833 12.9556C15.8013 14.9239 18.9926 14.9239 20.9609 12.9556Z"
                  :fill="textColor"
                />
                <path
                  d="M17.108 25.2647V30.4496C16.6229 30.0398 15.7996 29.4005 14.7103 28.7614C13.6646 28.1476 12.5907 27.6626 11.5186 27.3198C10.242 26.9118 8.9645 26.7055 7.71761 26.7055H7.71622L5.35156 21.0153C6.01972 21.0066 7.44287 21.0398 9.17921 21.3798C11.3765 21.8101 14.5243 22.8334 17.108 25.2647Z"
                  :fill="textColor"
                />
                <path
                  d="M29.4482 21.0158L27.0837 26.7056H27.0823C25.8354 26.7056 24.5579 26.912 23.2813 27.32C22.2093 27.6626 21.1354 28.1477 20.0896 28.7616C19.0004 29.4009 18.177 30.04 17.6919 30.4498V25.2649C20.2706 22.8385 23.4113 21.8148 25.6035 21.3835C27.344 21.0409 28.7766 21.0069 29.4482 21.0158Z"
                  :fill="textColor"
                />
                <path
                  d="M25.6356 20.7825C25.5935 20.7903 25.551 20.7985 25.5084 20.807C24.047 21.0934 22.663 21.5317 21.3942 22.1106C19.8931 22.795 18.5505 23.6789 17.3998 24.7393C16.2494 23.6789 14.9066 22.795 13.4055 22.1106C12.1367 21.5319 10.7527 21.0934 9.29127 20.807C9.24516 20.798 9.1994 20.7893 9.15381 20.7808C9.19122 17.9446 11.4816 15.8145 14.5109 15.8145H20.2787C23.3085 15.8145 25.5992 17.9454 25.6356 20.7825Z"
                  :fill="textColor"
                />
              </svg>
            </button>
            <span
              class="text-sm font-medium"
              :style="{ color: textColor }"
            >
              قراءة الكتاب
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
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

          <h3 class="text-lg font-semibold mb-6" :style="{ color: textColor }">
            مشاركة الرابط
          </h3>

          <div
            class="flex items-center gap-2 p-3 rounded-xl mb-4"
            style="border: 1px solid rgba(217, 178, 122, 0.3);"
          >
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
                v-if="!copied"
                name="i-lucide-copy"
                class="w-5 h-5"
                :style="{ color: textColor }"
              />
              <UIcon
                v-else
                name="i-lucide-check"
                class="w-5 h-5 text-green-500"
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
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  :fill="textColor"
                />
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

<style scoped>
/* Add smooth transitions */
button:active {
  transform: scale(0.95);
}
</style>
