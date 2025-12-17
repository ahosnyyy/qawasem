<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

import PedigreeCertificatePdf from "~/components/pedigree-certificate-pdf.client.vue";

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

// Search query for the select menu
const searchQuery = ref("");

// Debounced search query
const debouncedSearchQuery = ref("");

// Debounce function
let debounceTimer: NodeJS.Timeout | null = null;

watch(searchQuery, (newValue) => {
  if (debounceTimer)
    clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = newValue;
  }, 300);
});

// Cleanup timer on unmount
onUnmounted(() => {
  if (debounceTimer)
    clearTimeout(debounceTimer);
});

// Fetch family members for the dropdown
const { data: apiResponse, status } = await useFetch<{
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
  key: "pedigree-family-members",
  lazy: true,
  params: computed(() => ({
    PageNumber: 1,
    PageSize: debouncedSearchQuery.value ? 50 : 10, // Load 10 initially, 50 when searching
    ...(debouncedSearchQuery.value && { Search: debouncedSearchQuery.value }),
  })),
  watch: [debouncedSearchQuery],
});

// Map family members to SelectMenuItem format
const users = computed<SelectMenuItem[]>(() => {
  if (!apiResponse.value?.data?.data)
    return [];
  return apiResponse.value.data.data.map(member => ({
    label: member.fullName,
    value: String(member.id),
    avatar: {
      src: member.photoUrl,
      alt: member.fullName,
    },
  }));
});

const value = ref<SelectMenuItem | undefined>(undefined);
const showResults = ref(false);

// Clear results when user selects a different person
watch(value, () => {
  showResults.value = false;
});
const showPrintModal = ref(false);
const certificateRef = ref<InstanceType<typeof PedigreeCertificatePdf> | null>(null);

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

type ParentMember = {
  id: number;
  title: string;
  fullName: string;
  photo: string;
  isStillLive: boolean;
  gender: string;
  parent: ParentMember | null;
};

type MemberDetailsResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    id: number;
    title: string;
    fullName: string;
    mobile: string | null;
    bod: string | null;
    isStillLive: boolean;
    gender: string;
    bio: string | null;
    jobTitle: string | null;
    branch: string | null;
    education: string | null;
    photoUrl: string;
    relations: any[];
    parent: ParentMember | null;
    childs: any[];
  };
  errors: any;
};

// Fetch member details
const detailsUrl = computed(() => {
  const selectedValue = value.value;
  if (selectedValue && typeof selectedValue === "object" && "value" in selectedValue) {
    return `/api/family-members/${selectedValue.value}/details`;
  }
  return "";
});

const { data: memberDetails, status: detailsStatus, error: detailsError, refresh: refreshDetails } = await useFetch<MemberDetailsResponse>(
  detailsUrl,
  {
    key: "pedigree-member-details",
    lazy: true,
    immediate: false,
  },
);

// Build hierarchy from parent chain
function buildHierarchy(member: ParentMember | null, currentMember: MemberDetailsResponse["data"] | null): Array<{ name: string; image: string; isStillLive: boolean; gender: string }> {
  const hierarchy: Array<{ name: string; image: string; isStillLive: boolean; gender: string }> = [];

  // Add current member first
  if (currentMember) {
    hierarchy.push({
      name: currentMember.fullName,
      image: currentMember.photoUrl,
      isStillLive: currentMember.isStillLive,
      gender: currentMember.gender,
    });
  }

  // Traverse parent chain
  let current = member;
  while (current) {
    hierarchy.push({
      name: current.fullName,
      image: current.photo,
      isStillLive: current.isStillLive,
      gender: current.gender,
    });
    current = current.parent;
  }

  return hierarchy;
}

// Computed search results
const searchResults = computed(() => {
  if (!memberDetails.value?.data)
    return null;

  const data = memberDetails.value.data;
  const hierarchy = buildHierarchy(data.parent, data);

  return {
    mainTitle: data.fullName,
    lineage: " بن كايد بن قضيب بن رحمة (كايد) بن حمود عدوان بن محمد بن أحمد (الشيخ الصالح) بن صقر (القواس) بن علي بن صقر (القواس) بن قائد رحمة بن إدريس (شرف) بن زيد (مزيد) بن قائد رحمة بن القاسم بن علي (أبو القاسم) بن القاسم بن علي بن الحسين بن راشد (عفيص \ عفيصان) بن فضل (المفضل) بن إدريس (شرف الدين) بن رحمة (قائد) بن محمد (جياش) بن الحسن (أبو دريد) بن إدريس (فارس العرب) بن القاسم (الحرابي) بن الأمير محمد (الثائر) بن موسى (الثاني) بن عبدالله (الشيخ الصالح) بن موسى (الجون) بن عبدالله (المحض) بن الحسن (المثنى) بن الحسن (السبط)بن الحسين بن علي بن أبي طالب",
    hierarchy,
  };
});

async function handleSearch() {
  if (!value.value) {
    // TODO: Show error message to user
    return;
  }

  // Trigger the API call
  await refreshDetails();
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
  <div>
    <div class="relative flex flex-col items-center justify-start w-full px-4 sm:px-6 lg:px-10">
      <!-- Title and Search Section -->
      <div class="flex flex-col items-center gap-8 w-full max-w-2xl">
        <!-- Title -->
        <h1
          class="text-2xl md:text-3xl text-center mb-4"
          :style="{ color: textColor }"
        >
          وثاق عائــلــي
        </h1>

        <!-- Select Menu -->
        <PersonSelectMenu
          v-model="value"
          :items="users"
          :loading="status === 'pending'"
          :show-loading-indicator="false"
          placeholder="ادخل اسم الشخص"
          @search="searchQuery = $event"
        />

        <!-- Buttons Container -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <!-- Search Button -->
          <button
            :disabled="!value || detailsStatus === 'pending'"
            class="bg-[#BE9E77] min-w-2xs hover:scale-105 text-[#5E402D] py-2 rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSearch"
          >
            {{ detailsStatus === 'pending' ? 'جاري البحث...' : 'اظهر نتيجة البحث' }}
          </button>

          <!-- PDF Certificate Button - shown only when results exist -->
          <button
            v-if="showResults && searchResults"
            class="bg-[#4A2E1E] hover:scale-105 text-[#F1C687] py-2 min-w-2xs rounded-2xl transition-all duration-300"
            @click="openPrintModal"
          >
            <span>حفظ شهادة النسب PDF</span>
          </button>

          <!-- Hidden Certificate Component -->
          <PedigreeCertificatePdf
            v-if="showResults && searchResults"
            ref="certificateRef"
            :name="searchResults.mainTitle"
            :lineage="searchResults.lineage"
            class="hidden"
          />
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="showResults" class="w-full mt-24 mb-8">
        <!-- Loading State -->
        <div v-if="detailsStatus === 'pending'" class="text-center py-8">
          <p :style="{ color: textColor }">
            جاري تحميل النسب...
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="detailsError" class="text-center py-8">
          <p :style="{ color: textColor }" class="text-red-500">
            حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
          </p>
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
            <p
              v-if="!memberDetails?.data?.isStillLive"
              class="text-lg md:text-xl mb-16 text-center"
              :style="{ color: textColor, fontFamily: 'Mohammad Bold Art, sans-serif', opacity: 0.7 }"
            >
              {{ memberDetails?.data?.gender === 'أنثى' ? 'رحمها الله' : 'رحمه الله' }}
            </p>

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
                  class="rounded-full object-cover"
                  :class="[
                    index === 0 ? 'w-32 h-32 md:w-36 md:h-36' : 'w-26 h-26',
                  ]"
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

              <!-- Connecting Line (except for last item) -->
              <div
                v-if="index < searchResults.hierarchy.length - 1"
                class="h-6 md:h-8 mt-6 relative flex items-start justify-center"
              >
                <!-- Dashed Line -->
                <div
                  class="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5"
                  style="background: repeating-linear-gradient(to bottom, #F1C687 0px, #F1C687 3px, transparent 3px, transparent 8px);"
                />
                <!-- Circle with Dot -->
                <div class="relative z-10 flex items-center justify-center -translate-y-1/2">
                  <!-- Outer Circle -->
                  <div class="absolute w-6 h-6 rounded-full border-1 border-[#F1C687]" />
                  <!-- Inner Dot -->
                  <div class="w-3 h-3 rounded-full bg-[#F1C687]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
