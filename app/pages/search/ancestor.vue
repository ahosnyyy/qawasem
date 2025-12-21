<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

import SearchBetweenCertificatePdf from "~/components/search-between-certificate-pdf.client.vue";

const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

type FamilyMember = {
  id: number;
  title: string;
  fullName: string;
  mobile: string | null;
  bod: string | null;
  gender: string;
  jobTitle: string | null;
  branch: string | null;
  education: string | null;
  isStillLive: boolean;
  motherName: string | null;
  wifeName: string | null;
  photoUrl: string;
};

// Search queries for each select menu
const searchQuery1 = ref("");
const searchQuery2 = ref("");

// Debounced search queries
const debouncedSearchQuery1 = ref("");
const debouncedSearchQuery2 = ref("");

// Debounce function
let debounceTimer1: NodeJS.Timeout | null = null;
let debounceTimer2: NodeJS.Timeout | null = null;

watch(searchQuery1, (newValue) => {
  if (debounceTimer1)
    clearTimeout(debounceTimer1);
  debounceTimer1 = setTimeout(() => {
    debouncedSearchQuery1.value = newValue;
  }, 300);
});

watch(searchQuery2, (newValue) => {
  if (debounceTimer2)
    clearTimeout(debounceTimer2);
  debounceTimer2 = setTimeout(() => {
    debouncedSearchQuery2.value = newValue;
  }, 300);
});

// Cleanup timers on unmount
onUnmounted(() => {
  if (debounceTimer1)
    clearTimeout(debounceTimer1);
  if (debounceTimer2)
    clearTimeout(debounceTimer2);
});

// Fetch family members for person1 dropdown
const { data: apiResponse1, status: status1 } = await useFetch<{
  success: boolean;
  status: number;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    data: FamilyMember[];
  };
  errors: any;
}>("/api/family-members/search", {
  key: "ancestor-family-members-1",
  lazy: true,
  params: computed(() => ({
    PageNumber: 1,
    PageSize: debouncedSearchQuery1.value ? 50 : 10, // Load 10 initially, 50 when searching
    ...(debouncedSearchQuery1.value && { Search: debouncedSearchQuery1.value }),
  })),
  watch: [debouncedSearchQuery1],
});

// Fetch family members for person2 dropdown
const { data: apiResponse2, status: status2 } = await useFetch<{
  success: boolean;
  status: number;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    data: FamilyMember[];
  };
  errors: any;
}>("/api/family-members/search", {
  key: "ancestor-family-members-2",
  lazy: true,
  params: computed(() => ({
    PageNumber: 1,
    PageSize: debouncedSearchQuery2.value ? 50 : 10, // Load 10 initially, 50 when searching
    ...(debouncedSearchQuery2.value && { Search: debouncedSearchQuery2.value }),
  })),
  watch: [debouncedSearchQuery2],
});

// Map family members to SelectMenuItem format for person1
const users1 = computed<SelectMenuItem[]>(() => {
  if (!apiResponse1.value?.data?.data)
    return [];
  return apiResponse1.value.data.data.map(member => ({
    label: member.fullName,
    value: String(member.id),
    avatar: {
      src: member.photoUrl,
      alt: member.fullName,
    },
  }));
});

// Map family members to SelectMenuItem format for person2
const users2 = computed<SelectMenuItem[]>(() => {
  if (!apiResponse2.value?.data?.data)
    return [];
  return apiResponse2.value.data.data.map(member => ({
    label: member.fullName,
    value: String(member.id),
    avatar: {
      src: member.photoUrl,
      alt: member.fullName,
    },
  }));
});

const person1 = ref<SelectMenuItem | undefined>(undefined);
const person2 = ref<SelectMenuItem | undefined>(undefined);
const showResults = ref(false);

// Clear results when user selects a different person
watch([person1, person2], () => {
  showResults.value = false;
});
const showPrintModal = ref(false);
const certificateRef = ref<InstanceType<typeof SearchBetweenCertificatePdf> | null>(null);

function openPrintModal() {
  showPrintModal.value = true;
}

async function handlePrint() {
  showPrintModal.value = false;
  await certificateRef.value?.printPDF();
}

async function handleDownload() {
  showPrintModal.value = false;
  await certificateRef.value?.downloadPDF();
}

type AncestorMember = {
  id: number;
  title: string;
  fullName: string;
  photo: string;
  isStillLive: boolean;
  gender: string;
  parent: any;
};

type SearchBetweenResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    member1: AncestorMember[];
    member2: AncestorMember[];
    commonAncestor: AncestorMember;
  };
  errors: any;
};

// Fetch common ancestor data
const searchUrl = computed(() => {
  const p1 = person1.value;
  const p2 = person2.value;
  if (p1 && typeof p1 === "object" && "value" in p1 && p2 && typeof p2 === "object" && "value" in p2) {
    return `/api/family-members/search-between/${p1.value}/${p2.value}`;
  }
  return "";
});

const { data: searchData, status: searchStatus, error: searchError, refresh: refreshSearch } = await useFetch<SearchBetweenResponse>(
  searchUrl,
  {
    key: "search-between-ancestors",
    lazy: true,
    immediate: false,
  },
);

// Map API response to display format
const searchResults = computed(() => {
  if (!searchData.value?.data)
    return null;

  const data = searchData.value.data;
  return {
    commonAncestor: {
      name: data.commonAncestor.fullName,
      image: data.commonAncestor.photo,
      isStillLive: data.commonAncestor.isStillLive,
      gender: data.commonAncestor.gender,
    },
    leftBranch: data.member1.map((member: AncestorMember) => ({
      name: member.fullName,
      image: member.photo,
      isStillLive: member.isStillLive,
      gender: member.gender,
    })).reverse(),
    rightBranch: data.member2.map((member: AncestorMember) => ({
      name: member.fullName,
      image: member.photo,
      isStillLive: member.isStillLive,
      gender: member.gender,
    })).reverse(),
  };
});

async function handleSearch() {
  if (!person1.value || !person2.value) {
    // TODO: Show error message to user
    return;
  }

  // Trigger the API call
  await refreshSearch();
  showResults.value = true;
}

// Define keyboard shortcut for Enter key - only triggers when no input is focused
defineShortcuts({
  enter: {
    usingInput: false,
    handler: handleSearch,
  },
});
</script>

<template>
  <div class="animate-fade-in">
    <div class="relative flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12">
      <!-- Title and Search Section -->
      <div class="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto px-4">
        <!-- Title -->
        <h1
          class="text-2xl md:text-3xl text-center mb-4 animate-fade-in-down"
          :style="{ color: textColor }"
        >
          البحث بين شخصين
        </h1>

        <!-- Select Menu -->
        <div class="flex flex-col sm:flex-row gap-4 md:gap-12 w-full items-center justify-center">
          <div class="flex-1 animate-fade-in-left animate-delay-200">
            <PersonSelectMenu
              v-model="person1"
              :items="users1"
              :loading="status1 === 'pending'"
              :show-loading-indicator="false"
              placeholder="أدخل اسم الشخصية الأولي"
              class="w-full"
              @search="searchQuery1 = $event"
            />
          </div>

          <img
            src="/icons/exchange.svg"
            alt="exchange"
            class="w-8 h-8 sm:w-6 sm:h-6 animate-scale-in animate-delay-300"
          >

          <div class="flex-1 animate-fade-in-right animate-delay-200">
            <PersonSelectMenu
              v-model="person2"
              :items="users2"
              :loading="status2 === 'pending'"
              :show-loading-indicator="false"
              placeholder="أدخل اسم الشخصية الثانية"
              class="w-full"
              @search="searchQuery2 = $event"
            />
          </div>
        </div>
        <!-- Buttons Container -->
        <div class="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16">
          <!-- Search Button -->
          <button
            :disabled="!person1 || !person2 || searchStatus === 'pending'"
            class="bg-[#BE9E77] min-w-2xs hover:scale-105 text-[#5E402D] py-2 rounded-2xl transition-smooth btn-hover-glow disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up animate-delay-300"
            @click="handleSearch"
          >
            {{ searchStatus === 'pending' ? 'جاري البحث...' : 'أظهر نتيجة البحث' }}
          </button>

          <!-- PDF Certificate Button - shown only when results exist -->
          <button
            v-if="showResults && searchResults && searchData?.data"
            class="bg-[#4A2E1E] hover:scale-105 text-[#F1C687] py-2 min-w-2xs rounded-2xl transition-all duration-300"
            @click="openPrintModal"
          >
            <span>حفظ شهادة البحث PDF</span>
          </button>

          <!-- Hidden Certificate Component -->
          <SearchBetweenCertificatePdf
            v-if="showResults && searchResults && searchData?.data"
            ref="certificateRef"
            :common-ancestor="searchData.data.commonAncestor"
            :member1="searchData.data.member1"
            :member2="searchData.data.member2"
            class="hidden"
          />
        </div>
      </div>

      <!-- Search Results -->
      <Transition name="results-fade">
        <div v-if="showResults" class="w-full mt-12 mb-8">
          <!-- Loading State -->
          <div v-if="searchStatus === 'pending'" class="text-center py-8">
            <p :style="{ color: textColor }">
              جاري البحث عن السلف المشترك...
            </p>
          </div>

          <!-- Error State -->
          <div v-else-if="searchError" class="text-center py-8">
            <p :style="{ color: textColor }" class="text-red-500">
              حدث خطأ في البحث. يرجى المحاولة مرة أخرى.
            </p>
          </div>

          <!-- Results -->
          <div v-else-if="searchResults" class="w-full">
            <!-- Separator Line -->
            <div class="w-full max-w-4xl mx-auto px-4 mb-12">
              <div
                class="h-px w-full opacity-30"
                :style="{ backgroundColor: textColor }"
              />
            </div>

            <div class="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
              <!-- Common Ancestor (Parent Node) -->
              <div class="flex flex-col items-center mb-6 animate-fade-in-scale animate-delay-200">
                <div class="relative">
                  <img
                    :src="searchResults.commonAncestor.image"
                    :alt="searchResults.commonAncestor.name"
                    class="rounded-full object-cover w-32 h-32 md:w-36 md:h-36 img-hover-lift transition-smooth"
                    style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                  >
                </div>
                <p
                  class="mt-4 text-center text-base md:text-lg"
                  :style="{ color: textColor }"
                >
                  {{ searchResults.commonAncestor.name }}
                </p>
                <p
                  v-if="!searchResults.commonAncestor.isStillLive"
                  class="mt-1 text-center text-sm"
                  :style="{ color: textColor, opacity: 0.7 }"
                >
                  {{ (searchResults.commonAncestor.gender || searchData?.data?.commonAncestor?.gender) === 'أنثى' ? 'رحمها الله' : 'رحمه الله' }}
                </p>
              </div>

              <!-- Connecting Lines from Parent to Branches (only show if both branches have members) -->
              <div v-if="searchResults.leftBranch.length > 0 && searchResults.rightBranch.length > 0" class="relative w-full">
                <!-- Vertical line from parent -->
                <div
                  class="absolute left-1/2 top-0 w-px h-16 transform -translate-x-1/2"
                  :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                />
                <!-- Circle with Dot at junction -->
                <div class="absolute left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center">
                  <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }" />
                  <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }" />
                </div>
                <!-- Horizontal line connecting both branches -->
                <div
                  class="absolute top-16 left-[25%] right-[25%] h-px"
                  :style="{ background: `repeating-linear-gradient(to right, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                />
              </div>

              <!-- Two Branches Layout (when both have members) -->
              <div v-if="searchResults.leftBranch.length > 0 && searchResults.rightBranch.length > 0" class="flex flex-row w-full items-start justify-between gap-12 md:gap-16 lg:gap-24 mt-6">
                <!-- Left Branch -->
                <div class="flex-1 flex flex-col items-center">
                  <div
                    v-for="(person, index) in searchResults.leftBranch"
                    :key="`left-${index}`"
                    class="flex flex-col items-center animate-fade-in-left"
                    :style="{ animationDelay: `${(index + 1) * 0.1}s` }"
                  >
                    <!-- Portrait -->
                    <div class="relative">
                      <img
                        :src="person.image"
                        :alt="person.name"
                        class="rounded-full object-cover w-22 h-22 md:w-24 md:h-24 img-hover-lift transition-smooth"
                        style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                      >
                    </div>

                    <!-- Name -->
                    <p
                      class="mt-4 text-center text-sm md:text-base"
                      :style="{ color: textColor }"
                    >
                      {{ person.name }}
                    </p>
                    <p
                      v-if="!person.isStillLive"
                      class="mt-1 text-center text-xs"
                      :style="{ color: textColor, opacity: 0.7 }"
                    >
                      {{ (person.gender || searchData?.data?.member1?.[searchResults.leftBranch.length - 1 - index]?.gender) === 'أنثى' ? 'رحمها الله' : 'رحمه الله' }}
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
                      />
                      <!-- Circle with Dot -->
                      <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                        <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }" />
                        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }" />
                      </div>
                    </div>
                  </div>

                  <!-- Label for First Person -->
                  <p
                    class="mt-6 text-center text-base md:text-lg font-semibold"
                    :style="{ color: textColor }"
                  >
                    الشخصية الأولي
                  </p>
                </div>

                <!-- Right Branch -->
                <div class="flex-1 flex flex-col items-center">
                  <div
                    v-for="(person, index) in searchResults.rightBranch"
                    :key="`right-${index}`"
                    class="flex flex-col items-center animate-fade-in-right"
                    :style="{ animationDelay: `${(index + 1) * 0.1}s` }"
                  >
                    <!-- Portrait -->
                    <div class="relative">
                      <img
                        :src="person.image"
                        :alt="person.name"
                        class="rounded-full object-cover w-22 h-22 md:w-24 md:h-24 img-hover-lift transition-smooth"
                        style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                      >
                    </div>

                    <!-- Name -->
                    <p
                      class="mt-4 text-center text-sm md:text-base"
                      :style="{ color: textColor }"
                    >
                      {{ person.name }}
                    </p>
                    <p
                      v-if="!person.isStillLive"
                      class="mt-1 text-center text-xs"
                      :style="{ color: textColor, opacity: 0.7 }"
                    >
                      {{ (person.gender || searchData?.data?.member2?.[searchResults.rightBranch.length - 1 - index]?.gender) === 'أنثى' ? 'رحمها الله' : 'رحمه الله' }}
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
                      />
                      <!-- Circle with Dot -->
                      <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                        <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }" />
                        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }" />
                      </div>
                    </div>
                  </div>

                  <!-- Label for Second Person -->
                  <p
                    class="mt-6 text-center text-base md:text-lg font-semibold"
                    :style="{ color: textColor }"
                  >
                    الشخصية الثانية
                  </p>
                </div>
              </div>

              <!-- Single Branch Layout (stratified - when one branch is empty) -->
              <div v-else class="flex flex-col items-center w-full max-w-md mx-auto">
                <!-- The non-empty branch -->
                <div
                  v-for="(person, index) in (searchResults.leftBranch.length > 0 ? searchResults.leftBranch : searchResults.rightBranch)"
                  :key="`single-${index}`"
                  class="flex flex-col items-center animate-fade-in"
                  :style="{ animationDelay: `${(index + 1) * 0.1}s` }"
                >
                  <!-- Connecting Line from common ancestor (before first item) -->
                  <div
                    v-if="index === 0"
                    class="h-6 md:h-8 mb-4 relative flex items-start justify-center"
                  >
                    <!-- Circle with Dot at top -->
                    <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                      <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }" />
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }" />
                    </div>
                    <!-- Dashed Line going down -->
                    <div
                      class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px"
                      :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                    />
                  </div>

                  <!-- Portrait -->
                  <div class="relative">
                    <img
                      :src="person.image"
                      :alt="person.name"
                      class="rounded-full object-cover w-22 h-22 md:w-24 md:h-24 img-hover-lift transition-smooth"
                      style="box-shadow: 0 0 15px rgba(241, 198, 135, 0.6), 0 0 30px rgba(241, 198, 135, 0.4);"
                    >
                  </div>

                  <!-- Name -->
                  <p
                    class="mt-4 text-center text-sm md:text-base"
                    :style="{ color: textColor }"
                  >
                    {{ person.name }}
                  </p>
                  <p
                    v-if="!person.isStillLive"
                    class="mt-1 text-center text-xs"
                    :style="{ color: textColor, opacity: 0.7 }"
                  >
                    {{ person.gender === 'أنثى' ? 'رحمها الله' : 'رحمه الله' }}
                  </p>

                  <!-- Connecting Line (after each item except last) -->
                  <div
                    v-if="index < (searchResults.leftBranch.length > 0 ? searchResults.leftBranch : searchResults.rightBranch).length - 1"
                    class="h-6 md:h-8 mt-4 relative flex items-start justify-center"
                  >
                    <!-- Dashed Line -->
                    <div
                      class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px"
                      :style="{ background: `repeating-linear-gradient(to bottom, ${textColor} 0px, ${textColor} 2px, transparent 2px, transparent 6px)` }"
                    />
                    <!-- Circle with Dot -->
                    <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                      <div class="absolute w-6 h-6 rounded-full border-1" :style="{ borderColor: textColor }" />
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: textColor }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="!showResults" class="relative w-full flex justify-center" />
    </div>

    <!-- Print/Download Modal -->
    <UModal v-model:open="showPrintModal">
      <template #content>
        <div class="p-6 text-center">
          <h3 class="text-lg font-semibold mb-6" :style="{ color: textColor }">
            اختر طريقة الحفظ
          </h3>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              class="flex items-center justify-center gap-2 bg-[#BE9E77] hover:scale-105 text-[#5E402D] py-3 px-6 rounded-2xl transition-all duration-300"
              @click="handleDownload"
            >
              <UIcon name="i-lucide-download" class="w-5 h-5" />
              <span>تحميل مباشر</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 bg-[#4A2E1E] hover:scale-105 text-[#F1C687] py-3 px-6 rounded-2xl transition-all duration-300"
              @click="handlePrint"
            >
              <UIcon name="i-lucide-printer" class="w-5 h-5" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.results-fade-enter-active {
  transition: all 0.5s ease-out;
}

.results-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
