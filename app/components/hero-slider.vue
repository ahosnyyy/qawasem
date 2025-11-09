<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));
const primaryColor = computed(() => isDark.value ? (appConfig.theme?.colors?.primary?.dark || "#D9B27A") : (appConfig.theme?.colors?.primary?.light || "#D9B27A"));

interface Slide {
  id: number;
  title: string;
  content: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "من هم القواسم",
    content: "القواسم هم ذرية قاسم الكبير بن هاشم بن محمد بن قاسم بن راشد بن عطية بن سليمان بن إسحاق بن بشر بن قاسم بن حمود بن حسين بن محمد بن عبد الله بن إبراهيم بن يحيى بن شريف بن بشير بن ماجد بن عطية بن يعلي بن دويد بن ماجد بن عبد الرحمن بن القاسم بن إدريس بن جعفر الزكي بن علي الهادي بن محمد الجواد بن علي الرضا بن موسى الكاظم بن جعفر الصادق بن محمد الباقر بن علي زين العابدين بن الحسين بن علي بن أبي طالب. نسب آخر ويقال بأنهم يرجعون إلى محمد بن الحسن بن إدريس بن القاسم بن محمد الثائر بن موسى الثاني بن عبد الله الشيخ الصالح بن موسى الجون بن عبد الله الكامل بن الحسن المثنى بن الحسن بن علي بن أبي طالب",
    image: "/images/image-1.png"
  },
  {
    id: 2,
    title: "تاريخ القواسم",
    content: "من المعروف والمتوارث لديهم أن أجدادهم قدموا قبل مئات السنين إلى الخليج من العراق من مدينة سامراء، وسامراء شمال بغداد 90 ٪ من سكانها من الأشراف الحسنية والحسينية، وقد نقل الكاتب حسين الحسيني الزرباطي في كتابه دوحة السلطان في النسب والنسب القاسمي عن الشيخ الدكتور سلطان بن محمد القاسمي ما نصه: «أن قبيلة القواسم كانت تتولى حكومة البصرة في زمن المشعشعين» وللسادة القواسم وجودهم في سامراء منذ القدم فقد نزح جدهم السيد عبد الله الكبير من سامراء عام 1623 م بعد استيلاء الصفويين على مدينة بغداد وأعقب خمسة رجال هم كايد وكاسب وكايل وكامل وكنعان وتكونت لكل واحد من هؤلاء ذرية وعشير.",
    image: "/images/image-2.png"
  },
  {
    id: 3,
    title: "أصل القواسم",
    content: "أصول القواسم وتاريخ مجيئهم إلى جلفار. فالمؤرخ البريطاني كيلي يعتقد أن القواسم كانوا يؤلفون فرعاً من بني غافر الذين هاجروا من نجد الواقعة وسط شبه الجزيرة العربية إلى عُمان في القرن السابع عشر تقريباً. وبالمقابل، فإن المؤرخ المصري سيد نوفل، يقول بأنهم قبائل عربية يعود أصلها إلى عبس من غطفان من عدنان اسمها الآن الرشايدة وكان مسكنها الأول سامراء في العراق. وهاجروا إلى جلفار في حوالي النصف الأول من القرن الثامن عشر ولكن إذا كان من الصعب تأكيد أحد الرأيين، فمن الممكن التدقيق في تاريخ الوصول. وهذا الأمر لا يخلو من الأهمية، لتعليقه بتحديد بداية ظهور القواسم وبروز دورهم في المنطقة.",
    image: "/images/image-3.png"
  }
];

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};
</script>

<template>
  <div class="relative w-full overflow-visible px-10 pt-10 lg:pt-0 xl:pt-0 pb-16 lg:pl-12">
    <div class="w-full">
      <!-- Slide Content -->
      <TransitionGroup name="slide">
        <div
          v-for="(slide, index) in slides"
          v-show="index === currentSlide"
          :key="slide.id"
          class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center xl:items-start"
        >
          <!-- Left Content -->
          <div class="relative flex flex-col justify-center xl:justify-start space-y-2 order-1 lg:order-2 xl:mt-30">
            <!-- Counter and Previous Arrow on same row -->
            <div class="flex items-center justify-between">
              <!-- Previous Arrow -->
              <button
                @click="prevSlide"
                class="mr-24 lg:mr-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105"
                :style="{ 
                  borderColor: 'white',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }"
                aria-label="Previous slide"
              >
                <svg 
                  class="w-4 h-4 rotate-180" 
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
                  class="text-4xl lg:text-6xl font-bold underline underline-offset-1 leading-none"
                  :style="{ color: primaryColor }"
                >
                  {{ String(slide.id).padStart(2, '0') }}
                </span>
                <span 
                  class="text-xl lg:text-2xl font-bold underline underline-offset-1 leading-none"
                  :style="{ color: textColor, opacity: 0.5 }"
                >
                  / {{ String(slides.length).padStart(2, '0') }}
                </span>
              </div>
            </div>

            <!-- Next Arrow (positioned to the right) -->
            <button
              @click="nextSlide"
              class="absolute lg:-right-25 -top-4 lg:top-1/4 w-18 h-18 rounded-full flex items-center justify-center transition-all hover:scale-105 border-4"
              :style="{ 
                backgroundColor: 'rgba(217, 178, 122, 0.2)',
                borderColor: primaryColor,
                color: 'white'
              }"
              aria-label="Next slide"
            >
              <svg 
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                stroke-width="4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Title -->
            <h2 
              class="text-3xl mt-2 mb-6"
              :style="{ color: textColor }"
            >
              {{ slide.title }}
            </h2>

            <!-- Content -->
            <p 
              class="text-md leading-relaxed text-justify"
              :style="{ color: textColor, opacity: 0.9 }"
            >
              {{ slide.content }}
            </p>
          </div>

          <!-- Right Image -->
          <div class="flex items-start justify-center lg:justify-start order-2 lg:order-1 -mt-10 lg:-mr-10">
            <img
              :src="slide.image"
              :alt="slide.title"
              class="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </TransitionGroup>
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

