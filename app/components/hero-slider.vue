<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

interface Slide {
  id: number;
  text_1: string;
  text_2: string;
  text_3: string;
  image: string;
}

const slides = computed<Slide[]>(() => [
  {
    id: 1,
    text_1: "استكشف شجرة",
    text_2: " عائـــلـــة القـــــواســم",
    text_3: "وتــعرف عــــلى تــاريــــخها الحــــــافل بالإنجــــــازات",
    image: isDark.value ? "/images/image-1.jpg" : "/images/image-1.png"
  },
  {
    id: 2,
    text_1: "الموقع قـــائـــم",
    text_2: "علي مؤلفات صاحب السمو",
    text_3: "الشيخ الدكتور / سلــطان بن محــــمـــد القــاســـــمي",
    image: "/images/image-2.png"
  }
]);

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};
</script>

<template>
  <div class="relative w-full overflow-visible pt-10 lg:pt-0 px-10 lg:px-8 -mt-10">
    <div class="w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <!-- Left Content -->
        <div class="relative flex flex-col justify-center space-y-2 order-1 lg:order-2">
          <!-- Counter and Previous Arrow on same row -->
          <div class="flex items-center justify-between">
            <!-- Previous Arrow -->
            <button
              @click="prevSlide"
              class="mr-24 mb-4 lg:mb-0 lg:mr-0 w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105"
              :style="{ 
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }"
              aria-label="Previous slide"
            >
              <svg 
                class="w-4 h-4 2xl:w-5 2xl:h-5 rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                stroke-width="3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Counter -->
            <div class="flex items-center gap-2" dir="ltr">
              <span 
                class="text-4xl lg:text-6xl 2xl:text-7xl font-bold underline underline-offset-1 leading-none"
                :style="{ color: primaryColor }"
              >
                {{ String(slides[currentSlide]?.id || 1).padStart(2, '0') }}
              </span>
              <span 
                class="text-xl lg:text-2xl 2xl:text-3xl font-bold underline underline-offset-1 leading-none"
                :style="{ color: textColor, opacity: 0.5 }"
              >
                / {{ String(slides.length).padStart(2, '0') }}
              </span>
            </div>
          </div>

          <!-- Next Arrow (positioned to the right) -->
          <button
            @click="nextSlide"
            class="absolute lg:-right-25 -top-4 lg:top-1/5 w-18 h-18 2xl:w-20 2xl:h-20 rounded-full flex items-center justify-center transition-all hover:scale-105 border-4"
            :style="{ 
              backgroundColor: 'rgba(217, 178, 122, 0.2)',
              borderColor: primaryColor,
              color: 'white'
            }"
            aria-label="Next slide"
          >
            <svg 
              class="w-6 h-6 2xl:w-7 2xl:h-7" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Text Content with Transition -->
          <div class="relative min-h-[375px] md:min-h-[200px] lg:min-h-[250px] mt-6">
            <TransitionGroup name="slide">
              <div
                v-for="(slide, index) in slides"
                v-show="index === currentSlide"
                :key="`text-${slide.id}`"
                class="absolute inset-0 text-center space-y-4"
              >
                <!-- Title -->
                <h2 
                  class="text-lg mt-2"
                  :style="{ color: textColor }"
                >
                  {{ slide.text_1 }}
                </h2>

                <!-- Content -->
                <p 
                  class="text-4xl leading-relaxed"
                  :style="{ color: textColor, opacity: 0.9 }"
                >
                  {{ slide.text_2 }}
                </p>
                <p 
                  class="text-lg leading-relaxed"
                  :style="{ color: textColor, opacity: 0.9 }"
                >
                  {{ slide.text_3 }}
                </p>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- Right Image with Transition -->
        <div class="relative flex w-full lg:w-[115%] justify-center items-center md:py-2 lg:justify-start lg:items-start order-2 lg:order-1 lg:-mr-20">
          <TransitionGroup name="slide">
            <img
              v-for="(slide, index) in slides"
              v-show="index === currentSlide"
              :key="`img-${slide.id}`"
              :src="slide.image"
              :alt="slide.text_1"
              class="w-full lg:w-[90%] absolute inset-0"
              loading="lazy"
            />
          </TransitionGroup>
          <!-- Spacer to maintain aspect ratio -->
          <img
            :src="slides[currentSlide]?.image || ''"
            :alt="slides[currentSlide]?.text_1 || ''"
            class="w-full lg:w-[115%] invisible"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>

