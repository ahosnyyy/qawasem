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
    readUrl: "https://share.google/5ZDNx3pBfGgJTVmTP",
  },
  {
    id: 2,
    title: "التذكرة بالأرحام",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-2.png",
    downloadUrl: "/books/2.pdf",
    readUrl: "https://share.google/3fyHXPus9YTy2lwcP",
  },
  {
    id: 3,
    title: "القواسم في عمان",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-3.png",
    downloadUrl: "/books/3.pdf",
    readUrl: "https://share.google/USc4rCuvIveQbz1c1",
  },
  {
    id: 4,
    title: "تاريخ القواسم",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-4.png",
    downloadUrl: "/books/4.pdf",
    readUrl: "https://share.google/ob6IDks3amQq21OoN",
  },
];

function handleRead(book: Book) {
  const targetUrl = book.readUrl;

  if (import.meta.client && typeof window !== "undefined") {
    if (/^https?:\/\//i.test(targetUrl)) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    navigateTo(targetUrl);
    return;
  }

  if (/^https?:\/\//i.test(targetUrl)) {
    navigateTo(targetUrl, { external: true });
    return;
  }

  navigateTo(targetUrl);
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

function _handleShare(book: Book) {
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
        والخاصة  بنسب وتاريخ القواسم
      </p>
    </div>

    <!-- Books Grid -->
    <div class="w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-10">
      <div
        v-for="(book, index) in books"
        :key="book.id"
        class="flex flex-col items-center animate-fade-in-scale"
        :style="{ animationDelay: `${index * 0.15}s` }"
      >
        <!-- Book Title and Author -->
        <div class="text-center mb-2">
          <h3
            class="text-lg mb-1"
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
          class="w-[80%] aspect-[3/4] mb-4 flex items-center justify-center overflow-hidden transition-smooth img-hover-lift cursor-pointer"
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
          <!--
          <div class="flex flex-col items-center gap-2">
            <button
              class="w-14 h-14 rounded-full flex items-center justify-center transition-smooth btn-hover-glow border-1 hover:scale-105"
              :style="{
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor,
              }"
              aria-label="مشاركة الرابط"
              @click="_handleShare(book)"
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
          -->

          <!-- Read Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              class="w-14 h-14 rounded-full flex items-center justify-center transition-smooth btn-hover-glow border-1 hover:scale-105"
              :style="{
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor,
              }"
              aria-label=" تصفح الكتاب"
              @click="handleRead(book)"
            >
              <svg
                class="w-7 h-7"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :style="{ color: textColor }"
              >
                <g :clip-path="`url(#clip0_${book.id})`">
                  <path
                    d="M25 7.32422V23.5352H17.5503C15.5032 23.5352 14.4266 24.9232 14.3169 25H10.6831C10.5719 24.9222 9.51064 23.5352 7.44971 23.5352H0V5.85938H1.46484V22.0703H7.45605C9.74521 22.0703 11.0194 23.3619 11.3369 23.5352H13.6631C13.9804 23.3619 15.255 22.0703 17.5439 22.0703H23.5352V7.32422H25Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.2993 21.1899C9.40967 20.8052 8.44727 20.6055 7.45605 20.6055H2.92969V2.92969H4.39453V17.6758H6.5918C8.58789 17.6758 10.2207 19.2388 10.2993 21.1899Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.5441 4.39453C15.9927 4.39453 14.4984 4.80098 13.1812 5.57817C13.2152 5.91089 13.2326 6.24922 13.2326 6.5918V22.0396C13.3307 21.9685 13.4429 21.8896 13.5707 21.8057C15.8322 20.2974 17.3904 20.6055 22.0705 20.6055V4.39453H17.5441Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11.7676 21.3379C11.7676 18.5109 9.44575 16.2109 6.5918 16.2109H5.85938V0C9.52104 0 11.7676 2.95708 11.7676 6.5918V21.3379Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath :id="`clip0_${book.id}`">
                    <rect width="25" height="25" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
            <span
              class="text-sm font-medium"
              :style="{ color: textColor }"
            >
              تصفح الكتاب
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
