<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();
const route = useRoute();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

// Get member ID from route params
const memberId = route.params.member;

// Family members data
interface FamilyMember {
  id: number
  name: string
  relationship: string
  avatar: string
}

const familyMembers = ref<FamilyMember[]>([
  {
    id: 1,
    name: 'أحمد بن سعود',
    relationship: 'الأخ',
    avatar: 'https://i.pravatar.cc/120?img=1'
  },
  {
    id: 2,
    name: 'فاطمة بنت سعود',
    relationship: 'الأخت',
    avatar: 'https://i.pravatar.cc/120?img=2'
  },
  {
    id: 3,
    name: 'خالد بن محمد',
    relationship: 'الابن',
    avatar: 'https://i.pravatar.cc/120?img=3'
  },
  {
    id: 4,
    name: 'نورة بنت محمد',
    relationship: 'الابنة',
    avatar: 'https://i.pravatar.cc/120?img=4'
  },
  {
    id: 5,
    name: 'عبدالله بن سعود',
    relationship: 'الأخ',
    avatar: 'https://i.pravatar.cc/120?img=5'
  },
  {
    id: 6,
    name: 'سارة بنت محمد',
    relationship: 'الابنة',
    avatar: 'https://i.pravatar.cc/120?img=6'
  },
  {
    id: 7,
    name: 'يوسف بن سعود',
    relationship: 'الأخ',
    avatar: 'https://i.pravatar.cc/120?img=7'
  },
  {
    id: 8,
    name: 'منى بنت سعود',
    relationship: 'الأخت',
    avatar: 'https://i.pravatar.cc/120?img=8'
  }
])

// Scroll functionality
const scrollContainer = ref<HTMLElement | null>(null)

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -400,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 400,
      behavior: 'smooth'
    })
  }
}

</script>

<template>
    <div class="relative flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12">
      <NuxtLink
        to="/search/ancestor"
        class="self-center mb-6 md:mb-8 lg:fixed lg:top-40 lg:left-24 lg:mb-0 bg-[#4A2E1E] hover:scale-105 text-[#F1C687] px-6 py-2 rounded-full transition-all duration-300 lg:z-[130]"
      >
        <span>البحث بين شخصين</span>
      </NuxtLink>
      <!-- Title and Search Section -->
      <div class="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4">
        <!-- Title -->
        <h1 class="text-2xl md:text-3xl text-center mb-2"
        :style="{ color: textColor }"
        >
          البحث
        </h1>
      </div>
      
      <div class="w-full mt-12 mb-8 px-4">
        <!-- Name Section -->
        <div class="mb-8 text-center">
            <p class="text-base text-xl" :style="{ color: textColor }">محمد</p>
            <p class="text-base text-xl" :style="{ color: textColor }">
              بن سعود بن سلطان القاسمي
            </p>
          </div>  
        <!-- Image Section -->
          <div class="flex justify-center mb-6">
            <img 
              src="https://i.pravatar.cc/120?img=10"
              alt="محمد"
              class="w-36 h-36 rounded-2xl object-cover border border-[rgba(241,198,135,0.17)]"
            />
          </div>

          <!-- Details Section -->
          <div class="flex flex-row items-center justify-center gap-6">
            <div class="text-center">
              <p class="text-base" :style="{ color: textColor }">
                الام :   الشيخة ناعمة بنت محمد بن صقر بن خالد القاسمي
              </p>
            </div>
            
            <!-- Vertical Separator -->
            <div class="h-6 w-px" :style="{ backgroundColor: textColor, opacity: '0.3' }"></div>
            
            <div class="text-center">
              <p class="text-base" :style="{ color: textColor }">
                الزوجة :  سوسن بنت محمد بن سلطان بن خالد القاسمي
              </p>
            </div>
          </div>

        <!-- Related Members Cards -->
        <div class="w-full max-w-5xl mx-auto pt-12 relative px-12">
          <!-- Left Arrow (flipped) -->
          <button
            @click="scrollRight"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <img 
              src="/icons/arrow.svg" 
              alt="arrow left"
              class="w-10 h-10 transform scale-x-[-1]"
            />
          </button>

          <div ref="scrollContainer" class="overflow-x-auto pb-4 scroll-smooth no-scrollbar">
            <div class="flex gap-4">
              <!-- Dynamic Cards Loop -->
              <div 
                v-for="member in familyMembers" 
                :key="member.id"
                class="flex-shrink-0"
              >
                <p class="text-center text-sm opacity-70" :style="{ color: textColor }">
                  {{ member.relationship }}
                </p>
                <div 
                  class="flex flex-col items-center gap-3 p-4 my-4 mx-2 rounded-2xl w-[180px] border transition-all hover:scale-103 cursor-pointer border-[rgba(241,198,135,0.17)]"
                  :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.15)] to-[rgba(241,198,135,0.15)]' : 'bg-gradient-to-r from-[rgba(190,158,119,0.15)] to-[rgba(241,198,135,0.15)]'"
                >
                  <img 
                    :src="member.avatar"
                    :alt="member.name"
                    class="w-30 h-30 rounded-lg object-cover"
                  />
                  <p class="text-center text-sm" :style="{ color: textColor }">
                    {{ member.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Arrow -->
          <button
            @click="scrollLeft"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <img 
              src="/icons/arrow.svg" 
              alt="arrow right"
              class="w-10 h-10"
            />
          </button>
        </div>

        <!-- Siblings Card -->
        <div 
          class="w-full max-w-4xl mx-auto mt-4 p-8 rounded-xl border border-[rgba(241,198,135,0.17)]"
          :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
        >
          <!-- Title -->
          <h2 class="text-xl text-center mb-6" :style="{ color: textColor }">
            الأخوة
          </h2>

          <!-- Single Column Content -->
          <div class="flex items-center justify-center gap-24 max-w-2xl mx-auto">
            <div class="flex-shrink-0">
              <img 
                src="/icons/family.svg" 
                alt="family icon"
                class="w-12 h-12"
              />
            </div>
            <div class="text-center">
              <p class="text-base" :style="{ color: textColor }">عزة - نجلاء - وفاء - عائشة - سوسن</p>
              <p class="text-base" :style="{ color: textColor }">الشيخ عبدالله بن محمد بن على آل ثاني</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
