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

const value = ref<SelectMenuItem | undefined>(undefined)
const showResults = ref(false)

// Dummy data for search results
const searchResults = ref({
  mainTitle: 'سلطان بن أحمد بن سلطان',
  lineage: 'بن صقر بن خالد بن سلطان بن صقر بن راشد بن مطر بن كايد بن قضيب بن رحمة (كايد) بن حمود عدوان بن محمد بن أحمد (الشيخ الصالح) بن صقر (القواس) بن علي بن صقر (القواس) بن قائد رحمة بن إدريس (شرف) بن زيد (مزيد) بن قائد رحمة بن القاسم بن علي (أبو القاسم) بن القاسم بن علي بن الحسين بن راشد (عفيص \ عفيصان) بن فضل (المفضل) بن إدريس (شرف الدين) بن رحمة (قائد) بن محمد (جياش) بن الحسن (أبو دريد) بن إدريس (فارس العرب) بن القاسم (الحرابي) بن الأمير محمد (الثائر) بن موسى (الثاني) بن عبدالله (الشيخ الصالح) بن موسى (الجون) بن عبدالله (المحض) بن الحسن (المثنى) بن الحسن (السبط)بن الحسين بن علي بن أبي طالب',
  hierarchy: [
    {
      name: 'سلطان بن أحمد القاسمي',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'أحمد بن سلطان القاسمي',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'سلطان بن صقر القاسمي',
      image: 'https://i.pravatar.cc/150?img=3'
    },
    {
      name: 'صقر بن خالد القاسمي',
      image: 'https://i.pravatar.cc/150?img=4'
    }
  ]
})

function handleSearch() {
  showResults.value = true
  // TODO: Fetch results from API when value.value is selected
  // For now, showing dummy data
}
</script>

<template>
  <div>
    <div class="relative flex flex-col items-center justify-start w-full px-4 sm:px-6 lg:px-10">
      <!-- Title and Search Section -->
      <div class="flex flex-col items-center gap-8 w-full max-w-2xl">
        <!-- Title -->
        <h1 class="text-2xl md:text-3xl text-center mb-4"
        :style="{ color: textColor }"
        >
          وثاق عائــلــي
        </h1>
        
        <!-- Select Menu -->
        <PersonSelectMenu
          v-model="value"
          :items="users"
          :loading="status === 'pending'"
          placeholder="ادخل اسم الشخص"
        />
        
        <!-- Buttons Container -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
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
            <span>تحميل شهادة النسب PDF</span>
          </button>
        </div>
      </div>
      
      <!-- Search Results -->
      <div v-if="showResults" class="w-full mt-24 mb-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-40 px-6 md:px-12">
          <!-- Left Side: Main Lineage Text -->
          <div class="flex-1 text-justify">
            <!-- Main Title -->
            <h2 
              class="text-4xl md:text-5xl font-bold mb-16 text-center text-justift"
              :style="{ color: textColor, fontFamily: 'Mohammad Bold Art, sans-serif' }"
            >
              {{ searchResults.mainTitle }}
            </h2>
            
            <!-- Lineage Paragraph -->
            <p 
              class="text-lg md:text-2xl leading-relaxed text-justift"
              :style="{ color: textColor, fontFamily: 'Mohammad Bold Art, sans-serif' }"
            >
              {{ searchResults.lineage }}
            </p>
          </div>
          
          <!-- Right Side: Hierarchy of Portraits -->
          <div class="flex-shrink-0 flex flex-col items-center">
            <div 
              v-for="(person, index) in searchResults.hierarchy" 
              :key="index"
              class="flex flex-col items-center"
            >
              <!-- Portrait -->
              <div class="relative">
                <img 
                  :src="person.image" 
                  :alt="person.name"
                  :class="[
                    'rounded-full object-cover',
                    index === 0 ? 'w-32 h-32 md:w-36 md:h-36' : 'w-26 h-26'
                  ]"
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
                v-if="index < searchResults.hierarchy.length - 1"
                class="h-6 md:h-8 mt-6 relative flex items-start justify-center"
              >
                <!-- Dashed Line -->
                <div 
                  class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5"
                  style="background: repeating-linear-gradient(to bottom, #F1C687 0px, #F1C687 3px, transparent 3px, transparent 8px);"
                ></div>
                <!-- Circle with Dot -->
                <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                  <!-- Outer Circle -->
                  <div class="absolute w-6 h-6 rounded-full border-1 border-[#F1C687]"></div>
                  <!-- Inner Dot -->
                  <div class="w-3 h-3 rounded-full bg-[#F1C687]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!showResults" class="relative w-full flex justify-center">
        

      </div>
    </div>
  </div>
</template>
