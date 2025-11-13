<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

interface Book {
  id: number;
  title: string;
  author?: string;
  image: string;
  downloadUrl: string;
  readUrl: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "القول الحاسم في نسب القواسم",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-1.svg",
    downloadUrl: "/books/1.pdf",
    readUrl: "/books/1"
  },
  {
    id: 2,
    title: "التذكرة بالأرحام",
    author: "للدكتور/سلطان بن محمد القاسمي",
    image: "/books/book-2.svg",
    downloadUrl: "/books/2.pdf",
    readUrl: "/books/2"
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

const handleDownload = (book: Book) => {
  window.open(book.downloadUrl, '_blank');
};

const handleRead = (book: Book) => {
  navigateTo(book.readUrl);
};
</script>

<template>
  <div class="relative w-full overflow-visible px-4 sm:px-6 lg:px-10 pb-16">
    <!-- Page Title -->
    <div class="text-center mb-12">
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
        v-for="book in books"
        :key="book.id"
        class="flex flex-col items-center"
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
        <div class="w-[50%] aspect-[3/4] mb-4 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img
            :src="book.image"
            :alt="book.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 lg:gap-10 w-full">
          <!-- Download Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              @click="handleDownload(book)"
              class="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 border-1"
              :style="{ 
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor
              }"
              aria-label="تحميل الكتاب"
            >
              <svg 
                class="w-6 h-6" 
                viewBox="0 0 30 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M21.3328 11.087H18.9132V3.47828C18.9132 2.64133 18.2284 1.95654 17.3915 1.95654H11.3045C10.4675 1.95654 9.78276 2.64133 9.78276 3.47828V11.087H7.36319C6.00884 11.087 5.32406 12.7305 6.28276 13.6892L13.2675 20.6739C13.861 21.2674 14.8197 21.2674 15.4132 20.6739L22.398 13.6892C23.3567 12.7305 22.6871 11.087 21.3328 11.087ZM3.6958 26.3044C3.6958 27.1413 4.38058 27.8261 5.21754 27.8261H23.4784C24.3154 27.8261 25.0001 27.1413 25.0001 26.3044C25.0001 25.4674 24.3154 24.7826 23.4784 24.7826H5.21754C4.38058 24.7826 3.6958 25.4674 3.6958 26.3044Z" 
                  :fill="textColor"
                />
              </svg>
            </button>
            <span 
              class="text-sm"
              :style="{ color: textColor }"
            >
              تحميل الكتاب
            </span>
          </div>

          <!-- Read Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              @click="handleRead(book)"
              class="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 border-1"
              :style="{ 
                background: 'linear-gradient(180deg, rgba(217, 178, 122, 0.23) 0%, rgba(139, 114, 78, 0.23) 100%)',
                borderColor: primaryColor
              }"
              aria-label=" قراءة الكتاب"
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
  </div>
</template>

<style scoped>
/* Add smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.95);
}
</style>
