<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">API Demo - Family Members</h1>
    
    <div class="mb-4">
      <p class="text-sm text-gray-600 mb-2">
        Endpoint: <code class="bg-gray-100 px-2 py-1 rounded">GET /api/family-members?PageNumber=1&PageSize=10</code>
      </p>
      <p class="text-xs text-gray-500 mt-1">
        (Proxied through Nuxt server to avoid CORS)
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h2 class="text-red-800 font-semibold mb-2">Error</h2>
      <pre class="text-red-600 text-sm whitespace-pre-wrap">{{ error }}</pre>
    </div>

    <!-- Success State -->
    <div v-else-if="data" class="space-y-4">
      <!-- Raw Response -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-gray-800">Raw Response</h2>
        <pre class="bg-white p-4 rounded border overflow-x-auto text-sm">{{ JSON.stringify(data, null, 2) }}</pre>
      </div>

      <!-- Formatted Data Display -->
      <div v-if="data && Array.isArray(data)" class="bg-white border border-gray-200 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-gray-800">Family Members ({{ data.length }} items)</h2>
        <div class="grid gap-4">
          <div 
            v-for="(member, index) in data" 
            :key="index"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div v-for="(value, key) in member" :key="key" class="flex">
                <span class="font-semibold text-gray-600 mr-2">{{ key }}:</span>
                <span class="text-gray-800">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- If data has pagination info or different structure -->
      <div v-else-if="data" class="bg-white border border-gray-200 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-gray-800">Response Data</h2>
        <div class="space-y-2">
          <div v-for="(value, key) in data" :key="key" class="flex flex-col">
            <span class="font-semibold text-gray-600">{{ key }}</span>
            <span class="text-gray-800 ml-4">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="mt-6">
      <button 
        @click="refresh()"
        :disabled="pending"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        {{ pending ? 'Loading...' : 'Refresh Data' }}
      </button>
    </div>
  </div>
</template>

<script setup>
// Fetch data from the local API endpoint (which proxies to the external API)
// This avoids CORS issues by making the request server-side
const { data, pending, error, refresh } = await useFetch(
  '/api/family-members',
  {
    params: {
      PageNumber: 1,
      PageSize: 10
    }
  }
)
</script>

<style scoped>
code {
  font-family: 'Courier New', Courier, monospace;
}

pre {
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;
}
</style>

