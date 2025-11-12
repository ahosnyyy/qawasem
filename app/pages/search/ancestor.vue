<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

const { data: usersData, status } = await useFetch<{ id: number, name: string }[]>('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users',
  lazy: true
})

const users = computed<SelectMenuItem[]>(() => {
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

const person1 = ref<SelectMenuItem | undefined>(undefined)
const person2 = ref<SelectMenuItem | undefined>(undefined)
const showResults = ref(false)

// Dummy data for search results
const searchResults = ref({
  commonAncestor: {
    name: 'أحمد القاسمي',
    image: 'https://i.pravatar.cc/150?img=10'
  },
  leftBranch: [
    {
      name: 'سلطان بن أحمد القاسمي',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'محمد بن سلطان القاسمي',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'علي بن محمد القاسمي',
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ],
  rightBranch: [
    {
      name: 'خالد بن أحمد القاسمي',
      image: 'https://i.pravatar.cc/150?img=4'
    },
    {
      name: 'راشد بن خالد القاسمي',
      image: 'https://i.pravatar.cc/150?img=5'
    }
  ]
})

function handleSearch() {
  showResults.value = true
  // TODO: Fetch results from API when person1 and person2 are selected
  // For now, showing dummy data
  console.log('Person 1:', person1.value)
  console.log('Person 2:', person2.value)
}
</script>

<template>
  <div>
    <div class="relative flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12">
      <!-- Title and Search Section -->
      <div class="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto px-4">
        <!-- Title -->
        <h1 class="text-2xl md:text-3xl text-center mb-4"
        :style="{ color: textColor }"
        >
          البحث بين شخصين
        </h1>
        
        <!-- Select Menu -->
        <div class="flex flex-col sm:flex-row gap-4 md:gap-12 w-full items-center justify-center">
          <PersonSelectMenu
            v-model="person1"
            :items="users"
            :loading="status === 'pending'"
            placeholder="ادخل اسم الشخص الأول"
            class="flex-1"
          />
          
          <img 
            src="/icons/exchange.svg" 
            alt="exchange" 
            class="w-8 h-8 sm:w-6 sm:h-6"
          />
          
          <PersonSelectMenu
            v-model="person2"
            :items="users"
            :loading="status === 'pending'"
            placeholder="ادخل اسم الشخص الثاني"
            class="flex-1"
          />
        </div>
        <!-- Buttons Container -->
        <div class="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16">
          <!-- Search Button -->
          <button
            @click="handleSearch"
            class="bg-[#BE9E77] min-w-2xs hover:scale-105 text-[#5E402D] py-2 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            اظهر نتيجة البحث
          </button>
          
          <!-- Download Button - shown only when results exist -->
          <button
            v-if="showResults"
            class="bg-[#4A2E1E] hover:scale-105 text-[#F1C687] py-2 min-w-2xs hover:scale-105 rounded-2xl transition-all duration-300"
          >
            <span>تحميل نتيجة البحث PDF</span>
          </button>
        </div>
      </div>
      
      <!-- Search Results -->
      <div v-if="showResults" class="w-full mt-12 mb-8">
        <!-- Separator Line -->
        <div class="w-full max-w-4xl mx-auto px-4 mb-12">
          <div 
            class="h-px w-full opacity-30"
            :style="{ backgroundColor: textColor }"
          ></div>
        </div>
        
        <div class="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
          
          <!-- Common Ancestor (Parent Node) -->
          <div class="flex flex-col items-center mb-6">
            <div class="relative">
              <img 
                :src="searchResults.commonAncestor.image" 
                :alt="searchResults.commonAncestor.name"
                class="rounded-full object-cover w-32 h-32 md:w-36 md:h-36"
                style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
              />
            </div>
            <p 
              class="mt-4 text-center text-base md:text-lg"
              :style="{ color: textColor }"
            >
              {{ searchResults.commonAncestor.name }}
            </p>
          </div>

          <!-- Connecting Lines from Parent to Branches -->
          <div class="relative w-full">
            <!-- Vertical line from parent -->
            <div 
              class="absolute left-1/2 top-0 w-px h-16 transform -translate-x-1/2"
              :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
            ></div>
            <!-- Circle with Dot at junction -->
            <div class="absolute left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center">
              <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }"></div>
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }"></div>
            </div>
            <!-- Horizontal line connecting both branches -->
            <div 
              class="absolute top-16 left-[25%] right-[25%] h-px"
              :style="{ background: `repeating-linear-gradient(to right, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
            ></div>
          </div>

          <!-- Two Branches -->
          <div class="flex flex-row w-full items-start justify-between gap-12 md:gap-16 lg:gap-24 mt-6">
            
            <!-- Left Branch -->
            <div class="flex-1 flex flex-col items-center">
              <div 
                v-for="(person, index) in searchResults.leftBranch" 
                :key="`left-${index}`"
                class="flex flex-col items-center"
              >
                <!-- Portrait -->
                <div class="relative">
                  <img 
                    :src="person.image" 
                    :alt="person.name"
                    class="rounded-full object-cover w-22 h-22 md:w-24 md:h-24"
                    style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                  />
                </div>
                
                <!-- Name -->
                <p 
                  class="mt-4 text-center text-sm md:text-base"
                  :style="{ color: textColor }"
                >
                  {{ person.name }}
                </p>
                
                <!-- Connecting Line (except for last item) -->
                <div 
                  v-if="index < searchResults.leftBranch.length - 1"
                  class="h-6 md:h-8 mt-4 relative flex items-start justify-center"
                >
                  <!-- Dashed Line -->
                  <div 
                    class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px"
                    :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                  ></div>
                  <!-- Circle with Dot -->
                  <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                    <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }"></div>
                    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }"></div>
                  </div>
                </div>
              </div>
              
              <!-- Label for First Person -->
              <p 
                class="mt-6 text-center text-base md:text-lg font-semibold"
                :style="{ color: textColor }"
              >
                الشخص الأول
              </p>
            </div>

            <!-- Right Branch -->
            <div class="flex-1 flex flex-col items-center">
              <div 
                v-for="(person, index) in searchResults.rightBranch" 
                :key="`right-${index}`"
                class="flex flex-col items-center"
              >
                <!-- Portrait -->
                <div class="relative">
                  <img 
                    :src="person.image" 
                    :alt="person.name"
                    class="rounded-full object-cover w-22 h-22 md:w-24 md:h-24"
                    style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                  />
                </div>
                
                <!-- Name -->
                <p 
                  class="mt-4 text-center text-sm md:text-base"
                  :style="{ color: textColor }"
                >
                  {{ person.name }}
                </p>
                
                <!-- Connecting Line (except for last item) -->
                <div 
                  v-if="index < searchResults.rightBranch.length - 1"
                  class="h-6 md:h-8 mt-4 relative flex items-start justify-center"
                >
                  <!-- Dashed Line -->
                  <div 
                    class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px"
                    :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                  ></div>
                  <!-- Circle with Dot -->
                  <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                    <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }"></div>
                    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }"></div>
                  </div>
                </div>
              </div>
              
              <!-- Label for Second Person -->
              <p 
                class="mt-6 text-center text-base md:text-lg font-semibold"
                :style="{ color: textColor }"
              >
                الشخص الثاني
              </p>
            </div>

          </div>
        </div>
      </div>
      
      <div v-if="!showResults" class="relative w-full flex justify-center">
        

      </div>
    </div>
  </div>
</template>
