<script setup lang="ts">
const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

interface User {
  label: string
  value: string
  avatar?: {
    src: string
    alt: string
  }
}

const { data: usersData, status } = await useFetch<{ id: number, name: string }[]>('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users',
  lazy: true
})

const users = computed<User[]>(() => {
  if (!usersData.value) return []
  return usersData.value.map(user => ({
    label: user.name,
    value: String(user.id),
    avatar: { 
      src: `https://i.pravatar.cc/120?img=${user.id}`,
      alt: user.name
    }
  }))
})

const searchQuery = ref('')
const showResults = computed(() => searchQuery.value.length > 0)
const selectedUser = ref<User | null>(null)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.label.toLowerCase().includes(query)
  )
})

function selectUser(user: User) {
  selectedUser.value = user
}

</script>

<template>
  <div>
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
        <h1 class="text-2xl md:text-3xl text-center mb-4"
        :style="{ color: textColor }"
        >
          البحث
        </h1>
        
        <!-- Search Input -->
        <div class="relative w-full max-w-sm">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ابحث عن شخص..."
            style="font-family: 'IBM Plex Sans Arabic'; direction: rtl;"
            class="w-full px-4 py-2 rounded-2xl border border-[rgba(241,198,135,0.17)] focus:outline-none focus:ring-0 text-[#BE9E77] placeholder:text-[#BE9E77] placeholder:opacity-70"
            :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
          />
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.7818 21.7487L16.8435 15.9054C18.3986 14.2159 19.354 11.9815 19.354 9.52278C19.3533 4.26316 15.0211 0 9.67664 0C4.3322 0 0 4.26316 0 9.52278C0 14.7824 4.3322 19.0456 9.67664 19.0456C11.9858 19.0456 14.1037 18.2469 15.7673 16.919L21.7286 22.7854C22.0191 23.0715 22.4906 23.0715 22.7811 22.7854C23.0722 22.4993 23.0722 22.0348 22.7818 21.7487ZM9.67664 17.5804C5.15466 17.5804 1.48889 13.9729 1.48889 9.52278C1.48889 5.07266 5.15466 1.46514 9.67664 1.46514C14.1987 1.46514 17.8644 5.07266 17.8644 9.52278C17.8644 13.9729 14.1987 17.5804 9.67664 17.5804Z" fill="#F1C687"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Search Results -->
      <div v-if="showResults" class="w-full mt-12 mb-8 px-4">
        <div 
          class="w-full max-w-6xl mx-auto p-6 rounded-2xl border border-[rgba(241,198,135,0.17)]"
          :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
        >
          <div v-if="status === 'pending'" class="text-center py-8">
            <p :style="{ color: textColor }">جاري التحميل...</p>
          </div>
          <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
            <p :style="{ color: textColor }">لا توجد نتائج</p>
          </div>
          <div v-else class="overflow-x-auto pb-4 custom-scrollbar">
            <div class="flex gap-4 min-w-max">
              <div 
                v-for="user in filteredUsers" 
                :key="user.value"
                @click="selectUser(user)"
                class="flex flex-col items-center gap-3 p-4 my-4 mx-2 rounded-2xl min-w-[160px] border transition-all hover:scale-103 cursor-pointer"
                :class="[
                  selectedUser?.value === user.value 
                    ? (isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.9)] to-[rgba(241,198,135,0.9)]' : 'bg-gradient-to-r from-[rgba(190,158,119,0.9)] to-[rgba(241,198,135,0.9)]')
                    : (isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.15)] to-[rgba(241,198,135,0.15)]' : 'bg-gradient-to-r from-[rgba(190,158,119,0.15)] to-[rgba(241,198,135,0.15)]'),
                  selectedUser?.value === user.value ? 'border-[#F1C687] border-1' : 'border-[rgba(241,198,135,0.17)]'
                ]"
              >
                <img 
                  :src="user.avatar?.src" 
                  :alt="user.avatar?.alt"
                  class="w-30 h-30 rounded-lg object-cover"
                />
                <p 
                  class="text-center font-medium text-sm"
                  :style="{ color: textColor }"
                >
                  {{ user.label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Details Card -->
        <div 
          v-if="selectedUser"
          class="w-full max-w-6xl mx-auto mt-6 p-6 rounded-2xl border border-[rgba(241,198,135,0.17)]"
          :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Image Section -->
            <div class="flex-shrink-0">
              <img 
                :src="selectedUser.avatar?.src" 
                :alt="selectedUser.avatar?.alt"
                class="w-36 h-36 rounded-2xl object-cover border border-[rgba(241,198,135,0.17)]"
              />
            </div>
            
            <!-- Two Column Details Section -->
            <div class="flex-1 flex flex-col md:flex-row gap-6">
              <!-- Column 1 -->
              <div class="flex-1 space-y-4 text-center">
                <div class="mb-8">
                  <p class="text-base text-xl" :style="{ color: textColor }">محمد</p>
                  <p class="text-base text-xl" :style="{ color: textColor }">
                    بن سعود بن سلطان القاسمي
                  </p>
                </div>
                <div>
                  <p class="text-base" :style="{ color: textColor }">
                    الام :   الشيخة ناعمة بنت محمد بن صقر بن خالد القاسمي
                  </p>
                </div>
                <div>
                  <p class="text-base" :style="{ color: textColor }">
                    الزوجة :  سوسن بنت محمد بن سلطان بن خالد القاسمي
                  </p>
                </div>
              </div>
              
              <!-- Vertical Separator -->
              <div class="hidden md:block w-px mx-2" :style="{ backgroundColor: textColor, opacity: '0.3' }"></div>
              
              <!-- Column 2 -->
              <div class="flex-1 space-y-4 text-center">
                <div>
                  <p class="text-base mb-8" :style="{ color: textColor }">الأخوة</p>
                </div>
                <div>
                  <p class="text-base" :style="{ color: textColor }">عزة - نجلاء - وفاء - عائشة - سوسن</p>
                  <p class="text-base" :style="{ color: textColor }"> الشيخ عبدالله بن محمد بن على آل ثاني</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- View Details Link -->
          <div class="flex justify-end mt-4">
            <NuxtLink
              :to="`/search/${selectedUser.value}`"
              class="text-base underline hover:opacity-70 transition-opacity duration-300"
              :style="{ color: textColor }"
            >
              عرض التفاصيل الكاملة
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(241, 198, 135, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, rgba(190, 158, 119, 0.6), rgba(241, 198, 135, 0.6));
  border-radius: 10px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, rgba(190, 158, 119, 0.9), rgba(241, 198, 135, 0.9));
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(190, 158, 119, 0.6) rgba(241, 198, 135, 0.1);
}
</style>
