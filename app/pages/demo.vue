<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() => isDark.value ? (appConfig.theme?.colors?.text?.dark || "#D9B27A") : (appConfig.theme?.colors?.text?.light || "#4A2E1E"));

// Base API URL
const API_BASE_URL = 'https://alqwassem-001-site1.stempurl.com/api/FamilyMembers'

// Test states
const activeTest = ref<string | null>(null)

// Test parameters
const searchQuery = ref('')
const memberId = ref('')
const id1 = ref('')
const id2 = ref('')
const pageNumber = ref(1)
const pageSize = ref(10)

// Test 1: Get all family members (index)
const { data: getAllData, pending: getAllPending, error: getAllError, refresh: refreshGetAll } = await useAsyncData(
  'getAll',
  () => {
    const params = new URLSearchParams({
      PageNumber: String(pageNumber.value),
      PageSize: String(pageSize.value)
    })
    return $fetch(`${API_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
  },
  { immediate: false }
)

// Test 2: Search family members
const { data: searchData, pending: searchPending, error: searchError, refresh: refreshSearch } = await useAsyncData(
  'search',
  () => {
    const params = new URLSearchParams({
      PageNumber: String(pageNumber.value),
      PageSize: String(pageSize.value),
      Search: searchQuery.value
    })
    return $fetch(`${API_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
  },
  { immediate: false }
)

// Test 3: Get member details
const { data: detailsData, pending: detailsPending, error: detailsError, refresh: refreshDetails } = await useAsyncData(
  'details',
  () => {
    return $fetch(`${API_BASE_URL}/${memberId.value}/details`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
  },
  { immediate: false }
)

// Test 4: Search between two members
const { data: searchBetweenData, pending: searchBetweenPending, error: searchBetweenError, refresh: refreshSearchBetween } = await useAsyncData(
  'searchBetween',
  () => {
    return $fetch(`${API_BASE_URL}/search-between/${id1.value}/${id2.value}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
  },
  { immediate: false }
)

// Validation error state
const validationError = ref<string | null>(null)

// Computed properties for unified state
const loading = computed(() => getAllPending.value || searchPending.value || detailsPending.value || searchBetweenPending.value)
const error = computed(() => {
  if (validationError.value) return validationError.value
  if (activeTest.value === 'getAll' && getAllError.value) return getAllError.value.message || 'Failed to fetch family members'
  if (activeTest.value === 'search' && searchError.value) return searchError.value.message || 'Failed to search family members'
  if (activeTest.value === 'details' && detailsError.value) return detailsError.value.message || 'Failed to fetch member details'
  if (activeTest.value === 'searchBetween' && searchBetweenError.value) return searchBetweenError.value.message || 'Failed to search between members'
  return null
})
const testResults = computed(() => {
  if (activeTest.value === 'getAll') return getAllData.value
  if (activeTest.value === 'search') return searchData.value
  if (activeTest.value === 'details') return detailsData.value
  if (activeTest.value === 'searchBetween') return searchBetweenData.value
  return null
})

// Test functions
async function testGetAll() {
  validationError.value = null
  activeTest.value = 'getAll'
  await refreshGetAll()
}

async function testSearch() {
  validationError.value = null
  if (!searchQuery.value.trim()) {
    validationError.value = 'Please enter a search query'
    activeTest.value = 'search'
    return
  }
  activeTest.value = 'search'
  await refreshSearch()
}

async function testGetDetails() {
  validationError.value = null
  if (!memberId.value.trim()) {
    validationError.value = 'Please enter a member ID'
    activeTest.value = 'details'
    return
  }
  activeTest.value = 'details'
  await refreshDetails()
}

async function testSearchBetween() {
  validationError.value = null
  if (!id1.value.trim() || !id2.value.trim()) {
    validationError.value = 'Please enter both member IDs'
    activeTest.value = 'searchBetween'
    return
  }
  activeTest.value = 'searchBetween'
  await refreshSearchBetween()
}

// Clear results
function clearResults() {
  activeTest.value = null
  validationError.value = null
}
</script>

<template>
  <div class="min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2" :style="{ color: textColor }">
          Family API Demo
        </h1>
        <p class="text-base opacity-80" :style="{ color: textColor }">
          Testing direct API calls to: {{ API_BASE_URL }}
        </p>
      </div>

      <!-- Error Display -->
      <div 
        v-if="error" 
        class="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
      >
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
      </div>

      <!-- Test Controls -->
      <div 
        class="mb-8 p-6 rounded-2xl border border-[rgba(241,198,135,0.17)]"
        :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
      >
        <h2 class="text-xl font-semibold mb-4" :style="{ color: textColor }">Test Controls</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Pagination Controls -->
          <div class="flex gap-2 items-center">
            <label class="text-sm" :style="{ color: textColor }">Page Number:</label>
            <input
              v-model.number="pageNumber"
              type="number"
              min="1"
              class="px-3 py-1 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
          </div>
          <div class="flex gap-2 items-center">
            <label class="text-sm" :style="{ color: textColor }">Page Size:</label>
            <input
              v-model.number="pageSize"
              type="number"
              min="1"
              max="100"
              class="px-3 py-1 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
          </div>
        </div>

        <!-- Test 1: Get All -->
        <div class="mb-4 p-4 rounded-lg border border-[rgba(241,198,135,0.17)] bg-opacity-50">
          <h3 class="text-lg font-medium mb-2" :style="{ color: textColor }">1. Get All Family Members</h3>
          <button
            @click="testGetAll"
            :disabled="loading"
            class="px-4 py-2 rounded-lg bg-[#4A2E1E] text-[#F1C687] hover:opacity-80 disabled:opacity-50 transition-all"
          >
            {{ loading && activeTest === 'getAll' ? 'Loading...' : 'Test Get All' }}
          </button>
        </div>

        <!-- Test 2: Search -->
        <div class="mb-4 p-4 rounded-lg border border-[rgba(241,198,135,0.17)] bg-opacity-50">
          <h3 class="text-lg font-medium mb-2" :style="{ color: textColor }">2. Search Family Members</h3>
          <div class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Enter search query..."
              class="flex-1 px-3 py-2 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
            <button
              @click="testSearch"
              :disabled="loading"
              class="px-4 py-2 rounded-lg bg-[#4A2E1E] text-[#F1C687] hover:opacity-80 disabled:opacity-50 transition-all"
            >
              {{ loading && activeTest === 'search' ? 'Loading...' : 'Search' }}
            </button>
          </div>
        </div>

        <!-- Test 3: Get Details -->
        <div class="mb-4 p-4 rounded-lg border border-[rgba(241,198,135,0.17)] bg-opacity-50">
          <h3 class="text-lg font-medium mb-2" :style="{ color: textColor }">3. Get Member Details</h3>
          <div class="flex gap-2">
            <input
              v-model="memberId"
              type="text"
              placeholder="Enter member ID..."
              class="flex-1 px-3 py-2 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
            <button
              @click="testGetDetails"
              :disabled="loading"
              class="px-4 py-2 rounded-lg bg-[#4A2E1E] text-[#F1C687] hover:opacity-80 disabled:opacity-50 transition-all"
            >
              {{ loading && activeTest === 'details' ? 'Loading...' : 'Get Details' }}
            </button>
          </div>
        </div>

        <!-- Test 4: Search Between -->
        <div class="mb-4 p-4 rounded-lg border border-[rgba(241,198,135,0.17)] bg-opacity-50">
          <h3 class="text-lg font-medium mb-2" :style="{ color: textColor }">4. Search Between Two Members</h3>
          <div class="flex gap-2">
            <input
              v-model="id1"
              type="text"
              placeholder="Member ID 1..."
              class="flex-1 px-3 py-2 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
            <input
              v-model="id2"
              type="text"
              placeholder="Member ID 2..."
              class="flex-1 px-3 py-2 rounded border border-[rgba(241,198,135,0.17)]"
              :class="isDark ? 'bg-[rgba(139,114,78,0.3)] text-white' : 'bg-white'"
            />
            <button
              @click="testSearchBetween"
              :disabled="loading"
              class="px-4 py-2 rounded-lg bg-[#4A2E1E] text-[#F1C687] hover:opacity-80 disabled:opacity-50 transition-all"
            >
              {{ loading && activeTest === 'searchBetween' ? 'Loading...' : 'Search Between' }}
            </button>
          </div>
        </div>

        <!-- Clear Button -->
        <div class="mt-4">
          <button
            @click="clearResults"
            class="px-4 py-2 rounded-lg bg-gray-500 text-white hover:opacity-80 transition-all"
          >
            Clear Results
          </button>
        </div>
      </div>

      <!-- Results Display -->
      <div 
        v-if="testResults"
        class="p-6 rounded-2xl border border-[rgba(241,198,135,0.17)]"
        :class="isDark ? 'bg-gradient-to-r from-[rgba(139,114,78,0.23)] to-[rgba(241,198,135,0.23)]' : 'bg-white'"
      >
        <h2 class="text-xl font-semibold mb-4" :style="{ color: textColor }">Results</h2>
        <div class="overflow-x-auto">
          <pre 
            class="p-4 rounded-lg overflow-auto max-h-[600px] text-sm"
            :class="isDark ? 'bg-[rgba(0,0,0,0.3)] text-gray-200' : 'bg-gray-100 text-gray-800'"
          >{{ JSON.stringify(testResults, null, 2) }}</pre>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading && !testResults" class="text-center py-8">
        <p :style="{ color: textColor }">Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

