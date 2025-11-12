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
            <svg class="w-10 h-10 transform scale-x-[-1]" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1351 0C6.81081 0 0 6.81081 0 15.1351C0 23.4595 6.81081 30.2703 15.1351 30.2703C23.4595 30.2703 30.2703 23.4595 30.2703 15.1351C30.2703 6.81081 23.4595 0 15.1351 0ZM24.4527 15.7973L17.9257 22.3716C17.5473 22.75 16.9797 22.75 16.6014 22.3716C16.223 21.9932 16.223 21.4257 16.6014 21.0473L21.5203 16.0811H6.47973C5.95946 16.0811 5.53378 15.6554 5.53378 15.1351C5.53378 14.6149 5.95946 14.1892 6.47973 14.1892H21.5203L16.5541 9.27027C16.1757 8.89189 16.1757 8.32432 16.5541 7.94595C16.9324 7.56757 17.5 7.56757 17.8784 7.94595L24.4054 14.473C24.8311 14.8513 24.8311 15.4189 24.4527 15.7973Z" :fill="textColor" fill-opacity="0.6"/>
            </svg>
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
            <svg class="w-10 h-10" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1351 0C6.81081 0 0 6.81081 0 15.1351C0 23.4595 6.81081 30.2703 15.1351 30.2703C23.4595 30.2703 30.2703 23.4595 30.2703 15.1351C30.2703 6.81081 23.4595 0 15.1351 0ZM24.4527 15.7973L17.9257 22.3716C17.5473 22.75 16.9797 22.75 16.6014 22.3716C16.223 21.9932 16.223 21.4257 16.6014 21.0473L21.5203 16.0811H6.47973C5.95946 16.0811 5.53378 15.6554 5.53378 15.1351C5.53378 14.6149 5.95946 14.1892 6.47973 14.1892H21.5203L16.5541 9.27027C16.1757 8.89189 16.1757 8.32432 16.5541 7.94595C16.9324 7.56757 17.5 7.56757 17.8784 7.94595L24.4054 14.473C24.8311 14.8513 24.8311 15.4189 24.4527 15.7973Z" :fill="textColor" fill-opacity="0.6"/>
            </svg>
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
              <svg class="w-16 h-16" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.7286 33.6162L44.7231 33.593H38.7548L34.1348 40.3799V49.8378H54.0856V42.1421C54.0967 39.9066 53.2252 37.7571 51.6603 36.1607C50.0955 34.5642 47.9638 33.6498 45.7286 33.6162Z" :fill="textColor" fill-opacity="0.8"/>
                <path d="M11.3679 49.8378H31.3162V39.5124L35.3419 33.6021L19.7223 33.6162C17.4871 33.6498 15.3554 34.5642 13.7906 36.1607C12.2258 37.7571 11.3542 39.9066 11.3653 42.1421L11.3679 49.8378Z" :fill="textColor" fill-opacity="0.8"/>
                <path d="M56.3527 33.4448H52.8516C53.9907 34.4037 54.9277 35.5797 55.608 36.9042C56.2883 38.2287 56.6983 39.6753 56.8141 41.1598C57.8097 41.0623 58.7287 40.5829 59.3782 39.8222C60.0278 39.0614 60.3572 38.0786 60.2975 37.0801C60.2378 36.0816 59.7935 35.1451 59.0579 34.4672C58.3223 33.7894 57.3527 33.4229 56.3527 33.4448Z" :fill="textColor" fill-opacity="0.8"/>
                <path d="M12.6003 33.4447H9.64701C8.69984 33.4321 7.78101 33.7676 7.0648 34.3875C6.34859 35.0075 5.88482 35.8687 5.76146 36.8079C5.6381 37.7471 5.86373 38.6989 6.39556 39.4827C6.92739 40.2666 7.72842 40.828 8.6467 41.0605C8.90452 38.0986 10.3263 35.3599 12.6003 33.4447Z" :fill="textColor" fill-opacity="0.8"/>
                <path d="M23.6218 30.775C25.0669 30.775 26.4795 30.3465 27.6811 29.5437C28.8826 28.7409 29.8191 27.5998 30.3721 26.2647C30.9251 24.9296 31.0698 23.4605 30.7879 22.0432C30.5059 20.6259 29.8101 19.3241 28.7882 18.3022C27.7664 17.2804 26.4646 16.5845 25.0472 16.3026C23.6299 16.0207 22.1609 16.1654 20.8258 16.7184C19.4907 17.2714 18.3496 18.2079 17.5468 19.4094C16.7439 20.611 16.3154 22.0236 16.3154 23.4686C16.3182 25.4056 17.0888 27.2624 18.4584 28.632C19.8281 30.0017 21.6849 30.7723 23.6218 30.775Z" :fill="textColor" fill-opacity="0.8"/>
                <path d="M41.8286 30.775C43.2737 30.7753 44.6864 30.347 45.8881 29.5443C47.0898 28.7416 48.0265 27.6006 48.5797 26.2656C49.1329 24.9305 49.2778 23.4614 48.996 22.044C48.7142 20.6266 48.0185 19.3246 46.9967 18.3027C45.9749 17.2807 44.6731 16.5847 43.2557 16.3027C41.8384 16.0207 40.3692 16.1653 39.0341 16.7183C37.699 17.2712 36.5578 18.2077 35.7549 19.4093C34.952 20.6108 34.5234 22.0235 34.5234 23.4686C34.5255 25.4056 35.2957 27.2626 36.6652 28.6323C38.0347 30.0021 39.8916 30.7727 41.8286 30.775Z" :fill="textColor" fill-opacity="0.8"/>
              </svg>
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
