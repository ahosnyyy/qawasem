<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const colorMode = useColorMode();
const appConfig = useAppConfig();

const isDark = computed(() => colorMode.value === "dark");
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

interface FamilyMember {
  id: number
  title: string
  fullName: string
  mobile: string | null
  bod: string | null
  gender: string
  jobTitle: string | null
  branch: string | null
  education: string | null
  isStillLive: boolean
  motherName: string | null
  wifeName: string | null
  photoUrl: string
}

// Fetch all family members for the dropdown (with large page size)
const { data: apiResponse, status } = await useFetch<{
  success: boolean
  status: number
  message: string
  data: {
    pageNumber: number
    pageSize: number
    totalRecords: number
    data: FamilyMember[]
  }
  errors: any
}>('/api/family-members/search', {
  key: 'pedigree-family-members',
  lazy: true,
  params: {
    PageNumber: 1,
    PageSize: 1000 // Large page size to get all members
  }
})

// Map family members to SelectMenuItem format
const users = computed<SelectMenuItem[]>(() => {
  if (!apiResponse.value?.data?.data) return []
  return apiResponse.value.data.data.map(member => ({
    label: member.fullName,
    value: String(member.id),
    avatar: { 
      src: member.photoUrl,
      alt: member.fullName
    }
  }))
})

const value = ref<SelectMenuItem | undefined>(undefined)
const showResults = ref(false)

interface ParentMember {
  id: number
  title: string
  fullName: string
  photo: string
  isStillLive: boolean
  parent: ParentMember | null
}

interface MemberDetailsResponse {
  success: boolean
  status: number
  message: string
  data: {
    id: number
    title: string
    fullName: string
    mobile: string | null
    bod: string | null
    isStillLive: boolean
    gender: string
    bio: string | null
    jobTitle: string | null
    branch: string | null
    education: string | null
    photoUrl: string
    relations: any[]
    parent: ParentMember | null
    childs: any[]
  }
  errors: any
}

// Fetch member details
const detailsUrl = computed(() => {
  const selectedValue = value.value
  if (selectedValue && typeof selectedValue === 'object' && 'value' in selectedValue) {
    return `/api/family-members/${selectedValue.value}/details`
  }
  return ''
})

const { data: memberDetails, status: detailsStatus, error: detailsError, refresh: refreshDetails } = await useFetch<MemberDetailsResponse>(
  detailsUrl,
  {
    key: 'pedigree-member-details',
    lazy: true,
    immediate: false
  }
)

// Build hierarchy from parent chain
const buildHierarchy = (member: ParentMember | null, currentMember: MemberDetailsResponse['data'] | null): Array<{ name: string; image: string }> => {
  const hierarchy: Array<{ name: string; image: string }> = []
  
  // Add current member first
  if (currentMember) {
    hierarchy.push({
      name: currentMember.fullName,
      image: currentMember.photoUrl
    })
  }
  
  // Traverse parent chain
  let current = member
  while (current) {
    hierarchy.push({
      name: current.fullName,
      image: current.photo
    })
    current = current.parent
  }
  
  return hierarchy
}

// Computed search results
const searchResults = computed(() => {
  if (!memberDetails.value?.data) return null
  
  const data = memberDetails.value.data
  const hierarchy = buildHierarchy(data.parent, data)
  
  return {
    mainTitle: data.fullName,
    lineage: 'بن صقر بن خالد بن سلطان بن صقر بن راشد بن مطر بن كايد بن قضيب بن رحمة (كايد) بن حمود عدوان بن محمد بن أحمد (الشيخ الصالح) بن صقر (القواس) بن علي بن صقر (القواس) بن قائد رحمة بن إدريس (شرف) بن زيد (مزيد) بن قائد رحمة بن القاسم بن علي (أبو القاسم) بن القاسم بن علي بن الحسين بن راشد (عفيص \ عفيصان) بن فضل (المفضل) بن إدريس (شرف الدين) بن رحمة (قائد) بن محمد (جياش) بن الحسن (أبو دريد) بن إدريس (فارس العرب) بن القاسم (الحرابي) بن الأمير محمد (الثائر) بن موسى (الثاني) بن عبدالله (الشيخ الصالح) بن موسى (الجون) بن عبدالله (المحض) بن الحسن (المثنى) بن الحسن (السبط)بن الحسين بن علي بن أبي طالب',
    hierarchy: hierarchy
  }
})

async function handleSearch() {
  if (!value.value) {
    // TODO: Show error message to user
    return
  }
  
  // Trigger the API call
  await refreshDetails()
  showResults.value = true
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
            :disabled="!value || detailsStatus === 'pending'"
            class="bg-[#BE9E77] min-w-2xs hover:scale-105 text-[#5E402D] py-2 rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ detailsStatus === 'pending' ? 'جاري البحث...' : 'اظهر نتيجة البحث' }}
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
        <!-- Loading State -->
        <div v-if="detailsStatus === 'pending'" class="text-center py-8">
          <p :style="{ color: textColor }">جاري تحميل النسب...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="detailsError" class="text-center py-8">
          <p :style="{ color: textColor }" class="text-red-500">حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>

        <!-- Results -->
        <div v-else-if="searchResults" class="flex flex-col lg:flex-row gap-12 lg:gap-40 px-6 md:px-12">
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
